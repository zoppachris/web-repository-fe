import { notification, Popconfirm, Table } from "antd";
import Search from "antd/lib/input/Search";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../Services/axios";

export default function AdminPage() {
  const navigate = useNavigate();
  const initialParams = {
    size: 20,
    page: 0,
    sort: "",
    search: "",
    id: "",
    roles: "admin",
  };
  const [dataAdmin, setDataAdmin] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [params, setParams] = useState(initialParams);
  const [meta, setMeta] = useState({ size: 20, page: 1, total: 0 });

  const getAdmin = useCallback(async () => {
    setLoadingTable(true);
    await API(`admin.getAdmin`, {
      params,
    })
      .then((res) => {
        setLoadingTable(false);
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          const newData = data?.content.map((item, index) => {
            return { key: index, ...item };
          });
          setDataAdmin(newData);
          setMeta({
            size: data?.size,
            page: data?.page + 1,
            total: data?.totalElements,
          });
        }
      })
      .catch((res) => {
        setLoadingTable(false);
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data admin gagal didapatkan!",
        });
      });
  }, [params]);

  const deleteAdmin = async (id) => {
    await API(`admin.deleteAdmin`, { query: { id } })
      .then((res) => {
        setParams(initialParams);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil menghapus data",
            description: "Data admin berhasil dihapus!",
          });
        } else {
          notification.info({
            message: "Gagal menghapus data",
            description: "Data admin gagal dihapus!",
          });
        }
      })
      .catch((res) => {
        notification.error({
          message: "Gagal menghapus data",
          description: "Data admin gagal dihapus!",
        });
      });
  };

  useEffect(() => {
    getAdmin();
  }, [getAdmin]);

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Nama Admin",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (text ? "Aktif" : "Tidak Aktif"),
    },
    {
      title: "Aksi",
      dataIndex: "",
      render: (record) => (
        <div className="text-primary1 md:flex-row flex-col flex gap-4 text-sm font-semibold">
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleRow("Detail", record.userId)}
          >
            Detail
          </div>
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleRow("Update", record.userId)}
          >
            Edit
          </div>
          <Popconfirm
            title="Hapus data ini?"
            placement="left"
            onConfirm={() => deleteAdmin(record.userId)}
          >
            <div className="cursor-pointer hover:opacity-80">Hapus</div>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleTable = (pagination, filter, sorter) => {
    setParams({
      ...params,
      page: pagination.current - 1,
      size: pagination.pageSize,
    });
  };

  const onSearch = (value) => {
    setParams({
      ...params,
      page: 0,
      search: value,
    });
  };

  const handleRow = (type, id) => {
    navigate(`/admin-form/${id}`, {
      state: { type: type },
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col md:flex-row w-full md:justify-between justify-center gap-5">
        <div className="md:w-10/12">
          <Search
            placeholder="Cari Nama admin atau Username"
            allowClear
            enterButton
            onSearch={onSearch}
          />
        </div>
        <div>
          <div
            className="w-full md:w-32 text-white bg-primary2 h-8 items-center justify-center flex cursor-pointer hover:opacity-90 px-4 rounded-sm"
            onClick={() =>
              navigate(`/admin-form`, {
                state: { type: "Create" },
              })
            }
          >
            + Buat Admin
          </div>
        </div>
      </div>
      <div className="md:mt-30 mt-5 w-full">
        <Table
          loading={loadingTable}
          scroll={{ x: 724 }}
          dataSource={dataAdmin}
          columns={columns}
          onChange={handleTable}
          pagination={{
            current: meta.page,
            pageSize: meta.size,
            total: meta.total,
            responsive: true,
            pageSizeOptions: ["20", "50", "100"],
            showSizeChanger: true,
            showTotal: (total, range) => (
              <p>
                {range[0]}-{range[1]} of {total} items
              </p>
            ),
          }}
        />
      </div>
    </div>
  );
}

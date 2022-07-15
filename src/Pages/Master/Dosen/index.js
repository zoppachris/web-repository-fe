import { notification, Popconfirm, Table } from "antd";
import Search from "antd/lib/input/Search";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../Services/axios";

export default function DosenPage() {
  const navigate = useNavigate();
  const initialParams = {
    size: 20,
    page: 0,
    sort: "",
    search: "",
    id: "",
    fakultas: "",
  };
  const [dataLectures, setDataLectures] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [params, setParams] = useState(initialParams);
  const [meta, setMeta] = useState({ size: 20, page: 1, total: 0 });

  const getLecture = useCallback(async () => {
    setLoadingTable(true);
    await API(`lecture.getLecture`, {
      params,
    })
      .then((res) => {
        setLoadingTable(false);
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          const newData = data?.content.map((item, index) => {
            return { key: index, ...item };
          });
          setDataLectures(newData);
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
          description: "Data dosen gagal didapatkan!",
        });
      });
  }, [params]);

  const deleteLecture = async (id) => {
    await API(`lecture.deleteLecture`, { query: { id } })
      .then((res) => {
        setParams(initialParams);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil menghapus data",
            description: "Data dosen berhasil dihapus!",
          });
        } else {
          notification.info({
            message: "Gagal menghapus data",
            description: "Pastikan data tidak terhubung ke data lainnya!",
          });
        }
      })
      .catch((res) => {
        notification.error({
          message: "Gagal menghapus data",
          description: "Data dosen gagal dihapus!",
        });
      });
  };

  useEffect(() => {
    getLecture();
  }, [getLecture]);

  const columns = [
    {
      title: "NIDN",
      dataIndex: "nidn",
      key: "nidn",
    },
    {
      title: "Nama Dosen",
      dataIndex: "lectureName",
      key: "lectureName",
    },
    {
      title: "Status",
      dataIndex: "users",
      key: "users.status",
      render: (text) => (text.status ? "Aktif" : "Tidak Aktif"),
    },
    {
      title: "Aksi",
      dataIndex: "",
      render: (record) => (
        <div className="text-primary1 md:flex-row flex-col flex gap-4 text-sm font-semibold">
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleRow("Detail", record.lectureId)}
          >
            Detail
          </div>
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleRow("Update", record.lectureId)}
          >
            Edit
          </div>
          <Popconfirm
            title="Hapus data ini?"
            placement="left"
            onConfirm={() => deleteLecture(record.lectureId)}
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
    navigate(`/dosen-form/${id}`, {
      state: { type: type },
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col md:flex-row w-full md:justify-between justify-center gap-5">
        <div className="md:w-10/12">
          <Search
            placeholder="Cari Nama Dosen atau NIDN"
            allowClear
            enterButton
            onSearch={onSearch}
          />
        </div>
        <div>
          <div
            className="w-full md:w-32 text-white bg-primary2 h-8 items-center justify-center flex cursor-pointer hover:opacity-90 px-4 rounded-sm"
            onClick={() =>
              navigate(`/dosen-form`, {
                state: { type: "Create" },
              })
            }
          >
            + Buat Dosen
          </div>
        </div>
      </div>
      <div className="md:mt-30 mt-5 w-full">
        <Table
          loading={loadingTable}
          scroll={{ x: 724 }}
          dataSource={dataLectures}
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

import { notification, Popconfirm, Table } from "antd";
import Search from "antd/lib/input/Search";
import React, { useCallback, useEffect, useState } from "react";
import { API } from "../../../Services/axios";
import FakultasForm from "./form";

export default function FakultasPage() {
  const initialParams = {
    size: 20,
    page: 0,
    sort: "",
    search: "",
    id: "",
  };
  const [modalForm, setModalForm] = useState(false);
  const [formType, setFormType] = useState("Create");
  const [selectedItem, setSelectedItem] = useState({});
  const [loadingTable, setLoadingTable] = useState(false);
  const [params, setParams] = useState(initialParams);
  const [meta, setMeta] = useState({ size: 20, page: 1, total: 0 });
  const [dataFaculties, setDataFaculties] = useState([]);

  const getFaculty = useCallback(async () => {
    setLoadingTable(true);
    await API(`faculty.getFaculty`, {
      params,
    })
      .then((res) => {
        setLoadingTable(false);
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          const newData = data?.content.map((item, index) => {
            return { key: index, ...item };
          });
          setDataFaculties(newData);
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
          description: "Data fakultas gagal didapatkan!",
        });
      });
  }, [params]);

  const deleteFaculty = async (id) => {
    await API(`faculty.deleteFaculty`, { query: { id } })
      .then((res) => {
        setParams(initialParams);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil menghapus data",
            description: "Data fakultas berhasil dihapus!",
          });
        } else {
          notification.info({
            message: "Gagal menghapus data",
            description: "Data fakultas gagal dihapus!",
          });
        }
      })
      .catch((res) => {
        notification.error({
          message: "Gagal menghapus data",
          description: "Data fakultas gagal dihapus!",
        });
      });
  };

  useEffect(() => {
    getFaculty();
  }, [getFaculty]);

  const toogleModalForm = (type) => {
    setModalForm(!modalForm);
    setFormType(type);
  };

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

  const columns = [
    {
      title: "Nama Fakultas",
      dataIndex: "facultyName",
      key: "facultyName",
      width: 1200,
    },
    {
      title: "Aksi",
      dataIndex: "",
      render: (record) => (
        <div className="text-primary1 md:flex-row flex-col flex gap-4 text-sm font-semibold">
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => {
              toogleModalForm("Update");
              setSelectedItem(record);
            }}
          >
            Edit
          </div>
          <Popconfirm
            title="Hapus data ini?"
            placement="left"
            onConfirm={() => deleteFaculty(record.facultyId)}
          >
            <div className="cursor-pointer hover:opacity-80">Hapus</div>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col md:flex-row w-full md:justify-between justify-center gap-5">
        <div className="md:w-10/12">
          <Search
            placeholder="Cari Nama Fakultas"
            allowClear
            enterButton
            onSearch={onSearch}
          />
        </div>
        <div>
          <div
            className="w-full md:w-32 text-white bg-primary2 h-8 items-center justify-center flex cursor-pointer hover:opacity-90 px-4 rounded-sm"
            onClick={() => toogleModalForm("Create")}
          >
            + Buat Fakultas
          </div>
        </div>
      </div>
      <div className="md:mt-30 mt-5 w-full">
        <Table
          loading={loadingTable}
          dataSource={dataFaculties}
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
      <FakultasForm
        data={selectedItem}
        type={formType}
        visible={modalForm}
        onOk={() => {
          toogleModalForm();
          setParams(initialParams);
        }}
        onCancel={() => {
          toogleModalForm();
          setSelectedItem({});
        }}
      />
    </div>
  );
}

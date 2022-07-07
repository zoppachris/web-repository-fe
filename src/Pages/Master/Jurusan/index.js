import { notification, Popconfirm, Select, Table } from "antd";
import Search from "antd/lib/input/Search";
import React, { useEffect, useState, useCallback } from "react";
import { API } from "../../../Services/axios";
import JurusanForm from "./form";

export default function JurusanPage() {
  const { Option } = Select;
  const initialParams = {
    size: 20,
    page: 0,
    sort: "",
    search: "",
    id: "",
    fakultas: "",
  };
  const [modalForm, setModalForm] = useState(false);
  const [formType, setFormType] = useState("Create");
  const [selectedItem, setSelectedItem] = useState({});
  const [dataFaculties, setDataFaculties] = useState([]);
  const [dataMajors, setDataMajors] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [params, setParams] = useState(initialParams);
  const [meta, setMeta] = useState({ size: 20, page: 1, total: 0 });

  const getFaculty = async () => {
    await API(`faculty.getFaculty`, {
      params: {
        size: 999999,
        page: 0,
        sort: "",
        search: "",
        id: "",
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          setDataFaculties(data?.content);
        }
      })
      .catch((res) => {
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data fakultas gagal didapatkan!",
        });
      });
  };

  const getMajor = useCallback(async () => {
    setLoadingTable(true);
    await API(`major.getMajor`, {
      params,
    })
      .then((res) => {
        setLoadingTable(false);
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          const newData = data?.content.map((item, index) => {
            return { key: index, ...item };
          });
          setDataMajors(newData);
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
          description: "Data jurusan gagal didapatkan!",
        });
      });
  }, [params]);

  const deleteMajor = async (id) => {
    await API(`major.deleteMajor`, { query: { id } })
      .then((res) => {
        setParams(initialParams);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil menghapus data",
            description: "Data jurusan berhasil dihapus!",
          });
        } else {
          notification.info({
            message: "Gagal menghapus data",
            description: "Data jurusan gagal dihapus!",
          });
        }
      })
      .catch((res) => {
        notification.error({
          message: "Gagal menghapus data",
          description: "Data jurusan gagal dihapus!",
        });
      });
  };

  useEffect(() => {
    getFaculty();
  }, []);

  useEffect(() => {
    getMajor();
  }, [getMajor]);

  const toogleModalForm = (type) => {
    setModalForm(!modalForm);
    setFormType(type);
  };

  const columns = [
    {
      title: "Nama Jurusan",
      dataIndex: "majorName",
      key: "majorName",
      width: 600,
    },
    {
      title: "Nama Fakultas",
      dataIndex: "faculties",
      key: "faculties.facultyName",
      width: 600,
      render: (text) => text.facultyName,
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
            onConfirm={() => deleteMajor(record.majorId)}
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

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col md:flex-row w-full md:justify-between justify-center gap-5">
        <div className="md:w-8/12">
          <Search
            placeholder="Cari Nama Jurusan"
            allowClear
            enterButton
            onSearch={onSearch}
          />
        </div>
        <div className="md:w-2/12">
          <Select
            placeholder="Pilih Fakultas"
            className="w-full"
            allowClear
            style={{ alignItems: "center" }}
            onChange={(value) =>
              setParams({ ...params, page: 0, fakultas: value || "" })
            }
          >
            {dataFaculties?.map((item) => (
              <Option key={item.facultyName}>{item.facultyName}</Option>
            ))}
          </Select>
        </div>
        <div>
          <div
            className="w-full md:w-32 text-white bg-primary2 h-8 items-center justify-center flex cursor-pointer hover:opacity-90 px-4 rounded-sm"
            onClick={() => toogleModalForm("Create")}
          >
            + Buat Jurusan
          </div>
        </div>
      </div>
      <div className="md:mt-30 mt-5 w-full">
        <Table
          loading={loadingTable}
          dataSource={dataMajors}
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
      <JurusanForm
        data={selectedItem}
        dataFaculties={dataFaculties}
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

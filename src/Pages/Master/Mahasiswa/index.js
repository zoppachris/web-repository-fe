import { notification, Popconfirm, Select, Table } from "antd";
import Search from "antd/lib/input/Search";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../Services/axios";

export default function MahasiswaPage() {
  const { Option } = Select;
  const navigate = useNavigate();
  const initialParams = {
    size: 20,
    page: 0,
    sort: "",
    search: "",
    id: "",
    jurusan: "",
  };
  const [dataStudents, setDataStudents] = useState([]);
  const [dataMajors, setDataMajors] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [params, setParams] = useState(initialParams);
  const [meta, setMeta] = useState({ size: 20, page: 1, total: 0 });

  const getMajor = async () => {
    await API(`major.getMajor`, {
      params: {
        size: 999999,
        page: 0,
        sort: "",
        search: "",
        id: "",
        fakultas: "",
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          setDataMajors(data?.content);
        }
      })
      .catch((res) => {
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data jurusan gagal didapatkan!",
        });
      });
  };

  const getStudent = useCallback(async () => {
    setLoadingTable(true);
    await API(`student.getStudent`, {
      params,
    })
      .then((res) => {
        setLoadingTable(false);
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          const newData = data?.content.map((item, index) => {
            return { key: index, ...item };
          });
          setDataStudents(newData);
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
          description: "Data mahasiswa gagal didapatkan!",
        });
      });
  }, [params]);

  const deleteStudent = async (id) => {
    await API(`student.deleteStudent`, { query: { id } })
      .then((res) => {
        setParams(initialParams);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil menghapus data",
            description: "Data mahasiswa berhasil dihapus!",
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
          description: "Data mahasiswa gagal dihapus!",
        });
      });
  };

  useEffect(() => {
    getMajor();
  }, []);

  useEffect(() => {
    getStudent();
  }, [getStudent]);

  const columns = [
    {
      title: "NIM",
      dataIndex: "nim",
      key: "nim",
    },
    {
      title: "Nama Mahasiswa",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Nama Jurusan",
      dataIndex: "majors",
      key: "majors.majorName",
      render: (text) => text.majorName,
    },
    {
      title: "Angkatan",
      dataIndex: "year",
      key: "year",
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
            onClick={() => handleRow("Detail", record.studentId)}
          >
            Detail
          </div>
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleRow("Update", record.studentId)}
          >
            Edit
          </div>
          <Popconfirm
            title="Hapus data ini?"
            placement="left"
            onConfirm={() => deleteStudent(record.studentId)}
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
    navigate(`/mahasiswa-form/${id}`, {
      state: { type: type },
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col md:flex-row w-full md:justify-between justify-center gap-5">
        <div className="md:w-1/2">
          <Search
            placeholder="Cari Nama Mahasiswa, NIM atau Angkatan"
            allowClear
            enterButton
            onSearch={onSearch}
          />
        </div>
        <div className="md:w-2/12">
          <Select
            placeholder="Pilih Jurusan"
            className="w-full"
            allowClear
            style={{ alignItems: "center" }}
            onChange={(value) =>
              setParams({ ...params, page: 0, jurusan: value || "" })
            }
          >
            {dataMajors?.map((item) => (
              <Option key={item.majorName}>{item.majorName}</Option>
            ))}
          </Select>
        </div>
        <div>
          <div
            className="w-full text-white bg-primary2 h-8 items-center justify-center flex cursor-pointer hover:opacity-90 px-4 rounded-sm"
            onClick={() =>
              navigate(`/mahasiswa-form`, {
                state: { type: "Create" },
              })
            }
          >
            + Buat Mahasiswa
          </div>
        </div>
      </div>
      <div className="md:mt-30 mt-5 w-full">
        <Table
          loading={loadingTable}
          scroll={{ x: 724 }}
          dataSource={dataStudents}
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

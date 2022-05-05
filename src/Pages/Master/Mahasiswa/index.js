import { Popconfirm, Select, Table } from "antd";
import Search from "antd/lib/input/Search";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function MahasiswaPage() {
  const { Option } = Select;
  const navigate = useNavigate();

  const dataSource = [
    {
      key: "1",
      mahasiswaId: "1",
      nim: "55201118021",
      namaMahasiswa: "Bagas Hermawan",
      namaJurusan: "Teknik Informatika",
      angkatan: "2017",
    },
    {
      key: "2",
      mahasiswaId: "2",
      nim: "55201118022",
      namaMahasiswa: "Muhammad Aldi",
      namaJurusan: "Manajemen Bisnis",
      angkatan: "2017",
    },
  ];

  const dataJurusan = [
    {
      jurusanId: "1",
      namaJurusan: "Teknik Informatika",
    },
    {
      jurusanId: "2",
      namaJurusan: "Teknik Penerbangan",
    },
  ];

  const columns = [
    {
      title: "NIM",
      dataIndex: "nim",
      key: "nim",
    },
    {
      title: "Nama Mahasiswa",
      dataIndex: "namaMahasiswa",
      key: "namaMahasiswa",
    },
    {
      title: "Nama Jurusan",
      dataIndex: "namaJurusan",
      key: "namaJurusan",
    },
    {
      title: "Angkatan",
      dataIndex: "angkatan",
      key: "angkatan",
    },
    {
      title: "Action",
      dataIndex: "",
      render: (record) => (
        <div className="text-primary1 md:flex-row flex-col flex gap-4 text-sm font-semibold">
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleRow("Detail", record.mahasiswaId)}
          >
            Detail
          </div>
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleRow("Update", record.mahasiswaId)}
          >
            Update
          </div>
          <Popconfirm
            title="Hapus data ini?"
            placement="left"
            onConfirm={() => console.log(record.key)}
          >
            <div className="cursor-pointer hover:opacity-80">Delete</div>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleTable = (pagination, filter, sorter) => {
    console.log("pagination: ", pagination);
  };

  const handleRow = (type, id) => {
    navigate(`/mahasiswa-form/${id}`, {
      state: { type: type },
    });
  };

  const onSearch = (value) => {
    console.log("search", value);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col md:flex-row w-full md:justify-between justify-center gap-5">
        <div className="md:w-8/12">
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
          >
            {dataJurusan?.map((item) => (
              <Option key={item.jurusanId}>{item.namaJurusan}</Option>
            ))}
          </Select>
        </div>
        <div>
          <div
            className="w-full md:w-36 text-white bg-primary2 h-8 items-center justify-center flex cursor-pointer hover:opacity-90 px-4 rounded-sm"
            onClick={() =>
              navigate(`/mahasiswa-form`, {
                state: { type: "Create" },
              })
            }
          >
            New Mahasiswa
          </div>
        </div>
      </div>
      <div className="md:mt-30 mt-5 w-full">
        <Table
          scroll={{ x: 724 }}
          dataSource={dataSource}
          columns={columns}
          onChange={handleTable}
          pagination={{
            current: 1,
            pageSize: 20,
            total: 85,
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

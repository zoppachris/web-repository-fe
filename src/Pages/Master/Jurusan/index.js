import { Popconfirm, Select, Table } from "antd";
import Search from "antd/lib/input/Search";
import React, { useState } from "react";
import JurusanForm from "./form";

export default function JurusanPage() {
  const { Option } = Select;
  const [modalForm, setModalForm] = useState(false);
  const [formType, setFormType] = useState("Create");
  const [selectedItem, setSelectedItem] = useState({});

  const toogleModalForm = (type) => {
    setModalForm(!modalForm);
    setFormType(type);
  };

  const dataSource = [
    {
      key: "1",
      namaJurusan: "Teknik Informatika",
      fakultasId: "1",
      namaFakultas: "Fakultas Ilmu Komputer",
    },
    {
      key: "2",
      namaJurusan: "Manajemen Bisnis",
      fakultasId: "2",
      namaFakultas: "Fakultas Ekonomi",
    },
  ];

  const dataFakultas = [
    {
      fakultasId: "1",
      namaFakultas: "Fakultas Ilmu Komputer",
    },
    {
      fakultasId: "2",
      namaFakultas: "Fakultas Ekonomi",
    },
  ];

  const columns = [
    {
      title: "Nama Jurusan",
      dataIndex: "namaJurusan",
      key: "namaJurusan",
      width: 600,
    },
    {
      title: "Nama Fakultas",
      dataIndex: "namaFakultas",
      key: "namaFakultas",
      width: 600,
    },
    {
      title: "Action",
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

  const onSearch = (value) => {
    console.log("search", value);
  };

  //   const handleFakultas = (value) => {
  //     setMajor(value);
  //   };

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
          >
            {dataFakultas?.map((item) => (
              <Option key={item.fakultasId}>{item.namaFakultas}</Option>
            ))}
          </Select>
        </div>
        <div>
          <div
            className="w-full md:w-32 text-white bg-primary2 h-8 items-center justify-center flex cursor-pointer hover:opacity-90 px-4 rounded-sm"
            onClick={() => toogleModalForm("Create")}
          >
            New Jurusan
          </div>
        </div>
      </div>
      <div className="md:mt-30 mt-5 w-full">
        <Table
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
      <JurusanForm
        data={selectedItem}
        dataFakultas={dataFakultas}
        type={formType}
        visible={modalForm}
        onOk={toogleModalForm}
        onCancel={() => {
          toogleModalForm();
          setSelectedItem({});
        }}
      />
    </div>
  );
}

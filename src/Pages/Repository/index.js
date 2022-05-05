import { Button, DatePicker, Input, Popconfirm, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

export default function RepositoryPage() {
  const navigate = useNavigate();
  const { Option } = Select;
  const { state } = useLocation();
  const [title, setTitle] = useState("");
  const [major, setMajor] = useState(null);
  const [year, setYear] = useState("");

  useEffect(() => {
    if (state !== null) {
      setTitle(state);
    }
  }, [state]);

  console.log("filter: ", title, major, year);

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

  const dataSource = [
    {
      key: "1",
      title:
        "Analisis Dan Perbaikan Antarmuka Pada Situs Web Brawijaya Information Technology Services (Bits) Menggunakan Metode Evaluasi Heuristik",
      jurusan: "Teknik Informatika",
      tahun: 2018,
    },
    {
      key: "2",
      title:
        "Pengembangan Perangkat Lunak Aplikasi Monitoring Klimatologi Menggunakan Metode Restful Web Service Berbasis Android (Studi Kasus : Stasiun Klimatologi Karangploso Malang)",
      jurusan: "Teknik Informatika",
      tahun: 2018,
    },
  ];

  const columns = [
    {
      title: "Judul",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Jurusan",
      dataIndex: "jurusan",
      key: "jurusan",
    },
    {
      title: "Tahun",
      dataIndex: "tahun",
      key: "tahun",
    },
  ];

  const columnsAdmin = [
    ...columns,
    {
      title: "Action",
      dataIndex: "",
      render: (record) => (
        <div className="text-primary1 md:flex-row flex-col flex gap-4 text-sm font-semibold">
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleDetail(record)}
          >
            Detail
          </div>
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => console.log(record.key)}
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

  const handleDetail = (value) => {
    navigate(`/detail-repository/${value.key}`);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleMajor = (value) => {
    setMajor(value);
  };

  const handleYear = (date, dateString) => {
    setYear(dateString);
  };

  const handleReset = () => {
    setTitle("");
    setMajor(null);
    setYear("");
  };

  function disabledDate(current) {
    return current && current > moment().endOf("year");
  }

  return (
    <div className="flex flex-col items-center">
      <div className="md:mt-14 bg-primary1 rounded-xl w-full px-14 py-9 flex md:flex-row flex-col justify-center items-start gap-5">
        <div className="w-full">
          <Input
            placeholder="Cari Judul"
            allowClear
            value={title}
            onChange={handleTitle}
          />
          <div
            className="absolute cursor-pointer font-semibold text-xs text-white pt-1 md:block hidden hover:opacity-90"
            onClick={handleReset}
          >
            Reset Filter
          </div>
        </div>
        <Select
          placeholder="Pilih Jurusan"
          className="w-full md:w-80"
          allowClear
          onChange={handleMajor}
          value={major}
        >
          {dataJurusan?.map((item) => (
            <Option key={item.jurusanId}>{item.namaJurusan}</Option>
          ))}
        </Select>
        <DatePicker
          placeholder="Pilih Tahun"
          picker="year"
          className="w-full md:w-80"
          onChange={handleYear}
          disabledDate={disabledDate}
          value={year !== "" && moment(year)}
        />
        <div className="w-full md:w-20 text-white bg-primaryVariant h-8 items-center justify-center flex cursor-pointer hover:opacity-90 px-4">
          Search
        </div>
        <div
          className="flex items-center justify-center w-full text-white font-semibold cursor-pointer md:hidden hover:opacity-90"
          onClick={handleReset}
        >
          Reset Filter
        </div>
      </div>
      {localStorage.getItem("userScope") === "admin" && (
        <div className="flex flex-row justify-end items-center w-full mt-6">
          <Button
            type="primary"
            onClick={() =>
              navigate(`/repository-form`, {
                state: { type: "Create" },
              })
            }
          >
            New Repository
          </Button>
        </div>
      )}
      <div
        className={
          localStorage.getItem("userScope") === "admin"
            ? "mt-6 w-full"
            : "md:mt-20 mt-10 w-full"
        }
      >
        <Table
          dataSource={dataSource}
          columns={
            localStorage.getItem("userScope") === "admin"
              ? columnsAdmin
              : columns
          }
          onChange={handleTable}
          onRow={(record) => {
            return {
              onClick: (event) => {
                if (localStorage.getItem("userScope") !== "admin") {
                  handleDetail(record);
                }
              },
            };
          }}
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

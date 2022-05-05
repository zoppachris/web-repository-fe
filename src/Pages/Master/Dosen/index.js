import { Popconfirm, Table } from "antd";
import Search from "antd/lib/input/Search";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function DosenPage() {
  const navigate = useNavigate();

  const dataSource = [
    {
      key: "1",
      dosenId: "1",
      nidn: "8809840017",
      namaDosen: "Dr. Drs. H. Aji Komarudin, M.Si.",
    },
    {
      key: "2",
      dosenId: "2",
      nidn: "0405078004",
      namaDosen: "Yuniati Fransisca, S.E., M.M.",
    },
  ];

  const columns = [
    {
      title: "NIDN",
      dataIndex: "nidn",
      key: "nidn",
      width: 600,
    },
    {
      title: "Nama Dosen",
      dataIndex: "namaDosen",
      key: "namaDosen",
      width: 600,
    },
    {
      title: "Action",
      dataIndex: "",
      render: (record) => (
        <div className="text-primary1 md:flex-row flex-col flex gap-4 text-sm font-semibold">
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleRow("Detail", record.dosenId)}
          >
            Detail
          </div>
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleRow("Update", record.dosenId)}
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
    navigate(`/dosen-form/${id}`, {
      state: { type: type },
    });
  };

  const onSearch = (value) => {
    console.log("search", value);
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
            New Dosen
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
    </div>
  );
}

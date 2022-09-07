import { Button, notification, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalFunctions } from "../../../GlobalFunctions";
import { API } from "../../../Services/axios";

export default function RepositoryUserPage() {
  const navigate = useNavigate();
  const thesesId = GlobalFunctions.decrypt("thesesId");
  const { state } = useLocation();
  const [loadingTable, setLoadingTable] = useState(false);
  const [dataTheses, setDataTheses] = useState([]);
  const params = {
    size: 20,
    page: 0,
    sort: "",
    search: state || "",
    id: thesesId || "",
    jurusan: "",
    year: "",
  };

  const getTheses = async () => {
    setLoadingTable(true);
    await API(`theses.getTheses`, {
      params,
    })
      .then((res) => {
        setLoadingTable(false);
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          const newData = { key: 0, ...data };
          setDataTheses([newData]);
        }
      })
      .catch((res) => {
        setLoadingTable(false);
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data tugas akhir gagal didapatkan!",
        });
      });
  };

  useEffect(() => {
    if (thesesId) {
      getTheses();
    }
  }, []);

  const handleDetail = (value) => {
    navigate(`/detail-theses/${value.thesesId}`);
  };

  const columns = [
    {
      title: "Judul",
      dataIndex: "thesesTitle",
      key: "thesesTitle",
    },
    {
      title: "Tahun",
      dataIndex: "year",
      key: "year",
      width: 100,
    },
    {
      title: "Jurusan",
      dataIndex: "students",
      key: "students.majors.majorName",
      width: 150,
      ellipsis: true,
      render: (text) => text?.majors?.majorName,
    },
    {
      title: "Kata Kunci",
      dataIndex: "keywords",
      key: "keywords",
      ellipsis: true,
    },
    {
      title: "Aksi",
      dataIndex: "",
      width: 200,
      render: (record) => (
        <div className="text-primary1 flex gap-4 text-sm font-semibold">
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleDetail(record)}
          >
            Detail
          </div>
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() =>
              navigate(`/theses-form/${record.thesesId}`, {
                state: { type: "Update" },
              })
            }
          >
            Edit
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {GlobalFunctions.decrypt("thesesId") === "" && (
        <div className="flex flex-row justify-end items-center w-full mt-6">
          <Button
            type="primary"
            onClick={() =>
              navigate(`/theses-form`, {
                state: { type: "Create" },
              })
            }
          >
            + Buat Tugas Akhir
          </Button>
        </div>
      )}
      <div className="mt-6 w-full">
        <Table
          scroll={{ x: 1200 }}
          loading={loadingTable}
          dataSource={dataTheses}
          columns={columns}
        />
      </div>
    </div>
  );
}

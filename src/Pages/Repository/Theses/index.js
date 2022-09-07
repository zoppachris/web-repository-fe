import {
  Button,
  DatePicker,
  Input,
  notification,
  Popconfirm,
  Select,
  Table,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { API } from "../../../Services/axios";
import { GlobalFunctions } from "../../../GlobalFunctions";

export default function ThesesPage() {
  const navigate = useNavigate();

  const { Option } = Select;
  const { state } = useLocation();
  const [title, setTitle] = useState(state || "");
  const [major, setMajor] = useState(null);
  const [dataMajors, setDataMajors] = useState([]);
  const [dataTheses, setDataTheses] = useState([]);
  const [year, setYear] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const initialParams = {
    size: 20,
    page: 0,
    sort: "",
    search: state || "",
    id: "",
    jurusan: "",
    year: "",
  };
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

  const getTheses = useCallback(async () => {
    setLoadingTable(true);
    await API(`theses.getTheses`, {
      params,
    })
      .then((res) => {
        setLoadingTable(false);
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          const newData = data?.content.map((item, index) => {
            return { key: index, ...item };
          });
          setDataTheses(newData);
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
          description: "Data tugas akhir gagal didapatkan!",
        });
      });
  }, [params]);

  const deleteTheses = async (id) => {
    await API(`theses.deleteTheses`, { query: { id } })
      .then((res) => {
        setParams(initialParams);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil menghapus data",
            description: "Data tugas akhir berhasil dihapus!",
          });
        } else {
          notification.info({
            message: "Gagal menghapus data",
            description: "Data tugas akhir gagal dihapus!",
          });
        }
      })
      .catch((res) => {
        notification.error({
          message: "Gagal menghapus data",
          description: "Data tugas akhir gagal dihapus!",
        });
      });
  };

  useEffect(() => {
    getMajor();
  }, []);

  useEffect(() => {
    getTheses();
  }, [getTheses]);

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
      render: (text) => text.majors?.majorName,
    },
    {
      title: "Kata Kunci",
      dataIndex: "keywords",
      key: "keywords",
      ellipsis: true,
    },
  ];

  const columnsAdmin = [
    ...columns,
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
          <Popconfirm
            title="Hapus data ini?"
            placement="left"
            onConfirm={() => deleteTheses(record.thesesId)}
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

  const onSearch = () => {
    setParams({
      ...params,
      page: 0,
      search: title,
      jurusan: major ? major : "",
      year: year,
    });
  };

  const handleDetail = (value) => {
    navigate(`/detail-theses/${value.thesesId}`);
  };

  const handleYear = (date, dateString) => {
    setYear(dateString);
  };

  const handleReset = () => {
    setYear("");
    setTitle("");
    setMajor(null);
    setParams({ ...params, search: "", jurusan: "", year: "" });
  };

  function disabledDate(current) {
    return current && current > moment().endOf("year");
  }

  return (
    <div className="flex flex-col items-center">
      <div className="md:mt-14 bg-primary1 rounded-xl w-full px-14 py-9 flex md:flex-row flex-col justify-center items-start gap-5">
        <div className="w-full">
          <Input
            placeholder="Cari Judul, Abstrak atau Kata Kunci"
            allowClear
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          onChange={(value) => setMajor(value)}
          value={major}
        >
          {dataMajors?.map((item) => (
            <Option key={item.majorName}>{item.majorName}</Option>
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
        <div
          className="w-full md:w-20 text-white bg-primaryVariant h-8 items-center justify-center flex cursor-pointer hover:opacity-90 px-4"
          onClick={onSearch}
        >
          Cari
        </div>
        <div
          className="flex items-center justify-center w-full text-white font-semibold cursor-pointer md:hidden hover:opacity-90"
          onClick={handleReset}
        >
          Reset Filter
        </div>
      </div>
      {GlobalFunctions.decrypt("roleName")?.toLowerCase().includes("admin") && (
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
      <div
        className={
          GlobalFunctions.decrypt("roleName")?.toLowerCase().includes("admin")
            ? "mt-6 w-full"
            : "md:mt-20 mt-10 w-full"
        }
      >
        <Table
          scroll={{ x: 1200 }}
          loading={loadingTable}
          dataSource={dataTheses}
          columns={
            GlobalFunctions.decrypt("roleName")?.toLowerCase().includes("admin")
              ? columnsAdmin
              : columns
          }
          onChange={handleTable}
          onRow={(record) => {
            return {
              onClick: (event) => {
                if (
                  !GlobalFunctions.decrypt("roleName")
                    ?.toLowerCase()
                    .includes("admin")
                ) {
                  handleDetail(record);
                }
              },
            };
          }}
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

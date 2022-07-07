import { notification } from "antd";
import Search from "antd/lib/input/Search";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardHome from "../../Components/CardHome";
import { API } from "../../Services/axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [dataHome, setDataHome] = useState({});

  const getHome = async () => {
    await API(`home.getHomeData`)
      .then((res) => {
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          setDataHome(data);
        }
      })
      .catch((res) => {
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data beranda gagal didapatkan!",
        });
      });
  };

  useEffect(() => {
    getHome();
  }, []);

  const onSearch = (value) => {
    if (value !== "") {
      navigate("/repository", { state: value });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="lg:text-4xl text-2xl text-primary1 font-bold text-center mb-8">
        Selamat Datang di Repository <br /> Universitas Nurtanio
      </h1>
      <Search
        placeholder="cari tugas akhir"
        allowClear
        enterButton="Cari"
        className="mb-16"
        onSearch={onSearch}
      />
      <div className="grid lg:grid-cols-3 w-full gap-5">
        <CardHome title="Repository" value={dataHome?.totalRepository} />
        <CardHome title="Dosen Aktif" value={dataHome?.totalDosen} />
        <CardHome title="Mahasiswa Aktif" value={dataHome?.totalMahasiswa} />
      </div>
    </div>
  );
}

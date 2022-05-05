import Search from "antd/lib/input/Search";
import React from "react";
import { useNavigate } from "react-router-dom";
import CardHome from "../../Components/CardHome";

export default function HomePage() {
  const navigate = useNavigate();

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
        placeholder="search repository"
        allowClear
        enterButton="Search"
        className="mb-16"
        onSearch={onSearch}
      />
      <div className="grid lg:grid-cols-3 w-full gap-5">
        <CardHome title="Repository" value={1200} />
        <CardHome title="Dosen Aktif" value={50} />
        <CardHome title="Mahasiswa Aktif" value={800} />
      </div>
    </div>
  );
}

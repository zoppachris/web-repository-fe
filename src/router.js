import React from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import Nav from "./Components/Nav";
import HomePage from "./Pages/Home";
import ThesesPage from "./Pages/Repository/Theses";
import ThesesFormPage from "./Pages/Repository/Theses/form";
import ThesesDetailPage from "./Pages/Repository/Theses/detail";
import FakultasPage from "./Pages/Master/Fakultas";
import JurusanPage from "./Pages/Master/Jurusan";
import DosenPage from "./Pages/Master/Dosen";
import DosenFormPage from "./Pages/Master/Dosen/form";
import MahasiswaPage from "./Pages/Master/Mahasiswa";
import MahasiswaFormPage from "./Pages/Master/Mahasiswa/form";
import ProfilePage from "./Pages/Profile";
import AdminPage from "./Pages/Master/Admin";
import AdminFormPage from "./Pages/Master/Admin/form";
import RepositoryUserPage from "./Pages/Repository/RepositoryUser";

const { Content } = Layout;

export default function Router() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Nav />
      <Layout>
        <Content className="bg-white h-full xl:px-60 lg:px-32 md:px-10 px-5 py-14">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/repository" element={<ThesesPage />} />
            <Route
              path="/detail-theses/:thesesId"
              element={<ThesesDetailPage />}
            />
            {localStorage.getItem("roleName")?.toLowerCase() === "student" && (
              <>
                <Route
                  path="/repository-user"
                  element={<RepositoryUserPage />}
                />
                <Route path="/theses-form" element={<ThesesFormPage />} />
                <Route
                  path="/theses-form/:thesesId"
                  element={<ThesesFormPage />}
                />
              </>
            )}
            {localStorage
              .getItem("roleName")
              ?.toLowerCase()
              .includes("admin") && (
              <>
                <Route path="/theses-form" element={<ThesesFormPage />} />
                <Route
                  path="/theses-form/:thesesId"
                  element={<ThesesFormPage />}
                />
                <Route path="/fakultas" element={<FakultasPage />} />
                <Route path="/jurusan" element={<JurusanPage />} />
                <Route path="/dosen" element={<DosenPage />} />
                <Route path="/dosen-form" element={<DosenFormPage />} />
                <Route
                  path="/dosen-form/:dosenId"
                  element={<DosenFormPage />}
                />
                {localStorage.getItem("roleName")?.toLowerCase() ===
                  "super admin" && (
                  <>
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin-form" element={<AdminFormPage />} />
                    <Route
                      path="/admin-form/:adminId"
                      element={<AdminFormPage />}
                    />
                  </>
                )}
                <Route path="/mahasiswa" element={<MahasiswaPage />} />
                <Route path="/mahasiswa-form" element={<MahasiswaFormPage />} />
                <Route
                  path="/mahasiswa-form/:mahasiswaId"
                  element={<MahasiswaFormPage />}
                />
              </>
            )}
            {localStorage.getItem("roleName") && (
              <Route path="/profile" element={<ProfilePage />} />
            )}
            <Route
              path="*"
              element={
                <div className="bg-white h-full flex flex-col xl:px-60 lg:px-32 md:px-10 px-5 py-14 items-center justify-center text-primary1 text-2xl font-bold text-center">
                  Halaman Ini Belum Tersedia / Harap Login Untuk Dapat Memasuki
                  Halaman Ini
                </div>
              }
            />
          </Routes>
        </Content>
        <footer
          id="footer"
          className="text-center my-4 font-medium text-primary1"
        >
          Dibuat Oleh Zoppa Christoppa M Mahde
        </footer>
      </Layout>
    </Layout>
  );
}

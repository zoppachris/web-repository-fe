import { CloseOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Drawer, Dropdown, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalFunctions } from "../../GlobalFunctions";
import ModalChangePassword from "../ModalChangePassword";
import ModalLogin from "../ModalLogin";

export default function Nav() {
  const navigate = useNavigate();
  const [menuMobile, setMenuMobile] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);

  useEffect(() => {
    const hideMenuMobile = () => {
      if (window.innerWidth > 768) {
        setMenuMobile(false);
      }
    };

    window.addEventListener("resize", hideMenuMobile);
    return () => {
      window.removeEventListener("resize", hideMenuMobile);
    };
  });

  const toogleModalLogin = () => {
    setModalLogin(!modalLogin);
  };

  const toogleModalChangePassword = () => {
    setModalChangePassword(!modalChangePassword);
  };

  const toogleMenuMobile = () => {
    setMenuMobile(!menuMobile);
  };

  const onClickMenu = ({ key }) => {
    navigate(`${key}`);
  };

  const onClickMobile = ({ key }) => {
    setMenuMobile(false);
    if (key === "logout") {
      localStorage.clear();
      navigate("/", { replace: true });
    } else if (key === "login") {
      toogleModalLogin();
    } else if (key === "change") {
      toogleModalChangePassword();
    } else {
      navigate(`${key}`);
    }
  };

  const menuItems = [
    {
      key: "fakultas",
      label: "Fakultas",
    },
    {
      key: "jurusan",
      label: "Jurusan",
    },
    GlobalFunctions.decrypt("roleName")?.toLowerCase() === "super admin" && {
      key: "admin",
      label: "Admin",
    },
    {
      key: "dosen",
      label: "Dosen",
    },
    {
      key: "mahasiswa",
      label: "Mahasiswa",
    },
  ];

  const userItems = [
    {
      key: "name",
      label: GlobalFunctions.decrypt("name"),
      disabled: true,
    },
    {
      key: "userName",
      label: GlobalFunctions.decrypt("username"),
      disabled: true,
    },
    GlobalFunctions.decrypt("roleName")?.toLowerCase().includes("student") && {
      key: "repository-user",
      label: "Repository User",
    },
    {
      key: "profile",
      label: "Detail Profil",
    },
    {
      key: "change",
      label: "Ganti Password",
    },
    {
      key: "logout",
      label: "Logout",
    },
  ];

  const menuMobileItems = [
    {
      key: "/",
      label: "Beranda",
    },
    GlobalFunctions.decrypt("roleName")?.toLowerCase().includes("admin") && {
      key: "master",
      label: "Master",
      children: menuItems,
    },
    {
      key: "repository",
      label: "Repository",
    },
    GlobalFunctions.decrypt("roleName") && {
      key: "profile-user",
      label: "Profil",
      children: userItems.filter((item) => item.key !== "logout"),
    },
    !GlobalFunctions.decrypt("roleName")
      ? {
          key: "login",
          label: "Login",
        }
      : {
          key: "logout",
          label: "Logout",
        },
  ];

  const menu = <Menu onClick={onClickMenu} items={menuItems} />;

  const user = <Menu onClick={onClickMobile} items={userItems} />;

  return (
    <>
      <ModalLogin visible={modalLogin} onClose={toogleModalLogin} />
      <ModalChangePassword
        visible={modalChangePassword}
        onClose={toogleModalChangePassword}
      />
      <nav className="w-full z-50 flex h-20 items-center justify-between bg-primary1 shadow-sm font-bold xl:px-60 lg:px-32 md:px-10 px-5">
        <Link
          to="/"
          className="flex items-center gap-4 text-white hover:text-primaryVariant"
        >
          <img
            src={process.env.PUBLIC_URL + "/images/university-logo.png"}
            alt="university-logo"
            className="w-10 h-auto"
          />
          Universitas Nurtanio
        </Link>
        <div className="cursor-pointer md:hidden" onClick={toogleMenuMobile}>
          <MenuOutlined style={{ color: "white", fontSize: "24px" }} />
        </div>
        <div className="md:inline-flex hidden items-center gap-10">
          <Link className="text-white hover:text-primaryVariant" to="/">
            Beranda
          </Link>
          {GlobalFunctions.decrypt("roleName")
            ?.toLowerCase()
            .includes("admin") && (
            <Dropdown arrow placement="bottomLeft" overlay={menu}>
              <div
                className="text-white hover:text-primaryVariant cursor-pointer"
                onClick={(e) => e.preventDefault()}
              >
                Master
              </div>
            </Dropdown>
          )}
          <Link
            className="text-white hover:text-primaryVariant"
            to="/repository"
          >
            Repository
          </Link>
          {GlobalFunctions.decrypt("roleName") ? (
            <Dropdown
              arrow
              placement="bottomRight"
              overlay={user}
              className="cursor-pointer"
            >
              <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </Dropdown>
          ) : (
            <div
              className="text-white hover:text-primaryVariant cursor-pointer"
              onClick={toogleModalLogin}
            >
              Login
            </div>
          )}
        </div>
      </nav>
      <Drawer
        closeIcon={
          <CloseOutlined style={{ color: "black", fontSize: "24px" }} />
        }
        placement="right"
        onClose={toogleMenuMobile}
        visible={menuMobile}
      >
        <div className="grid justify-center items-start text-center gap-1">
          <div className="flex justify-center items-center">
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </div>
          <div className="text-lg font-bold text-primary1">
            {GlobalFunctions.decrypt("name")}
          </div>
          <div className="text-lg font-bold text-primary1">
            {GlobalFunctions.decrypt("username")}
          </div>
        </div>
        <Menu
          onClick={(e) => onClickMobile(e)}
          mode="inline"
          items={menuMobileItems}
          style={{ fontSize: 18, fontWeight: "bold" }}
        />
      </Drawer>
    </>
  );
}

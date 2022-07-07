import { Input, Form, Modal, Button, notification } from "antd";
import React, { useState } from "react";
import { API } from "../../Services/axios";

const ModalLogin = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 500);
  };

  const login = async (data) => {
    setLoading(true);
    await API(`auth.login`, { data })
      .then((res) => {
        setLoading(false);
        const { data } = res.data;
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Login Sukses",
            description: "Login telah berhasil!",
          });
          onClose();
          localStorage.setItem("roleName", data?.roleName);
          localStorage.setItem("userName", data?.username);
          localStorage.setItem("majorName", data?.majorName);
          localStorage.setItem("facultyName", data?.facultyName);
          localStorage.setItem("name", data?.name);
          localStorage.setItem("token", data?.token);
          localStorage.setItem("tokenType", data?.type);
          reloadPage();
        } else {
          Modal.info({
            title: "NIM/NIDN atau Password yang dimasukkan salah!",
            content: "Hubungi admin apabila lupa",
            centered: true,
            maskClosable: true,
          });
        }
      })
      .catch((res) => {
        setLoading(false);
        Modal.error({
          title: "Login Gagal!",
          content: "Hubungi admin untuk informasi lebih lanjut",
          centered: true,
          maskClosable: true,
        });
      });
  };

  return (
    <Modal
      title={<div className="text-primary1 font-semibold text-base">Login</div>}
      visible={visible}
      maskClosable={false}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      centered
      footer={[
        <Button key="back" onClick={onClose}>
          Batal
        </Button>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          loading={loading}
          form="formLogin"
        >
          Login
        </Button>,
      ]}
    >
      <Form id="formLogin" name="formLogin" onFinish={login} form={form}>
        <div className="text-primary1 font-semibold text-sm text-center flex-col gap-2 sm:px-5 md:px-10 lg:px-20 mb-8">
          <p>NIM/NIDN</p>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Harap masukkan NIM atau NIDN!" },
            ]}
          >
            <Input placeholder="Masukkan NIM atau NIDN" allowClear />
          </Form.Item>
        </div>
        <div className="text-primary1 font-semibold text-sm text-center flex-col gap-2 sm:px-5 md:px-10 lg:px-20 mb-8">
          <p>Password</p>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Harap masukkan password!" }]}
          >
            <Input.Password placeholder="Masukkan Password" allowClear />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalLogin;

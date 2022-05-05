import { Input, Form, Modal, Button, notification } from "antd";
import React from "react";

const ModalLogin = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const userMahasiswa = { username: "55201118029", password: "tes123" };
  const userDosen = { username: "8809840017", password: "tes123" };
  const admin = { username: "admin1", password: "tes123" };

  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 500);
  };

  const login = (value) => {
    if (
      value.username === userMahasiswa.username &&
      value.password === userMahasiswa.password
    ) {
      localStorage.setItem("userScope", "user");
      localStorage.setItem("roleScope", "mahasiswa");
      notification.success({
        message: "Login Sukses",
        description: "Login telah berhasil!",
      });
      onClose();
      reloadPage();
    } else if (
      value.username === userDosen.username &&
      value.password === userDosen.password
    ) {
      localStorage.setItem("userScope", "user");
      localStorage.setItem("roleScope", "dosen");
      notification.success({
        message: "Login Sukses",
        description: "Login telah berhasil!",
      });
      onClose();
      reloadPage();
    } else if (
      value.username === admin.username &&
      value.password === admin.password
    ) {
      localStorage.setItem("userScope", "admin");
      notification.success({
        message: "Login Sukses",
        description: "Login telah berhasil!",
      });
      onClose();
      reloadPage();
    } else {
      Modal.info({
        title: "NIM/NIDN atau Password yang dimasukkan salah!",
        content: "Hubungi admin apabila lupa",
        centered: true,
        maskClosable: true,
      });
    }

    form.resetFields();
  };

  return (
    <Modal
      title={<div className="text-primary1 font-semibold text-base">Login</div>}
      visible={visible}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      centered
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          //   loading={loading}
          form="formLogin"
        >
          Login
        </Button>,
      ]}
    >
      <Form
        id="formLogin"
        name="formLogin"
        onFinish={login}
        form={form}
        // onFinishFailed={onFinishFailed}
      >
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

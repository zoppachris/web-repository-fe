import { Input, Form, Modal, Button, notification } from "antd";
import React, { useState } from "react";
import { API } from "../../Services/axios";

const ModalChangePassword = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const changePassword = async (data) => {
    setLoading(true);
    await API(`auth.changePassword`, { data })
      .then((res) => {
        setLoading(false);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Ganti Password Sukses",
            description: "Mengganti Password telah berhasil!",
          });
          onClose();
          form.resetFields();
        } else {
          Modal.info({
            title: "Password lama yang dimasukkan salah!",
            content: "Hubungi admin apabila lupa",
            centered: true,
            maskClosable: true,
          });
        }
      })
      .catch((res) => {
        setLoading(false);
        Modal.error({
          title: "Ganti Password Gagal!",
          content: "Hubungi admin untuk informasi lebih lanjut",
          centered: true,
          maskClosable: true,
        });
      });
  };

  return (
    <Modal
      title={<div className="text-primary1 font-semibold text-base">Ganti Password</div>}
      visible={visible}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      maskClosable={false}
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
          form="formChangePassword"
        >
          Simpan
        </Button>,
      ]}
    >
      <Form
        id="formChangePassword"
        name="formChangePassword"
        onFinish={changePassword}
        form={form}
      >
        <div className="text-primary1 font-semibold text-sm text-center flex-col gap-2 sm:px-5 md:px-10 lg:px-20 mb-8">
          <p>Password Lama</p>
          <Form.Item
            name="oldPassword"
            rules={[
              { required: true, message: "Harap masukkan password lama!" },
            ]}
          >
            <Input.Password placeholder="Masukkan Password Lama" allowClear />
          </Form.Item>
        </div>
        <div className="text-primary1 font-semibold text-sm text-center flex-col gap-2 sm:px-5 md:px-10 lg:px-20 mb-8">
          <p>Password Baru</p>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Harap masukkan password baru!" },
            ]}
          >
            <Input.Password placeholder="Masukkan Password Baru" allowClear />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalChangePassword;

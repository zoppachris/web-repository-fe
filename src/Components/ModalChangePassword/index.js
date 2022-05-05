import { Input, Form, Modal, Button } from "antd";
import React from "react";

const ModalChangePassword = ({ visible, onClose }) => {
  const [form] = Form.useForm();

  const changePassword = (value) => {
    console.log(value);
    onClose();
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
          form="formChangePassword"
        >
          Save
        </Button>,
      ]}
    >
      <Form
        id="formChangePassword"
        name="formChangePassword"
        onFinish={changePassword}
        form={form}
        // onFinishFailed={onFinishFailed}
      >
        <div className="text-primary1 font-semibold text-sm text-center flex-col gap-2 sm:px-5 md:px-10 lg:px-20 mb-8">
          <p>Old Password</p>
          <Form.Item
            name="oldPassword"
            rules={[{ required: true, message: "Harap masukkan password!" }]}
          >
            <Input.Password placeholder="Masukkan Password" allowClear />
          </Form.Item>
        </div>
        <div className="text-primary1 font-semibold text-sm text-center flex-col gap-2 sm:px-5 md:px-10 lg:px-20 mb-8">
          <p>New Password</p>
          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: "Harap masukkan password!" }]}
          >
            <Input.Password placeholder="Masukkan Password" allowClear />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalChangePassword;

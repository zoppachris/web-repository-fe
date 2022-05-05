import { Input, Form, Modal, Button } from "antd";
import React, { useEffect } from "react";

export default function FakultasForm({ visible, onOk, onCancel, type, data }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (type === "Update") {
      const setData = () => {
        form.setFieldsValue({
          namaFakultas: data.namaFakultas,
        });
      };
      setData();
    }
  }, [data, form, type]);

  const onFinish = (value) => {
    console.log(value);
    onOk();
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div className="text-primary1 font-semibold text-base">
          {type} Fakultas
        </div>
      }
      visible={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      centered
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          //   loading={loading}
          form="formFakultas"
        >
          {type}
        </Button>,
      ]}
    >
      <Form
        id="formFakultas"
        name="formFakultas"
        onFinish={onFinish}
        form={form}
        // onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label={
            <div className="text-primary1 font-semibold text-sm">
              Nama Fakultas
            </div>
          }
          name="namaFakultas"
          rules={[{ required: true, message: "Harap masukkan nama fakultas!" }]}
        >
          <Input placeholder="Masukkan Nama Fakultas" allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
}

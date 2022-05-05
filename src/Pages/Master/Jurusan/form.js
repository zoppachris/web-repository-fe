import { Input, Form, Modal, Button, Select } from "antd";
import React, { useEffect } from "react";

export default function JurusanForm({
  visible,
  onOk,
  onCancel,
  type,
  data,
  dataFakultas,
}) {
  const { Option } = Select;
  const [form] = Form.useForm();

  useEffect(() => {
    if (type === "Update") {
      const setData = () => {
        form.setFieldsValue({
          namaJurusan: data.namaJurusan,
          fakultasId: data.fakultasId,
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
            <div className="text-primary1 font-semibold text-sm w-24">
              Nama Jurusan
            </div>
          }
          name="namaJurusan"
          rules={[{ required: true, message: "Harap masukkan password!" }]}
        >
          <Input placeholder="Masukkan Nama Jurusan" allowClear />
        </Form.Item>
        <Form.Item
          label={
            <div className="text-primary1 font-semibold text-sm w-24">
              Pilih Fakultas
            </div>
          }
          name="fakultasId"
          rules={[{ required: true, message: "Harap pilih fakultas!" }]}
        >
          <Select placeholder="Pilih Fakultas" allowClear>
            {dataFakultas?.map((item) => (
              <Option key={item.fakultasId}>{item.namaFakultas}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

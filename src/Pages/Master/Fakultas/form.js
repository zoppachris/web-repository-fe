import { Input, Form, Modal, Button, notification } from "antd";
import React, { useEffect, useState } from "react";
import { API } from "../../../Services/axios";

export default function FakultasForm({ visible, onOk, onCancel, type, data }) {
  const [form] = Form.useForm();
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    if (type === "Update") {
      const setData = () => {
        form.setFieldsValue({
          facultyName: data.facultyName,
        });
      };
      setData();
    }
  }, [data, form, type]);

  const createFaculty = async (values) => {
    setLoadingForm(true);
    await API(`faculty.createFaculty`, {
      data: values,
    })
      .then((res) => {
        setLoadingForm(false);
        onOk();
        form.resetFields();
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil membuat data",
            description: "Data fakultas berhasil dibuat!",
          });
        } else {
          notification.info({
            message: "Gagal membuat data",
            description: "Data fakultas gagal dibuat!",
          });
        }
      })
      .catch((res) => {
        setLoadingForm(false);
        notification.error({
          message: "Gagal membuat data",
          description: "Data fakultas gagal dibuat!",
        });
      });
  };

  const updateFaculty = async (values) => {
    setLoadingForm(true);
    await API(`faculty.updateFaculty`, {
      data: values,
      query: { id: data?.facultyId },
    })
      .then((res) => {
        setLoadingForm(false);
        onOk();
        form.resetFields();
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil memperbarui data",
            description: "Data fakultas berhasil diperbarui!",
          });
        } else {
          notification.info({
            message: "Gagal memperbarui data",
            description: "Data fakultas gagal diperbarui!",
          });
        }
      })
      .catch((res) => {
        setLoadingForm(false);
        notification.error({
          message: "Gagal memperbarui data",
          description: "Data fakultas gagal diperbarui!",
        });
      });
  };

  const onFinish = (values) => {
    if (type === "Create") {
      createFaculty(values);
    } else {
      updateFaculty(values);
    }
  };

  return (
    <Modal
      title={
        <div className="text-primary1 font-semibold text-base">
          {type === "Create" ? "Buat" : "Edit"} Fakultas
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
          Batal
        </Button>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          loading={loadingForm}
          form="facultyForm"
        >
          {type === "Create" ? "Buat" : "Edit"}
        </Button>,
      ]}
    >
      <Form id="facultyForm" name="facultyForm" onFinish={onFinish} form={form}>
        <Form.Item
          label={
            <div className="text-primary1 font-semibold text-sm">
              Nama Fakultas
            </div>
          }
          name="facultyName"
          rules={[{ required: true, message: "Harap masukkan nama fakultas!" }]}
        >
          <Input placeholder="Masukkan Nama Fakultas" allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
}

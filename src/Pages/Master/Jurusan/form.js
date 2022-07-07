import { Input, Form, Modal, Button, Select, notification } from "antd";
import React, { useEffect, useState } from "react";
import { API } from "../../../Services/axios";

export default function JurusanForm({
  visible,
  onOk,
  onCancel,
  type,
  data,
  dataFaculties,
}) {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    if (type === "Update") {
      const setData = () => {
        form.setFieldsValue({
          majorName: data.majorName,
          facultyId: data.faculties.facultyId.toString(),
        });
      };
      setData();
    }
  }, [data, form, type]);

  const createMajor = async (values) => {
    setLoadingForm(true);
    await API(`major.createMajor`, {
      data: values,
    })
      .then((res) => {
        setLoadingForm(false);
        onOk();
        form.resetFields();
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil membuat data",
            description: "Data jurusan berhasil dibuat!",
          });
        } else {
          notification.info({
            message: "Gagal membuat data",
            description: "Data jurusan gagal dibuat!",
          });
        }
      })
      .catch((res) => {
        setLoadingForm(false);
        notification.error({
          message: "Gagal membuat data",
          description: "Data jurusan gagal dibuat!",
        });
      });
  };

  const updateMajor = async (values) => {
    setLoadingForm(true);
    await API(`major.updateMajor`, {
      data: values,
      query: { id: data?.majorId },
    })
      .then((res) => {
        setLoadingForm(false);
        onOk();
        form.resetFields();
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil memperbarui data",
            description: "Data jurusan berhasil diperbarui!",
          });
        } else {
          notification.info({
            message: "Gagal memperbarui data",
            description: "Data jurusan gagal diperbarui!",
          });
        }
      })
      .catch((res) => {
        setLoadingForm(false);
        notification.error({
          message: "Gagal memperbarui data",
          description: "Data jurusan gagal diperbarui!",
        });
      });
  };

  const onFinish = (values) => {
    let newValues = {
      majorName: values.majorName,
      faculties: dataFaculties.find(
        (item) => item.facultyId.toString() === values.facultyId
      ),
    };
    if (type === "Create") {
      createMajor(newValues);
    } else {
      updateMajor(newValues);
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
          form="majorForm"
        >
          {type === "Create" ? "Buat" : "Edit"}
        </Button>,
      ]}
    >
      <Form id="majorForm" name="majorForm" onFinish={onFinish} form={form}>
        <Form.Item
          label={
            <div className="text-primary1 font-semibold text-sm w-24">
              Nama Jurusan
            </div>
          }
          name="majorName"
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
          name="facultyId"
          rules={[{ required: true, message: "Harap pilih fakultas!" }]}
        >
          <Select placeholder="Pilih Fakultas" allowClear>
            {dataFaculties?.map((item) => (
              <Option key={item.facultyId}>{item.facultyName}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

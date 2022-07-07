import { ArrowLeftOutlined } from "@ant-design/icons/lib/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  notification,
  PageHeader,
  Radio,
  Row,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API } from "../../../Services/axios";

export default function AdminFormPage() {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const [form] = Form.useForm();
  const { Password } = Input;
  const { state } = useLocation();
  const [loadingForm, setLoadingForm] = useState(false);

  const getAdminDetail = async () => {
    await API(`admin.getAdmin`, {
      params: {
        size: "",
        page: "",
        sort: "",
        search: "",
        id: adminId,
        roles: "admin",
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          const setData = () => {
            form.setFieldsValue({
              name: data.name,
              userName: data.userName,
              password: "",
              status: data.status,
            });
          };
          setData();
        }
      })
      .catch((res) => {
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data detail admin gagal didapatkan!",
        });
      });
  };

  const createAdmin = async (values) => {
    setLoadingForm(true);
    await API(`admin.createAdmin`, {
      data: values,
    })
      .then((res) => {
        setLoadingForm(false);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil membuat data",
            description: "Data admin berhasil dibuat!",
          });
          navigate("/admin");
        } else {
          notification.info({
            message: "Gagal membuat data",
            description: "Data admin gagal dibuat!",
          });
        }
      })
      .catch((res) => {
        setLoadingForm(false);
        notification.error({
          message: "Gagal membuat data",
          description: "Data admin gagal dibuat!",
        });
      });
  };

  const updateAdmin = async (values) => {
    setLoadingForm(true);
    await API(`admin.updateAdmin`, {
      data: values,
      query: { id: adminId },
    })
      .then((res) => {
        setLoadingForm(false);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil memperbarui data",
            description: "Data admin berhasil diperbarui!",
          });
          navigate("/admin");
        } else {
          notification.info({
            message: "Gagal memperbarui data",
            description: "Data admin gagal diperbarui!",
          });
        }
      })
      .catch((res) => {
        setLoadingForm(false);
        notification.error({
          message: "Gagal memperbarui data",
          description: "Data admin gagal diperbarui!",
        });
      });
  };

  useEffect(() => {
    if (state?.type !== "Create" && adminId) {
      getAdminDetail();
    }
  }, [state, adminId]);

  const onFinish = (values) => {
    if (state?.type === "Create") {
      createAdmin(values);
    } else {
      updateAdmin(values);
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        style={{ padding: 0, margin: 0 }}
        onBack={() => navigate("/admin")}
        backIcon={
          <div className="text-primaryVariant">
            <ArrowLeftOutlined />
          </div>
        }
        title={
          <div className="text-primary1 font-semibold text-xl">Kembali</div>
        }
      />
      <div className="font-semibold mt-7">
        <div className="text-4xl text-primary1">
          {state?.type === "Create"
            ? "Buat"
            : state?.type === "Update"
            ? "Edit"
            : "Detail"}{" "}
          Admin
        </div>
        <Form name="formAdmin" onFinish={onFinish} form={form}>
          <Divider />
          <Row
            gutter={[
              { xs: 0, md: 72 },
              { xs: 20, md: 65 },
            ]}
          >
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Nama Admin</div>
                <div>
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Harap masukkan nama admin!",
                      },
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder="Masukkan Nama Admin"
                      readOnly={state?.type === "Detail"}
                      disabled={loadingForm}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Username</div>
                <div>
                  <Form.Item
                    name="userName"
                    rules={[
                      {
                        required: true,
                        message: "Harap masukkan Username!",
                      },
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder="Masukkan Username"
                      readOnly={state?.type === "Detail"}
                      disabled={loadingForm}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            {state?.type !== "Detail" && (
              <Col xs={24} md={12}>
                <div className="flex flex-col text-primary1 gap-3">
                  <div>Password</div>
                  <div>
                    <Form.Item
                      name="password"
                      extra={
                        state?.type === "Update"
                          ? "Kosongkan formulir password untuk tidak mengubah password saat ini"
                          : ""
                      }
                      rules={[
                        {
                          required: state?.type === "Create",
                          message: "Harap masukkan password!",
                        },
                      ]}
                    >
                      <Password
                        placeholder="Masukkan Password"
                        allowClear
                        disabled={loadingForm}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Col>
            )}
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Status</div>
                <div>
                  <Form.Item
                    name="status"
                    rules={[{ required: true, message: "Harap pilih status!" }]}
                  >
                    <Radio.Group
                      className="font-medium text-primary1"
                      disabled={state?.type === "Detail" || loadingForm}
                    >
                      <Space direction="vertical">
                        <Radio value={true}>Aktif</Radio>
                        <Radio value={false}>Tidak Aktif</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
            </Col>
          </Row>
          <Divider />
          {state?.type !== "Detail" && (
            <div className="flex md:flex-row flex-col-reverse md:gap-10 gap-5 md:justify-end items-center">
              <Button
                className="md:w-auto w-full"
                onClick={() => navigate("/admin")}
                disabled={loadingForm}
              >
                Batal
              </Button>
              <Button
                className="md:w-auto w-full"
                htmlType="submit"
                type="primary"
                loading={loadingForm}
              >
                {state?.type === "Create" ? "Buat" : "Edit"}
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}

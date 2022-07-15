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
  Select,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API } from "../../../Services/axios";

export default function DosenFormPage() {
  const navigate = useNavigate();
  const { dosenId } = useParams();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { Password } = Input;
  const { state } = useLocation();
  const [dataFaculties, setDataFaculties] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);

  const getFaculty = async () => {
    await API(`faculty.getFaculty`, {
      params: {
        size: 999999,
        page: 0,
        sort: "",
        search: "",
        id: "",
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          setDataFaculties(data?.content);
        }
      })
      .catch((res) => {
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data fakultas gagal didapatkan!",
        });
      });
  };

  const getLectureDetail = async () => {
    await API(`lecture.getLecture`, {
      params: {
        size: "",
        page: "",
        sort: "",
        search: "",
        id: dosenId,
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          const setData = () => {
            form.setFieldsValue({
              lectureName: data.lectureName,
              nidn: data.nidn,
              password: "",
              status: data.users.status,
              facultyId: data.faculties.facultyId.toString(),
            });
          };
          setData();
        }
      })
      .catch((res) => {
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data detail dosen gagal didapatkan!",
        });
      });
  };

  const createLecture = async (values) => {
    setLoadingForm(true);
    await API(`lecture.createLecture`, {
      data: values,
    })
      .then((res) => {
        setLoadingForm(false);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil membuat data",
            description: "Data dosen berhasil dibuat!",
          });
          navigate("/dosen");
        } else {
          notification.info({
            message: "Gagal membuat data",
            description:
              "Data dengan NIDN yang sama telah ada, harap ganti NIDN!",
          });
        }
      })
      .catch((res) => {
        setLoadingForm(false);
        notification.error({
          message: "Gagal membuat data",
          description: "Data dosen gagal dibuat!",
        });
      });
  };

  const updateLecture = async (values) => {
    setLoadingForm(true);
    await API(`lecture.updateLecture`, {
      data: values,
      query: { id: dosenId },
    })
      .then((res) => {
        setLoadingForm(false);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil memperbarui data",
            description: "Data dosen berhasil diperbarui!",
          });
          navigate("/dosen");
        } else {
          notification.info({
            message: "Gagal memperbarui data",
            description:
              "Data dengan NIDN yang sama telah ada, harap ganti NIDN!",
          });
        }
      })
      .catch((res) => {
        setLoadingForm(false);
        notification.error({
          message: "Gagal memperbarui data",
          description: "Data dosen gagal diperbarui!",
        });
      });
  };

  useEffect(() => {
    getFaculty();
  }, []);

  useEffect(() => {
    if (state?.type !== "Create" && dosenId) {
      getLectureDetail();
    }
  }, [state, dosenId]);

  const onFinish = (values) => {
    let newValues = {
      lectureName: values.lectureName,
      nidn: values.nidn,
      password: values.password,
      faculties: dataFaculties.find(
        (item) => item.facultyId.toString() === values.facultyId
      ),
      status: values.status,
    };
    if (state?.type === "Create") {
      createLecture(newValues);
    } else {
      updateLecture(newValues);
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        style={{ padding: 0, margin: 0 }}
        onBack={() => navigate("/dosen")}
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
          Dosen
        </div>
        <Form name="formDosen" onFinish={onFinish} form={form}>
          <Divider />
          <Row
            gutter={[
              { xs: 0, md: 72 },
              { xs: 20, md: 65 },
            ]}
          >
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Nama Dosen</div>
                <div>
                  <Form.Item
                    name="lectureName"
                    rules={[
                      {
                        required: true,
                        message: "Harap masukkan nama dosen!",
                      },
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder="Masukkan Nama Dosen"
                      readOnly={state?.type === "Detail"}
                      disabled={loadingForm}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>NIDN</div>
                <div>
                  <Form.Item
                    name="nidn"
                    rules={[
                      {
                        required: true,
                        message: "Harap masukkan NIDN!",
                      },
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder="Masukkan NIDN"
                      readOnly={state?.type === "Detail"}
                      disabled={loadingForm}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Fakultas</div>
                <div>
                  <Form.Item
                    name="facultyId"
                    rules={[
                      { required: true, message: "Harap pilih fakultas!" },
                    ]}
                  >
                    <Select
                      placeholder="Pilih Fakultas"
                      className="w-full"
                      allowClear
                      style={{ alignItems: "center" }}
                      disabled={state?.type === "Detail" || loadingForm}
                    >
                      {dataFaculties?.map((item) => (
                        <Option key={item.facultyId}>{item.facultyName}</Option>
                      ))}
                    </Select>
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
                onClick={() => navigate("/dosen")}
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

import { ArrowLeftOutlined } from "@ant-design/icons/lib/icons";
import {
  Button,
  Col,
  DatePicker,
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
import moment from "moment";
import { API } from "../../../Services/axios";

export default function MahasiswaFormPage() {
  const navigate = useNavigate();
  const { mahasiswaId } = useParams();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { Password } = Input;
  const { state } = useLocation();
  const [dataMajors, setDataMajors] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);

  const getMajor = async () => {
    await API(`major.getMajor`, {
      params: {
        size: 999999,
        page: 0,
        sort: "",
        search: "",
        id: "",
        fakultas: "",
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          setDataMajors(data?.content);
        }
      })
      .catch((res) => {
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data jurusan gagal didapatkan!",
        });
      });
  };

  const getStudentDetail = async () => {
    await API(`student.getStudent`, {
      params: {
        size: "",
        page: "",
        sort: "",
        search: "",
        jurusan: "",
        id: mahasiswaId,
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          const setData = () => {
            form.setFieldsValue({
              studentName: data.studentName,
              nim: data.nim,
              password: "",
              status: data.users.status,
              year: moment(data.year),
              majorId: data.majors.majorId.toString(),
            });
          };
          setData();
        }
      })
      .catch((res) => {
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data detail mahasiswa gagal didapatkan!",
        });
      });
  };

  const createStudent = async (values) => {
    setLoadingForm(true);
    await API(`student.createStudent`, {
      data: values,
    })
      .then((res) => {
        setLoadingForm(false);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil membuat data",
            description: "Data mahasiswa berhasil dibuat!",
          });
          navigate("/mahasiswa");
        } else {
          notification.info({
            message: "Gagal membuat data",
            description:
              "Data dengan NIM yang sama telah ada, harap ganti NIM!",
          });
        }
      })
      .catch((res) => {
        setLoadingForm(false);
        notification.error({
          message: "Gagal membuat data",
          description: "Data mahasiswa gagal dibuat!",
        });
      });
  };

  const updateStudent = async (values) => {
    setLoadingForm(true);
    await API(`student.updateStudent`, {
      data: values,
      query: { id: mahasiswaId },
    })
      .then((res) => {
        setLoadingForm(false);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil memperbarui data",
            description: "Data mahasiswa berhasil diperbarui!",
          });
          navigate("/mahasiswa");
        } else {
          notification.info({
            message: "Gagal memperbarui data",
            description:
              "Data dengan NIM yang sama telah ada, harap ganti NIM!",
          });
        }
      })
      .catch((res) => {
        setLoadingForm(false);
        notification.error({
          message: "Gagal memperbarui data",
          description: "Data mahasiswa gagal diperbarui!",
        });
      });
  };

  useEffect(() => {
    getMajor();
  }, []);

  useEffect(() => {
    if (state?.type !== "Create" && mahasiswaId) {
      getStudentDetail();
    }
  }, [state, mahasiswaId]);

  const onFinish = (values) => {
    let newValues = {
      studentName: values.studentName,
      nim: values.nim,
      password: values.password,
      status: values.status,
      year: values.year.format("YYYY"),
      majors: dataMajors.find(
        (item) => item.majorId.toString() === values.majorId
      ),
    };
    if (state?.type === "Create") {
      createStudent(newValues);
    } else {
      updateStudent(newValues);
    }
  };

  function disabledDate(current) {
    return current && current > moment().endOf("year");
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        style={{ padding: 0, margin: 0 }}
        onBack={() => navigate("/mahasiswa")}
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
          Mahasiswa
        </div>
        <Form name="formMahasiswa" onFinish={onFinish} form={form}>
          <Divider />
          <Row
            gutter={[
              { xs: 0, md: 72 },
              { xs: 20, md: 65 },
            ]}
          >
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Nama Mahasiswa</div>
                <div>
                  <Form.Item
                    name="studentName"
                    rules={[
                      {
                        required: true,
                        message: "Harap masukkan nama mahasiswa!",
                      },
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder="Masukkan Nama Mahasiswa"
                      readOnly={state?.type === "Detail"}
                      disabled={loadingForm}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>NIM</div>
                <div>
                  <Form.Item
                    name="nim"
                    rules={[
                      {
                        required: true,
                        message: "Harap masukkan NIM!",
                      },
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder="Masukkan NIM"
                      readOnly={state?.type === "Detail"}
                      disabled={loadingForm}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Jurusan</div>
                <div>
                  <Form.Item
                    name="majorId"
                    rules={[
                      { required: true, message: "Harap pilih jurusan!" },
                    ]}
                  >
                    <Select
                      placeholder="Pilih Jurusan"
                      className="w-full"
                      allowClear
                      style={{ alignItems: "center" }}
                      disabled={state?.type === "Detail" || loadingForm}
                    >
                      {dataMajors?.map((item) => (
                        <Option key={item.majorId}>{item.majorName}</Option>
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
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Angkatan</div>
                <div>
                  <Form.Item
                    name="year"
                    rules={[{ required: true, message: "Harap pilih tahun!" }]}
                  >
                    <DatePicker
                      disabled={state?.type === "Detail" || loadingForm}
                      placeholder="Pilih Tahun"
                      picker="year"
                      className="w-full"
                      disabledDate={disabledDate}
                    />
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
                onClick={() => navigate("/mahasiswa")}
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

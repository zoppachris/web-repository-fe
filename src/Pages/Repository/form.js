import {
  ArrowLeftOutlined,
  FileOutlined,
  UploadOutlined,
} from "@ant-design/icons/lib/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  PageHeader,
  Row,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

export default function RepositoryFormPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { TextArea } = Input;
  const { state } = useLocation();
  const [urlSkripsi, setUrlSkripsi] = useState("");
  const [urlSkripsiFull, setUrlSkripsiFull] = useState("");
  const [fileBase64, setFileBase64] = useState(null);
  const [fileFullBase64, setFileFullBase64] = useState(null);
  const [validationSkripsi, setValidationSkripsi] = useState({
    help: "",
    status: "success",
  });
  const [validationSkripsiFull, setValidationSkripsiFull] = useState({
    help: "",
    status: "success",
  });

  // useEffect(() => {
  //   if (state?.type !== "Create") {
  //     getMahasiswaDetail(state?.mahasiswaId);
  //   }
  // }, [state]);

  // const getMahasiswaDetail = (id) => {
  //   console.log(id);
  //   setUrlSkripsi(
  //     "https://png.pngtree.com/element_our/png/20181022/man-avatar-icon-professional-man-character-business-man-avatar-carton-symbol-png_206531.jpg"
  //   );
  //   const setData = () => {
  //     form.setFieldsValue({
  //       nim: "55201118021",
  //       namaMahasiswa: "Bagas Hermawan",
  //       angkatan: moment("2017"),
  //       password: "tes123",
  //       status: 1,
  //       jurusanId: "1",
  //     });
  //   };
  //   setData();
  // };

  const dataMahasiswa = [
    {
      key: "1",
      mahasiswaId: "1",
      nim: "55201118021",
      namaMahasiswa: "Bagas Hermawan",
      namaJurusan: "Teknik Informatika",
      angkatan: "2017",
    },
    {
      key: "2",
      mahasiswaId: "2",
      nim: "55201118022",
      namaMahasiswa: "Muhammad Aldi",
      namaJurusan: "Manajemen Bisnis",
      angkatan: "2017",
    },
  ];

  const handleChangeFile = (info, type) => {
    const isPdf = info.file.type === "application/pdf";
    const isSizeSkripsi = info.file.size / 1024 / 1024 < 5;
    const isSizeSkripsiFull = info.file.size / 1024 / 1024 < 15;
    if (type === "skripsi") {
      if (!isPdf) {
        setValidationSkripsi({
          help: "Harap format berbentuk pdf",
          status: "error",
        });
      }
      if (!isSizeSkripsi) {
        setValidationSkripsi({
          help: "Harap upload file dibawah 5mb",
          status: "error",
        });
      }
      if (isPdf && isSizeSkripsi) {
        setValidationSkripsi({
          help: "",
          status: "success",
        });
        // getBase64(info.file.originFileObj, (fileUrl) => setFileBase64(fileUrl));
      }
    } else {
      if (!isPdf) {
        setValidationSkripsiFull({
          help: "Harap format berbentuk pdf",
          status: "error",
        });
      }
      if (!isSizeSkripsiFull) {
        setValidationSkripsiFull({
          help: "Harap upload file dibawah 20mb",
          status: "error",
        });
      }
      if (isPdf && isSizeSkripsiFull) {
        setValidationSkripsiFull({
          help: "",
          status: "success",
        });
        // getBase64(info.file.originFileObj, (fileUrl) =>
        //   setFileFullBase64(fileUrl)
        // );
      }
    }
  };

  const onFinish = (value) => {
    if (
      urlSkripsi !== "" ||
      fileBase64 !== null ||
      urlSkripsiFull !== "" ||
      fileFullBase64 !== null
    ) {
      console.log(value);
    } else {
      setValidationSkripsi({
        help: "Harap upload dokumen",
        status: "error",
      });
      setValidationSkripsiFull({
        help: "Harap upload dokumen",
        status: "error",
      });
    }
    // form.resetFields();
  };

  const onFinishFailed = (value) => {
    if (
      urlSkripsi === "" &&
      fileBase64 === null &&
      urlSkripsiFull === "" &&
      fileFullBase64 === null
    ) {
      setValidationSkripsi({
        help: "Harap upload dokumen",
        status: "error",
      });
      setValidationSkripsiFull({
        help: "Harap upload dokumen",
        status: "error",
      });
    } else {
      setValidationSkripsi({
        help: "",
        status: "success",
      });
      setValidationSkripsiFull({
        help: "",
        status: "success",
      });
    }
  };

  function disabledDate(current) {
    return current && current > moment().endOf("year");
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        style={{ padding: 0, margin: 0 }}
        onBack={() => navigate("/repository")}
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
        <div className="text-4xl text-primary1">{state?.type} Repository</div>
        <Form
          name="formMahasiswa"
          onFinish={onFinish}
          form={form}
          onFinishFailed={onFinishFailed}
        >
          <Divider />
          <Row
            gutter={[
              { xs: 0, md: 72 },
              { xs: 20, md: 65 },
            ]}
          >
            <Col xs={24} md={24}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Judul</div>
                <div>
                  <Form.Item
                    name="judul"
                    rules={[
                      {
                        required: true,
                        message: "Harap masukkan judul!",
                      },
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder="Masukkan Judul"
                      disabled={state?.type === "Detail"}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Abstrak</div>
                <div>
                  <Form.Item
                    name="abstrak"
                    rules={[
                      {
                        required: true,
                        message: "Harap masukkan abstrak!",
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Masukkan Abstrak"
                      disabled={state?.type === "Detail"}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Kata Kunci</div>
                <div>
                  <Form.Item
                    name="keyword"
                    rules={[
                      {
                        required: true,
                        message: "Harap masukkan kata kunci!",
                      },
                    ]}
                  >
                    <TextArea
                      rows={2}
                      placeholder="Masukkan Kata Kunci"
                      disabled={state?.type === "Detail"}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Mahasiswa</div>
                <div>
                  <Form.Item
                    name="mahasiswaId"
                    rules={[
                      { required: true, message: "Harap pilih jurusan!" },
                    ]}
                  >
                    <Select
                      placeholder="Pilih Mahasiswa"
                      className="w-full"
                      allowClear
                      style={{ alignItems: "center" }}
                      disabled={state?.type === "Detail"}
                    >
                      {dataMahasiswa?.map((item) => (
                        <Option key={item.mahasiswaId}>
                          {item.namaMahasiswa}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Tahun</div>
                <div>
                  <Form.Item
                    name="tahun"
                    rules={[{ required: true, message: "Harap pilih tahun!" }]}
                  >
                    <DatePicker
                      disabled={state?.type === "Detail"}
                      placeholder="Pilih Tahun"
                      picker="year"
                      className="w-full"
                      disabledDate={disabledDate}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Skripsi Bab 1</div>
                <div>
                  <Form.Item
                    help={validationSkripsi.help}
                    validateStatus={validationSkripsi.status}
                  >
                    <Upload
                      disabled={state?.type === "Detail"}
                      showUploadList={false}
                      onChange={(info) => handleChangeFile(info, "skripsi")}
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                    {fileBase64 !== null || urlSkripsi !== "" ? (
                      <div className="text-2xl text-primary1 cursor-pointer flex flex-row mt-2 gap-3 items-center">
                        <FileOutlined />
                        <div
                          className="text-sm hover:opacity-80"
                          onClick={() =>
                            window.open(
                              fileBase64 !== null ? fileBase64 : urlSkripsi,
                              "_blank"
                            )
                          }
                        >
                          Open File
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Skripsi Full</div>
                <div>
                  <Form.Item
                    help={validationSkripsiFull.help}
                    validateStatus={validationSkripsiFull.status}
                  >
                    <Upload
                      disabled={state?.type === "Detail"}
                      showUploadList={false}
                      onChange={(info) =>
                        handleChangeFile(info, "skripsi full")
                      }
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                    {fileFullBase64 !== null || urlSkripsiFull !== "" ? (
                      <div className="text-2xl text-primary1 cursor-pointer flex flex-row mt-2 gap-3 items-center">
                        <FileOutlined />
                        <div
                          className="text-sm hover:opacity-80"
                          onClick={() =>
                            window.open(
                              fileFullBase64 !== null
                                ? fileFullBase64
                                : urlSkripsiFull,
                              "_blank"
                            )
                          }
                        >
                          Open File
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
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
                onClick={() => navigate("/repository")}
              >
                Cancel
              </Button>
              <Button
                className="md:w-auto w-full"
                htmlType="submit"
                type="primary"
                //   loading={loading}
              >
                {state?.type}
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}

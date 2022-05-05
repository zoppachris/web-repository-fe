import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons/lib/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  PageHeader,
  Radio,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { getBase64 } from "../../../functions/Global";
import moment from "moment";

export default function MahasiswaFormPage() {
  const navigate = useNavigate();
  const { mahasiswaId } = useParams();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { Password } = Input;
  const { state } = useLocation();
  const [urlImage, setUrlImage] = useState("");
  const [base64, setBase64] = useState(null);
  const [validationImageType, setValidationImageType] = useState({
    help: "",
    status: "success",
  });

  useEffect(() => {
    if (state?.type !== "Create" && mahasiswaId) {
      getMahasiswaDetail();
    }
  }, [state, mahasiswaId]);

  const getMahasiswaDetail = () => {
    setUrlImage(
      "https://png.pngtree.com/element_our/png/20181022/man-avatar-icon-professional-man-character-business-man-avatar-carton-symbol-png_206531.jpg"
    );
    const setData = () => {
      form.setFieldsValue({
        nim: "55201118021",
        namaMahasiswa: "Bagas Hermawan",
        angkatan: moment("2017"),
        password: "tes123",
        status: 1,
        jurusanId: "1",
      });
    };
    setData();
  };

  const dataJurusan = [
    {
      jurusanId: "1",
      namaJurusan: "Teknik Informatika",
    },
    {
      jurusanId: "2",
      namaJurusan: "Teknik Penerbangan",
    },
  ];

  const handleChangeImage = (info) => {
    const isJpgOrPng =
      info.file.type === "image/jpeg" || info.file.type === "image/png";
    const isSize = info.file.size < 204800;
    if (!isJpgOrPng) {
      setValidationImageType({
        help: "Harap format berbentuk jpg, jpeg atau png",
        status: "error",
      });
    }
    if (!isSize) {
      setValidationImageType({
        help: "Harap upload gambar dibawah 200kb",
        status: "error",
      });
    }
    if (isJpgOrPng && isSize) {
      setValidationImageType({
        help: "",
        status: "success",
      });
      //   getBase64(info.file.originFileObj, (imageUrl) => setBase64(imageUrl));
    }
  };

  const onFinish = (value) => {
    if (urlImage !== "" || base64 !== null) {
      console.log(value);
    } else {
      setValidationImageType({
        help: "Harap upload foto profile",
        status: "error",
      });
    }
    // form.resetFields();
  };

  const onFinishFailed = (value) => {
    if (urlImage === "" && base64 === null) {
      setValidationImageType({
        help: "Harap upload foto profile",
        status: "error",
      });
    } else {
      setValidationImageType({
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
        <div className="text-4xl text-primary1">{state?.type} Mahasiswa</div>
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
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Nama Mahasiswa</div>
                <div>
                  <Form.Item
                    name="namaMahasiswa"
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
                    name="jurusanId"
                    rules={[
                      { required: true, message: "Harap pilih jurusan!" },
                    ]}
                  >
                    <Select
                      placeholder="Pilih Jurusan"
                      className="w-full"
                      allowClear
                      style={{ alignItems: "center" }}
                      disabled={state?.type === "Detail"}
                    >
                      {dataJurusan?.map((item) => (
                        <Option key={item.jurusanId}>{item.namaJurusan}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-col text-primary1 gap-3">
                <div>Password</div>
                <div>
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: "Harap masukkan password!" },
                    ]}
                  >
                    <Password
                      placeholder="Masukkan Password"
                      allowClear
                      readOnly={state?.type === "Detail"}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
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
                      disabled={state?.type === "Detail"}
                    >
                      <Space direction="vertical">
                        <Radio value={1}>Aktif</Radio>
                        <Radio value={0}>Tidak Aktif</Radio>
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
                    name="angkatan"
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
                <div>Foto Profile</div>
                <div>
                  <Form.Item
                    help={validationImageType.help}
                    validateStatus={validationImageType.status}
                  >
                    <Upload
                      disabled={state?.type === "Detail"}
                      listType="picture-card"
                      showUploadList={false}
                      onChange={handleChangeImage}
                    >
                      {base64 || urlImage ? (
                        <img
                          src={base64 !== null ? base64 : urlImage}
                          alt="avatar"
                          className="h-24 w-24 object-cover"
                        />
                      ) : (
                        <div>
                          <PlusOutlined />
                        </div>
                      )}
                    </Upload>
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

import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons/lib/icons";
import {
  Button,
  Col,
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

export default function DosenFormPage() {
  const navigate = useNavigate();
  const { dosenId } = useParams();
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
    if (state?.type !== "Create" && dosenId) {
      getDosenDetail();
    }
  }, [state, dosenId]);

  const getDosenDetail = () => {
    setUrlImage(
      "https://png.pngtree.com/element_our/png/20181022/man-avatar-icon-professional-man-character-business-man-avatar-carton-symbol-png_206531.jpg"
    );
    const setData = () => {
      form.setFieldsValue({
        namaDosen: "Dr. Drs. H. Aji Komarudin, M.Si.",
        nidn: "8809840017",
        password: "tes123",
        status: 1,
        fakultasId: "1",
      });
    };
    setData();
  };

  const dataFakultas = [
    {
      fakultasId: "1",
      namaFakultas: "Fakultas Ilmu Komputer",
    },
    {
      fakultasId: "2",
      namaFakultas: "Fakultas Ekonomi",
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
        <div className="text-4xl text-primary1">{state?.type} Dosen</div>
        <Form
          name="formDosen"
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
                <div>Nama Dosen</div>
                <div>
                  <Form.Item
                    name="namaDosen"
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
                      disabled={state?.type === "Detail"}
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
                      disabled={state?.type === "Detail"}
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
                    name="fakultasId"
                    rules={[
                      { required: true, message: "Harap pilih fakultas!" },
                    ]}
                  >
                    <Select
                      placeholder="Pilih Fakultas"
                      className="w-full"
                      allowClear
                      style={{ alignItems: "center" }}
                      disabled={state?.type === "Detail"}
                    >
                      {dataFakultas?.map((item) => (
                        <Option key={item.fakultasId}>
                          {item.namaFakultas}
                        </Option>
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
                    {state?.type === "Detail" ? (
                      <Input disabled />
                    ) : (
                      <Password placeholder="Masukkan Password" allowClear />
                    )}
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
                onClick={() => navigate("/dosen")}
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

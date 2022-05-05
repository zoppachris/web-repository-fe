import {
  ArrowLeftOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons/lib/icons";
import {
  Avatar,
  Button,
  Col,
  notification,
  PageHeader,
  Row,
  Upload,
} from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();

  const handleChangeImage = (info) => {
    const isJpgOrPng =
      info.file.type === "image/jpeg" || info.file.type === "image/png";
    const isSize = info.file.size < 204800;
    if (!isJpgOrPng) {
      notification.info({
        message: "Upload gambar",
        description: "Harap format berbentuk jpg, jpeg atau png",
      });
    }
    if (!isSize) {
      notification.info({
        message: "Upload gambar",
        description: "Harap upload gambar dibawah 200kb",
      });
    }
    if (isJpgOrPng && isSize) {
      console.log(info.file.originFileObj);
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        style={{ padding: 0, margin: 0 }}
        onBack={() => navigate("/repository", { replace: true })}
        backIcon={
          <div className="text-primaryVariant">
            <ArrowLeftOutlined />
          </div>
        }
        title={
          <div className="text-primary1 font-semibold text-xl">Kembali</div>
        }
      />
      <div className="mt-16 text-primary1 font-semibold text-xl">
        <Row gutter={[0, 40]}>
          <Col span={24}>
            <Row>
              <Col xs={12} sm={8} md={4}>
                {localStorage.getItem("roleScope") === "mahasiswa"
                  ? "NIM"
                  : "NIDN"}
              </Col>
              <Col span={2}>:</Col>
              <Col xs={10} sm={14} md={18}>
                8809840017
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row>
              <Col xs={12} sm={8} md={4}>
                Nama{" "}
                {localStorage.getItem("roleScope") === "mahasiswa"
                  ? "Mahasiswa"
                  : "Dosen"}
              </Col>
              <Col span={2}>:</Col>
              <Col xs={10} sm={14} md={18}>
                Dr. Drs. H. Aji Komarudin, M.Si.
              </Col>
            </Row>
          </Col>
          {localStorage.getItem("roleScope") === "mahasiswa" ? (
            <>
              <Col span={24}>
                <Row>
                  <Col xs={12} sm={8} md={4}>
                    Jurusan
                  </Col>
                  <Col span={2}>:</Col>
                  <Col xs={10} sm={14} md={18}>
                    Teknik Informatika
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col xs={12} sm={8} md={4}>
                    Angkatan
                  </Col>
                  <Col span={2}>:</Col>
                  <Col xs={10} sm={14} md={18}>
                    2017
                  </Col>
                </Row>
              </Col>
            </>
          ) : (
            <Col span={24}>
              <Row>
                <Col xs={12} sm={8} md={4}>
                  Fakultas
                </Col>
                <Col span={2}>:</Col>
                <Col xs={10} sm={14} md={18}>
                  Fakultas Ilmu Komputer
                </Col>
              </Row>
            </Col>
          )}
          <Col span={24}>
            <Row>
              <Col xs={12} sm={8} md={4}>
                Status
              </Col>
              <Col span={2}>:</Col>
              <Col xs={10} sm={14} md={18}>
                Aktif
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row>
              <Col xs={12} sm={8} md={4}>
                Foto Profile
              </Col>
              <Col span={2}>:</Col>
              <Col xs={10} sm={14} md={18}>
                <Avatar
                  shape="square"
                  icon={<UserOutlined />}
                  size={{
                    xs: 100,
                    sm: 150,
                    md: 200,
                    lg: 200,
                    xl: 200,
                    xxl: 200,
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
                <Upload
                  // disabled={state?.type === "Detail"}
                  showUploadList={false}
                  onChange={handleChangeImage}
                >
                  <Button icon={<UploadOutlined />} size="small">
                    Ganti Foto Profile
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}

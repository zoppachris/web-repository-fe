import { ArrowLeftOutlined } from "@ant-design/icons/lib/icons";
import { Col, PageHeader, Row } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { GlobalFunctions } from "../../GlobalFunctions";

export default function ProfilePage() {
  const navigate = useNavigate();

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
                {GlobalFunctions.decrypt("roleName")?.toLowerCase() ===
                "lecturer"
                  ? "NIDN"
                  : "NIM"}
              </Col>
              <Col span={2}>:</Col>
              <Col xs={10} sm={14} md={18}>
                {GlobalFunctions.decrypt("username")}
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row>
              <Col xs={12} sm={8} md={4}>
                Nama{" "}
                {GlobalFunctions.decrypt("roleName").toLowerCase() ===
                "lecturer"
                  ? "Dosen"
                  : "Mahasiswa"}
              </Col>
              <Col span={2}>:</Col>
              <Col xs={10} sm={14} md={18}>
                {GlobalFunctions.decrypt("name")}
              </Col>
            </Row>
          </Col>
          {GlobalFunctions.decrypt("roleName").toLowerCase() === "student" ? (
            <>
              <Col span={24}>
                <Row>
                  <Col xs={12} sm={8} md={4}>
                    Jurusan
                  </Col>
                  <Col span={2}>:</Col>
                  <Col xs={10} sm={14} md={18}>
                    {GlobalFunctions.decrypt("majorName")}
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
                  {GlobalFunctions.decrypt("facultyName")}
                </Col>
              </Row>
            </Col>
          )}
          {/* <Col span={24}>
            <Row>
              <Col xs={12} sm={8} md={4}>
                Status
              </Col>
              <Col span={2}>:</Col>
              <Col xs={10} sm={14} md={18}>
                Aktif
              </Col>
            </Row>
          </Col> */}
        </Row>
      </div>
    </div>
  );
}

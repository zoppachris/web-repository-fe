import { ArrowLeftOutlined, FileOutlined } from "@ant-design/icons/lib/icons";
import { notification, PageHeader } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../../Services/axios";

export default function ThesesDetailPage() {
  const navigate = useNavigate();
  const { thesesId } = useParams();
  const [detailTheses, setDetailTheses] = useState({});

  useEffect(() => {
    getThesesDetail();
  }, []);

  const getThesesDetail = async () => {
    await API(`theses.getTheses`, {
      params: {
        size: "",
        page: "",
        sort: "",
        search: "",
        id: thesesId,
        jurusan: "",
        year: "",
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          setDetailTheses(data);
        }
      })
      .catch((res) => {
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data detail dosen gagal didapatkan!",
        });
      });
  };

  const openUrl = () => {
    window.open(
      detailTheses?.fullDocumentPath
        ? detailTheses?.fullDocumentPath
        : detailTheses?.partialDocumentPath,
      "_blank"
    );
  };

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
      <div className="mt-4 gap-9 flex flex-col text-justify">
        <div className="mt-4 gap-4 flex flex-col">
          <div className="text-primary1 font-semibold text-xl">Judul</div>
          <div className="text-lg">{detailTheses?.thesesTitle}</div>
        </div>
        <div className="mt-4 gap-4 flex flex-col">
          <div className="text-primary1 font-semibold text-xl">Tahun</div>
          <div className="text-lg">{detailTheses?.year}</div>
        </div>
        <div className="mt-4 gap-4 flex flex-col">
          <div className="text-primary1 font-semibold text-xl">Abstrak</div>
          <div className="text-lg">{detailTheses?.abstracts}</div>
        </div>
        <div className="mt-4 gap-4 flex flex-col">
          <div className="text-primary1 font-semibold text-xl">Kata Kunci</div>
          <div className="text-lg">{detailTheses?.keywords}</div>
        </div>
        <div className="mt-4 gap-4 flex flex-col">
          <div className="text-primary1 font-semibold text-xl">Mahasiswa</div>
          <div className="text-lg">
            {detailTheses?.students?.studentName} |{" "}
            {detailTheses?.students?.majors?.majorName} |{" "}
            {detailTheses?.students?.majors?.faculties?.facultyName} | Angkatan{" "}
            {detailTheses?.students?.year}
          </div>
        </div>
        <div className="mt-4 gap-4 flex flex-col">
          <div className="text-primary1 font-semibold text-xl">
            Download File
          </div>
          <div className="text-2xl text-primary1 cursor-pointer">
            <FileOutlined onClick={openUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}

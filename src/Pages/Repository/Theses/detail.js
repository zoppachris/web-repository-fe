import { ArrowLeftOutlined, FileOutlined } from "@ant-design/icons/lib/icons";
import { Modal, notification, PageHeader, Skeleton, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalFunctions } from "../../../GlobalFunctions";
import { API } from "../../../Services/axios";

export default function ThesesDetailPage() {
  const navigate = useNavigate();
  const { thesesId } = useParams();
  const [detailTheses, setDetailTheses] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);

  useEffect(() => {
    getThesesDetail();
    checkExpireUser();
  }, []);

  const checkExpireUser = () => {
    const expire = parseInt(GlobalFunctions.decrypt("expire"));
    const currentTime = Math.round(Date.now() / 1000);

    if (currentTime > expire) {
      localStorage.clear();
      Modal.info({
        title: "Sesi login telah habis!",
        content: "Harap login kembali",
        centered: true,
        maskClosable: true,
        onCancel: () => GlobalFunctions.reloadPage(),
        onOk: () => GlobalFunctions.reloadPage(),
      });
    }
  };

  const downloadFile = async (fileUrl) => {
    setLoadingDownload(true);
    await API(`theses.downloadFile`, {
      params: {
        filename: fileUrl,
      },
      responseType: "blob",
    })
      .then((res) => {
        setLoadingDownload(false);
        if (res.status === 200 && res.data) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileUrl);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      })
      .catch((res) => {
        setLoadingDownload(false);
        notification.error({
          message: "Gagal download file",
          description: "File tugas akhir gagal untuk di download!",
        });
      });
  };

  const getThesesDetail = async () => {
    setLoading(true);
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
        setLoading(false);
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          setDetailTheses(data);
        }
      })
      .catch((res) => {
        setLoading(false);
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data detail dosen gagal didapatkan!",
        });
      });
  };

  const openUrl = () => {
    downloadFile(
      detailTheses?.fullDocumentUrl
        ? detailTheses?.fullDocumentUrl
        : detailTheses?.partialDocumentUrl
    );
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        style={{ padding: 0, margin: 0 }}
        onBack={() => navigate(-1)}
        backIcon={
          <div className="text-primaryVariant">
            <ArrowLeftOutlined />
          </div>
        }
        title={
          <div className="text-primary1 font-semibold text-xl">Kembali</div>
        }
      />
      {loading ? (
        <>
          <Skeleton loading={loading} active />
          <Skeleton loading={loading} active />
          <Skeleton loading={loading} active />
          <Skeleton loading={loading} active />
          <Skeleton loading={loading} active />
        </>
      ) : (
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
            <div className="text-primary1 font-semibold text-xl">
              Kata Kunci
            </div>
            <div className="text-lg">{detailTheses?.keywords}</div>
          </div>
          <div className="mt-4 gap-4 flex flex-col">
            <div className="text-primary1 font-semibold text-xl">Mahasiswa</div>
            <div className="text-lg">
              {detailTheses?.students?.studentName} |{" "}
              {detailTheses?.students?.majors?.majorName} |{" "}
              {detailTheses?.students?.majors?.faculties?.facultyName} |
              Angkatan {detailTheses?.students?.year}
            </div>
          </div>
          <div className="mt-4 gap-4 flex flex-col">
            <div className="text-primary1 font-semibold text-xl">
              Download File
            </div>
            <div className="text-2xl text-primary1">
              {loadingDownload ? (
                <Spin size="small" />
              ) : (
                <FileOutlined onClick={openUrl} className="cursor-pointer" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { ArrowLeftOutlined, FileOutlined } from "@ant-design/icons/lib/icons";
import { PageHeader } from "antd";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RepositoryDetailPage() {
  const navigate = useNavigate();
  const { repositoryId } = useParams();

  console.log(repositoryId);
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
          <div className="text-lg">
            Analisis Dan Perbaikan Antarmuka Pada Situs Web Brawijaya
            Information Technology Services (Bits) Menggunakan Metode Evaluasi
            Heuristik
          </div>
        </div>
        <div className="mt-4 gap-4 flex flex-col">
          <div className="text-primary1 font-semibold text-xl">Tahun</div>
          <div className="text-lg">2018</div>
        </div>
        <div className="mt-4 gap-4 flex flex-col">
          <div className="text-primary1 font-semibold text-xl">Abstrak</div>
          <div className="text-lg">
            UPT TIK merupakan pengelola situs web BITS. Salah satu yang tidak
            bisa lepas dari kualitas situs web ialah tampilan antarmuka
            pengguna. Antarmuka situs web sangat berpengaruh pada proses
            operasional penggunaan situs web. Untuk menggali permalahan yang ada
            di situs web BITS maka dilakukan observasi dan wawancara dengan
            pihak terkait dari pengelola situs web BITS. Berdasarkan hasil
            obeservasi dan wawancara ditemukan sejumlah permasalahan pada
            antarmuka situs web BITS. Mengingat pentingnya fungsi situs web bagi
            kegiatan oprasional dan berdasarkan permasalahan yang ada, maka
            peneliti mengusulkan evaluasi situs web BITS mengguna evaluasi
            heuristik. Evaluasi dilakukan dalam 2 tahap, yaitu evaluasi tahap
            awal dan evaluasi tahap akhir. Pada evaluasi tahap awal, evaluasi
            dilakukan pada situs web BITS dengan total temuan permasalahan
            sebanyak 28 temuan dan permasalahan paling banyak ditemukan terletak
            pada katagori H8 (aesthetic and minimalist design). Berdasarkan
            hasil evaluasi tahap awal dilakukan perbaikan situs web BITS. Pada
            evaluasi tahap akhir, evaluasi dilakukan pada hasil perbaikan situs
            web BITS dengan total temuan permasalahan sebanyak 15 temuan dan
            permasalahan paling banyak ditemukan pada evaluasi tahap akhir
            terletak pada katagori H8 (aesthetic and minimalist design.
            Rata-rata severity ratings pada evaluasi tahap akhir terdapat pada
            skala 2 (minor usability problem), sehingga perlu adanya perbaikan
            lanjutan dari situs web BITS.
          </div>
        </div>
        <div className="mt-4 gap-4 flex flex-col">
          <div className="text-primary1 font-semibold text-xl">Kata Kunci</div>
          <div className="text-lg">tes tes tes123</div>
        </div>
        <div className="mt-4 gap-4 flex flex-col">
          <div className="text-primary1 font-semibold text-xl">Mahasiswa</div>
          <div className="text-lg">
            Bagas Hermawan / Teknik Informatika / Fakultas Teknik / Angkatan
            2017
          </div>
        </div>
        <div className="mt-4 gap-4 flex flex-col">
          <div className="text-primary1 font-semibold text-xl">
            Download File
          </div>
          <div className="text-2xl text-primary1 cursor-pointer">
            <FileOutlined />
          </div>
        </div>
      </div>
    </div>
  );
}

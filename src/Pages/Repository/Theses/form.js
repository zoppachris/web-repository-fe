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
  Modal,
  notification,
  PageHeader,
  Row,
  Select,
  Spin,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import _debounce from "lodash.debounce";
import apiClient, { API } from "../../../Services/axios";
import { GlobalFunctions } from "../../../GlobalFunctions";

export default function ThesesFormPage() {
  const navigate = useNavigate();
  const { thesesId } = useParams();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { TextArea } = Input;
  const { state } = useLocation();
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [dataStudents, setDataStudents] = useState([]);
  const [thesesPartialUrl, setThesesPartialUrl] = useState("");
  const [thesesFullUrl, setThesesFullUrl] = useState("");
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

  useEffect(() => {
    if (state?.type !== "Create" && thesesId) {
      getThesesDetail();
    } else if (
      GlobalFunctions.decrypt("roleName")?.toLowerCase() === "student"
    ) {
      getStudent(GlobalFunctions.decrypt("name"));
    }
  }, []);

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
          setThesesPartialUrl(data?.partialDocumentUrl);
          setThesesFullUrl(data?.fullDocumentUrl);
          setDataStudents([data?.students]);
          setSelectedStudent(data?.students);
          const setData = () => {
            form.setFieldsValue({
              thesesTitle: data.thesesTitle,
              abstracts: data.abstracts,
              keywords: data.keywords,
              studentId: data.students.studentId.toString(),
              year: moment(data.year),
              partialDocumentUrl: data.partialDocumentUrl,
              fullDocumentUrl: data.fullDocumentUrl,
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

  const getStudent = async (val) => {
    setLoadingStudent(true);
    await API(`student.getStudent`, {
      params: {
        size: 20,
        page: 0,
        sort: "",
        search: val,
        id: "",
        jurusan: "",
        hasTheses:
          GlobalFunctions.decrypt("roleName")?.toLowerCase() === "student"
            ? ""
            : false,
      },
    })
      .then((res) => {
        setLoadingStudent(false);
        if (res.status === 200 && res.data.status === "success") {
          const { data } = res.data;
          setDataStudents(data?.content);
          if (
            GlobalFunctions.decrypt("roleName")?.toLowerCase() === "student"
          ) {
            setSelectedStudent(data?.content[0]);
            const setData = () => {
              form.setFieldsValue({
                studentId: data?.content[0]?.studentId.toString(),
              });
            };
            setData();
          }
        }
      })
      .catch((res) => {
        setLoadingStudent(false);
        notification.info({
          message: "Gagal mendapatkan data",
          description: "Data mahasiswa gagal didapatkan!",
        });
      });
  };

  const uploadFile = (file, userName, oldpath, type) => {
    return new Promise((resolve) => {
      let formData = new FormData();
      formData.append("file", file);

      apiClient({
        method: "put",
        url: "/api/upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        params: {
          username: userName,
          oldpath: oldpath,
        },
      })
        .then((res) => {
          if (res.status === 200 && res.data.status === "success") {
            const { data } = res.data;
            if (type === "thesesPartial") {
              setThesesPartialUrl(data);
            } else {
              setThesesFullUrl(data);
            }
            resolve(data);
          }
        })
        .catch(() => {
          setLoadingForm(false);
          if (type === "thesesPartial") {
            notification.info({
              message: "Gagal upload file",
              description: "File tugas akhir partial gagal untuk di upload!",
            });
          } else {
            notification.info({
              message: "Gagal upload file",
              description: "File tugas akhir full gagal untuk di upload!",
            });
          }
        });
    });
  };

  const createTheses = (values) => {
    API(`theses.createTheses`, {
      data: values,
    })
      .then((res) => {
        setLoadingForm(false);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil membuat data",
            description: "Data tugas akhir berhasil dibuat!",
          });
          if (
            GlobalFunctions.decrypt("roleName")?.toLowerCase() === "student"
          ) {
            localStorage.clear();
            Modal.info({
              title: "Tugas akhir behasil dibuat, akun akan logout otomatis!",
              content: "Silahkan login kembali",
              centered: true,
              maskClosable: true,
              onCancel: () => {
                GlobalFunctions.reloadPage();
                navigate("/", { replace: true });
              },
              onOk: () => {
                GlobalFunctions.reloadPage();
                navigate("/", { replace: true });
              },
            });
          } else {
            navigate(-1);
          }
        } else {
          notification.info({
            message: "Gagal membuat data",
            description: "Data tugas akhir gagal dibuat!",
          });
        }
      })
      .catch((res) => {
        setLoadingForm(false);
        notification.error({
          message: "Gagal membuat data",
          description: "Data tugas akhir gagal dibuat!",
        });
      });
  };

  const updateTheses = (values) => {
    delete values.students;
    API(`theses.updateTheses`, {
      data: values,
      query: { id: thesesId },
    })
      .then((res) => {
        setLoadingForm(false);
        if (res.status === 200 && res.data.status === "success") {
          notification.success({
            message: "Berhasil memperbarui data",
            description: "Data tugas akhir berhasil diperbarui!",
          });
          navigate(-1);
        } else {
          notification.info({
            message: "Gagal memperbarui data",
            description: "Data tugas akhir gagal diperbarui!",
          });
        }
      })
      .catch((res) => {
        setLoadingForm(false);
        notification.error({
          message: "Gagal memperbarui data",
          description: "Data tugas akhir gagal diperbarui!",
        });
      });
  };

  const onSearchStudent = _debounce((val) => {
    if (val) {
      getStudent(val);
    }
  }, 500);

  const handleChangeFile = (info, type) => {
    const isPdf = info.file.type === "application/pdf";
    const isSizeSkripsi = info.file.size / 1024 / 1024 <= 5;
    const isSizeSkripsiFull = info.file.size / 1024 / 1024 <= 15;
    if (type === "thesesPartial") {
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
        setFileBase64(info.file.originFileObj);
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
          help: "Harap upload file dibawah 15mb",
          status: "error",
        });
      }
      if (isPdf && isSizeSkripsiFull) {
        setValidationSkripsiFull({
          help: "",
          status: "success",
        });
        setFileFullBase64(info.file.originFileObj);
      }
    }
  };

  const onFinish = async (values) => {
    if (
      (thesesPartialUrl !== "" || fileBase64 !== null) &&
      (thesesFullUrl !== "" || fileFullBase64 !== null)
    ) {
      let newUrl = thesesPartialUrl;
      let newFullUrl = thesesFullUrl;

      if (fileBase64 && loadingForm) {
        newUrl = await uploadFile(
          fileBase64,
          selectedStudent?.nim,
          thesesPartialUrl,
          "thesesPartial"
        );
      }
      if (fileFullBase64 && loadingForm) {
        newFullUrl = await uploadFile(
          fileFullBase64,
          selectedStudent?.nim,
          thesesFullUrl,
          "thesesFull"
        );
      }

      let newValues = {
        thesesTitle: values.thesesTitle,
        abstracts: values.abstracts,
        keywords: values.keywords,
        partialDocumentUrl: newUrl,
        fullDocumentUrl: newFullUrl,
        year: values.year.format("YYYY"),
        students: selectedStudent,
      };

      if (state?.type === "Create" && loadingForm) {
        createTheses(newValues);
      } else if (state?.type === "Update" && loadingForm) {
        updateTheses(newValues);
      }
    } else {
      setLoadingForm(false);
      if (fileBase64 === null) {
        setValidationSkripsi({
          help: "Harap upload dokumen",
          status: "error",
        });
      }
      if (fileFullBase64 === null) {
        setValidationSkripsiFull({
          help: "Harap upload dokumen",
          status: "error",
        });
      }
    }
  };

  const onFinishFailed = () => {
    if (
      thesesPartialUrl === "" &&
      fileBase64 === null &&
      thesesFullUrl === "" &&
      fileFullBase64 === null
    ) {
      if (fileBase64 === null) {
        setValidationSkripsi({
          help: "Harap upload dokumen",
          status: "error",
        });
      }
      if (fileFullBase64 === null) {
        setValidationSkripsiFull({
          help: "Harap upload dokumen",
          status: "error",
        });
      }
    } else {
      if (fileBase64 !== null) {
        setValidationSkripsi({
          help: "",
          status: "success",
        });
      }
      if (fileFullBase64 !== null) {
        setValidationSkripsiFull({
          help: "",
          status: "success",
        });
      }
    }
  };

  function disabledDate(current) {
    return current && current > moment().endOf("year");
  }

  const onChangeStudent = (value) => {
    setSelectedStudent(
      dataStudents.find(
        (item) => item.studentId.toString() === value.toString()
      )
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
      <div className="font-semibold mt-7">
        <div className="text-4xl text-primary1">
          {state?.type === "Create"
            ? "Buat"
            : state?.type === "Update"
            ? "Edit"
            : "Detail"}{" "}
          Tugas Akhir
        </div>
        <Form
          name="formTheses"
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
                    name="thesesTitle"
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
                    name="abstracts"
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
                    name="keywords"
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
                    name="studentId"
                    rules={[
                      { required: true, message: "Harap pilih jurusan!" },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      notFoundContent={
                        loadingStudent ? <Spin size="small" /> : null
                      }
                      onSearch={onSearchStudent}
                      placeholder="Cari Mahasiswa"
                      className="w-full"
                      allowClear
                      style={{ alignItems: "center" }}
                      disabled={
                        state?.type === "Detail" ||
                        state?.type === "Update" ||
                        GlobalFunctions.decrypt("roleName")?.toLowerCase() ===
                          "student"
                      }
                      onChange={onChangeStudent}
                    >
                      {dataStudents?.map((item) => (
                        <Option key={item.studentId}>
                          {item.nim} - {item.studentName} -{" "}
                          {item.majors?.majorName}
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
                    name="year"
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
                <div>Tugas Akhir Sebagian</div>
                <div>
                  <Form.Item
                    help={validationSkripsi.help}
                    validateStatus={validationSkripsi.status}
                    extra="Upload file dengan format PDF dan ukuran maksimal 5mb"
                  >
                    <Upload
                      disabled={state?.type === "Detail"}
                      showUploadList={false}
                      onChange={(info) =>
                        handleChangeFile(info, "thesesPartial")
                      }
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                    {fileBase64 !== null || thesesPartialUrl !== "" ? (
                      <div className="text-2xl text-primary1 flex flex-row mt-2 gap-3 items-center">
                        <FileOutlined />
                        {loadingDownload && fileBase64 === null ? (
                          <Spin size="little" />
                        ) : (
                          <div
                            className="text-sm cursor-pointer hover:opacity-80"
                            onClick={() =>
                              fileBase64 === null &&
                              downloadFile(thesesPartialUrl)
                            }
                          >
                            {fileBase64?.name || "Download File"}
                          </div>
                        )}
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
                <div>Tugas Akhir Full</div>
                <div>
                  <Form.Item
                    help={validationSkripsiFull.help}
                    validateStatus={validationSkripsiFull.status}
                    extra="Upload file dengan format PDF dan ukuran maksimal 15mb"
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
                    {fileFullBase64 !== null || thesesFullUrl !== "" ? (
                      <div className="text-2xl text-primary1 flex flex-row mt-2 gap-3 items-center">
                        <FileOutlined />
                        {loadingDownload && fileFullBase64 === null ? (
                          <Spin size="little" />
                        ) : (
                          <div
                            className="text-sm cursor-pointer hover:opacity-80"
                            onClick={() =>
                              fileFullBase64 === null &&
                              downloadFile(thesesFullUrl)
                            }
                          >
                            {fileFullBase64?.name || "Download File"}
                          </div>
                        )}
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
                onClick={() => navigate(-1)}
                disabled={loadingForm}
              >
                Batal
              </Button>
              <Button
                className="md:w-auto w-full"
                htmlType="submit"
                type="primary"
                loading={loadingForm}
                onClick={() => setLoadingForm(true)}
              >
                {state?.type === "Create" ? "Buat" : "Edit"}
              </Button>
            </div>
          )}
          <Form.Item name="partialDocumentUrl" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item name="fullDocumentUrl" hidden={true}>
            <Input />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

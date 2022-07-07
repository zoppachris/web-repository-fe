import { Modal } from "antd";
import axios from "axios";
import endpoint from "./endpoints";

const apiClient = axios.create({
  baseURL: `https://be.unnur-repository.com/`,
});

const reloadPage = () => {
  setTimeout(() => {
    window.location.reload(false);
  }, 500);
};

apiClient.interceptors.request.use((request) => {
  const idToken = localStorage.getItem("token");
  const tokenType = localStorage.getItem("tokenType");
  if (idToken) {
    request.headers.Authorization = tokenType + ` ${idToken}`;
  }
  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      Modal.info({
        title: "Sesi login telah habis!",
        content: "Harap login kembali",
        centered: true,
        maskClosable: true,
        onCancel: () => reloadPage(),
        onOk: () => reloadPage(),
      });
    }
    return Promise.reject(error);
  }
);

const urlBuilder = ({ query, urlApi }) => {
  if (query)
    return Object.keys(query).reduce(
      (url, key) => url.replace(`:${key}`, query[key]),
      urlApi
    );
  return urlApi;
};

export const API = (...args) => {
  const [urlMethod, params] = args;
  const [name, method] = urlMethod.split(".");

  const context = { ...endpoint[name][method], ...params };
  context.url = urlBuilder({ ...params, urlApi: endpoint[name][method].url });

  return apiClient(context);
};

export default apiClient;

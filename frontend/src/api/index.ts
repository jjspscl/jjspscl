import axiosClient from 'axios'



const instance = axiosClient.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  },
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response) {
      return Promise.reject(err.response.data);
    }

    if (err.request) {
      return Promise.reject(err.request);
    }

    return Promise.reject(err.message);
  }
);

export * from './blogs';
export default instance;
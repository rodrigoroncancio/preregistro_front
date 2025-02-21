import useAuthStore from "@/modules/auth/stores/auth";
import useGlobalState from "@/stores/global";
import axios from "axios";

const sGlobalState = useGlobalState();
const endpoint = "/api/1.0/core"

const useCustomer = () => {

  const getListLocation = (userId: number) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${endpoint}/customer/list_location/?userId=${userId}`)
        .then(async (resp: any) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getListSos = (userId: number) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${endpoint}/customer/list_sos/?userId=${userId}`)
        .then(async (resp: any) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getPendingSos = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${endpoint}/customer/list_pending/`)
        .then(async (resp: any) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getCloseSos = (item: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${endpoint}/customer/close_sos/`, item)
        .then(async (resp: any) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const setPassword = (item: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${endpoint}/customer/password/`, item)
        .then(async (resp: any) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  return {
    getListLocation,
    getListSos,
    getPendingSos,
    getCloseSos,
    setPassword
  };
};

export default useCustomer;

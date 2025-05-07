import useAuthStore from "@/modules/auth/stores/auth";
import useGlobalState from "@/stores/global";
import useUtils from "@/composables/useUtils";
import axios from "axios";

const sGlobalState = useGlobalState();
const uUtils = useUtils();
const endpointBase = import.meta.env.MODE === 'development' ? "http://dev.direccionsustitucion.gov.co/api/1.0" : "/api/1.0"

const useAuth = (authStore: any = null) => {
  if (authStore == undefined) {
    authStore = useAuthStore();
  }

  const ROLES = {
    ADMIN: 1,
    AUDITOR: 6,
    SUPERVISION: 3,
    SIG: 4,
    TECNICA: 5,
  };

  const authLogIn = (data: any) => {
    return new Promise((resolve, reject) => {
      authLogOut();
      axios
        // .post(`${endpointBase}/auth/jwt/create`, {
        .post(`/api/2.0/auth/jwt/create`, {
          username: data.username,
          password: data.password,
        })
        .then(async (resp: any) => {
          data = {
            accessToken: resp.data["access"],
            refreshToken: resp.data["refresh"],
            userData: resp.data["data"]
          }
          data.userData.image = "";
          data.userData.phone = "";
          authStore.setAuthData(data);
          // await authData();
          sGlobalState.value.auth = true;
          resolve(resp.data);
        })
        .catch((err) => {
          authLogOut();
          reject(err);
        });
    });
  };

  const authLogOut = () => {
    authStore.setAuthData({
      accessToken: "",
      refreshToken: "",
      userData: ""
    });
    sGlobalState.value.auth = false;
  };

  // Obsoleta en /api/2.0/
  const authData = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${endpointBase}/core/user/data/`)
        .then((resp: any) => {
          const data = {
            accessToken: authStore.getAccessToken,
            refreshToken: authStore.getRefreshToken,
            userData: resp.data,
          }
          authStore.setAuthData(data);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const isAuthenticated = () => {
    return getToken() != "";
  };

  const getUserData = () => {
    return authStore.getUserData || {};
  };

  const getUserId = () => {
    return authStore.getUserData ? authStore.getUserData["id"] : "";
  };

  const getToken = () => {
    return authStore.getAccessToken ?? "";
  };

  const getUserRole = () => {
    try {
      const token = getToken();
      const data = token.split(".")[1];
      const dataDecoded: any = uUtils.base64Decode(data);
      const objDecoded: any = uUtils.JsonParse(dataDecoded);
      return objDecoded["roles"];
    } catch {
      return [];
    }
  }

  const isAdmin = () => {
    return getUserRole().includes(ROLES.ADMIN);
  };

  const isAudit = () => {
    return getUserRole().includes(ROLES.AUDITOR);
  };

  const isRol = (rol:number) => {
    return getUserRole().includes(rol);
  };

  return {
    authLogIn,
    authLogOut,
    authData,
    isAuthenticated,
    getUserData,
    getUserId,
    getUserRole,
    getToken,
    isAdmin,
    isAudit,
    isRol,
    ROLES,
  };
};

export default useAuth;

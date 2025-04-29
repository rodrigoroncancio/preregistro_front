import axios from "axios";
import { useLoading } from "vue-loading-overlay";

//Helpers
import { getApiKey } from '@/helpers/apiKey';
import cleanAxios from '@/helpers/cleanAxios';

const loading = useLoading();

const queryParams = (extra: Object = null) => {
  try {
    let qParams = "";
    if ("parameters" in extra) {
      qParams = new URLSearchParams((extra as any)['parameters']).toString();
      if (qParams!= "") qParams = "?" + qParams;
    }
    return qParams;
  } catch { return "" }
}

const useCrud = (endpoint: string, extra: Object = null) => {

    const retrieve = (id: number) => {
        return new Promise((resolve, reject) => {
          let loader = loading.show({});
          axios
            .get(`${endpoint}/${id}/${queryParams(extra)}`)
              .then((resp: any) => {
                resolve(resp.data);
              })
              .catch((err: any) => {
                reject(err);
              })
              .finally(() => {
                loader.hide();
              })
        });
    };

    const list = () => {
        return new Promise((resolve, reject) => {
            const loader = loading.show({});

            cleanAxios.get(`${endpoint}/lts/`, {
                headers: {
                    'Authorization': `Api-Key ${getApiKey()}`
                }
            })
                .then((resp: any) => {
                    resolve(resp.data);
                })
                .catch((err: any) => {
                    reject(err);
                })
                .finally(() => {
                    loader.hide();
                });
        });
    };

    const save = (data: any) => {
    return new Promise(async (resolve, reject) => {
      for (const prop in data) {
        if (data[prop] === null) {
          delete data[prop]
        }
      }
      if (!data.id) {
        await create(data)
          .then((resp: any) => resolve(resp))
          .catch((err: any) => reject(err))
      } else {
        await update(data)
          .then((resp: any) => resolve(resp))
          .catch((err: any) => reject(err))
      }
    });
  }

    const create = (data: any, apiKey?: string) => {
        return new Promise((resolve, reject) => {
          const loader = loading.show({});

          const client = apiKey ? cleanAxios : axios; // Usa cleanAxios si quieres apiKey

          const headers = apiKey
            ? {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Api-Key ${apiKey}`,
              }
            : undefined; // usa los normales

          client
            .post(`${endpoint}/${queryParams(extra)}`, data, { headers })
            .then((resp: any) => {
              resolve(resp.data);
            })
            .catch((err: any) => {
              reject(err);
            })
            .finally(() => {
              loader.hide();
            });
        });
    };

    const update = (data: any, apiKey?: string) => {
        return new Promise((resolve, reject) => {
          const loader = loading.show({});

          const client = apiKey ? cleanAxios : axios; // Usa cleanAxios si hay apiKey

          const headers = apiKey
            ? {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Api-Key ${apiKey}`,
              }
            : undefined; // usa los headers por defecto si no hay apiKey

          client
            .patch(`${endpoint}/${data.id}/${queryParams(extra)}`, data, { headers })
            .then((resp: any) => {
              resolve(resp.data);
            })
            .catch((err: any) => {
              reject(err);
            })
            .finally(() => {
              loader.hide();
            });
        });
    };

    const remove = (id: number) => {
        return new Promise((resolve, reject) => {
          let loader = loading.show({});
          axios
            .delete(`${endpoint}/${id}/${queryParams(extra)}`)
              .then((resp: any) => {
                resolve(resp.data);
              })
              .catch((err: any) => {
                reject(err);
              })
              .finally(() => {
                loader.hide();
              })
        });
    }

    return {
       retrieve,
       list,
       save,
       create,
       update,
       remove
    };
};

export default useCrud;
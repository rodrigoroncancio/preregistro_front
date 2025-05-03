import axios from "axios";
import useErrors from "./useErrors";

const useDataTable = (
  id: string,
  headers: any,
  endpoint: string,
  apikey?: string
) => {
  const errors = useErrors();

  const getData = ({
    page,
    itemsPerPage,
    sortBy,
    search,
    extra
  }: {
    page: number;
    itemsPerPage: number;
    sortBy: Array<{ key: string; dir: "asc" | "desc" }>;
    search: string;
    extra: Object;
  }) => {
    const listParams: any = {
      draw: 0,
      length: itemsPerPage,
      start: ((page - 1) * itemsPerPage).toString(),
      "search[value]": search,
      "search[regex]": false,
    };

    headers
      .filter((item: any) => !(item.virtual === true))
      .forEach((header: any, index: number) => {
        listParams[`columns[${index}][data]`] = header.key;
        listParams[`columns[${index}][name]`] = header.key;
        listParams[`columns[${index}][searchable]`] = header.searchable ? "true" : "false";
        listParams[`columns[${index}][orderable]`] = header.sortable ? "true" : "false";
        listParams[`columns[${index}][search][value]`] = search;
        listParams[`columns[${index}][search][regex]`] = "false";
      });

    if (sortBy.length > 0) {
      sortBy.forEach((order: any, index: number) => {
        listParams[`order[${index}][column]`] = headers.findIndex((x: any) => x.key === order.key);
        listParams[`order[${index}][dir]`] = order.dir;
      });
    }

    const _listParams = { ...listParams, ...extra };
    const cleanAxios = axios.create();
    return new Promise((resolve, reject) => {
      const client = apikey ? cleanAxios : axios;

      const headersConfig = apikey
        ? {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Api-Key ${apikey}`,
          }
        : undefined;

      client
        .get(`${endpoint}/?format=datatables`, {
          params: _listParams,
          headers: headersConfig,
        })
        .then((resp: any) => {
          resolve({
            items: resp.data.data,
            total: resp.data.recordsFiltered,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  return {
    getData,
  };
};

export default useDataTable;

import axios from "axios";
import useErrors from "./useErrors";

const useDataTable = (
  id: string,
  headers: any,
  endpoint: string
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
    sortBy: Array<[{ key: "", dir: "asc" }]>,
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

    // Construir los parámetros para las columnas usando los headers
    //headers.filter((item:any) => {!(item.virtual === true)}).forEach((header:any, index:number) => { headers.
    headers.forEach((header:any, index:number) => {
      listParams[`columns[${index}][data]`] = header.key;
      listParams[`columns[${index}][name]`] = header.key;
      //listParams[`columns[${index}][searchable]`] = header.searchable ? "true" : "false";
      //listParams[`columns[${index}][orderable]`] = false;//header.sortable ? "true" : "false";
      //if (header.searchable) {
      //  listParams[`columns[${index}][search][value]`] = search;
      //  listParams[`columns[${index}][search][regex]`] = "false";
      //}
    });

    if(sortBy.length > 0) {
      sortBy.forEach((order:any, index:any) => {
        listParams[`order[0][column]`] = headers.findIndex((x: any) => x.key == order.key);
        listParams[`order[0][dir]`] = order.order;
      });
    }

    const _listParams = { ...listParams, ...extra };
    const txtListParams = new URLSearchParams(_listParams).toString();
    return new Promise((resolve, reject) => {
      let _endpoint = `${endpoint}/?format=datatables&${txtListParams}`
      axios
        .get(_endpoint)
        .then((resp: any) => {
          resolve({
            items: resp.data.data,
            total: resp.data.recordsFiltered,
            endpoint: _endpoint
          });
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };

  return {
    getData,
  };
};

export default useDataTable;

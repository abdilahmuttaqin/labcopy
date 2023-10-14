import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getListLaboratorium,
  deleteLaboratorium,
  searchLaboratorium,
} from "api/laboratorium";
import TableLayout from "components/TableLayout";
import TableLayoutPasienLab from "components/TableLayoutPasienLab";
import LoaderOnLayout from "components/LoaderOnLayout";
import Snackbar from "components/SnackbarMui";
import { getListPasien } from "api/pasien";

const laboratoriumTableHead = [
  {
    id: "status_pasien",
    label: "Status Pasien",
  },
  {
    id: "nama",
    label: "Nama Pasien",
  },
  {
    id: "umur",
    label: "Umur Pasien",
  },
  {
    id: "no_rm",
    label: "No Rekam Medis",
  },
  {
    id: "alamat",
    label: "Alamat",
  },
  {
    id: "tgl_permintaan",
    label: "Prioritas",
  },
  {
    id: "gol_darah",
    label: "Golongan Darah",
  },
  {
    id: "komponen_darah",
    label: "Komponen Darah yang Diminta",
  },
];

const dataLaboratoriumFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      status_pasien: e.status_pasien || "null",
      nama: e.nama || "null",
      umur: e.umur || "null",
      no_rm: e.no_rm || "null",
      alamat: e.alamat || "null",
      tgl: e.tgl_permintaan || "null",
      gol_darah: e.gol_darah || "null",
      komponen_darah: e.komponen_darah || "null",
      id: e.id,
    };
  });
  result.sort((a, b) => parseInt(a.antrian) - parseInt(b.antrian));
  return result;
};

const Laboratorium = () => {
  const [dataPasien, setDataPasien] = useState([]);
  const [dataMetaPasien, setDataMetaPasien] = useState({});
  const [isLoadingDataPasien, setIsLoadingDataPasien] = useState(false);
  const [isUpdatingDataPasien, setIsUpdatingDataPasien] = useState(false);
  const router = useRouter();
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: "",
  });
  const [activeContent, setActiveContent] = useState(1);

  // pasien --general state
  const [dataLaboratorium, setDataLaboratorium] = useState([]);
  const [dataMetaLaboratorium, setDataMetaPermintaanLaboratorium ] = useState({});
  const [dataLaboratoriumPerPage, setDataPerPage] = useState(8);
  const [isLoadingDataLaboratorium, setIsLoadingDataLaboratorium] = useState(false);
  const [isUpdatingDataLaboratorium, setIsUpdatingDataLaboratorium] = useState(false);

  const initDataPasien = async () => {
    try {
      setIsLoadingDataPasien(true);
      const params = {
        per_page: dataPasienPerPage,
      };
      const response = await getListPasien(params);
      const result = dataPasienFormatHandler(response.data.data);
      setDataPasien(result);
      setDataMetaPasien(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataPasien(false);
    }
  };
  
  const initDataLaboratorium = async () => {
    try {
      setIsLoadingDataLaboratorium(true);
      const params = {
        per_page: dataLaboratoriumPerPage,
      };
      const response = await getListLaboratorium(params);
      const result = dataLaboratoriumFormatHandler(response.data.data);
      setDataLaboratorium(result);
      setDataMetaPermintaanLaboratorium(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataLaboratorium(false);
    }
  };
  const updateDataLaboratoriumHandler = async (payload) => {
    try {
      setIsUpdatingDataLaboratorium(true);
      const response = await getListLaboratorium(payload);
      const result = dataLaboratoriumFormatHandler(response.data.data);
      setDataLaboratorium(result);
      setDataMetaPermintaanLaboratorium(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaboratorium(false);
    }
  };
  const deletaDataLaboratoriumHandler = async (payload) => {
    try {
      setIsUpdatingDataLaboratorium(true);
      const response = await deleteLaboratorium({ id: payload });
      setSnackbarState({
        state: true,
        type: "success",
        message: response.data.message,
      });
      updateDataLaboratoriumHandler({ per_page: dataLaboratoriumPerPage });
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaboratorium(false);
    }
  };
  const searchDataLaboratoriumHandler = async (payload) => {
    try {
      setIsUpdatingDataLaboratorium(true);
      const response = await searchLaboratorium({
        search_text: payload.map((e) => e.value),
        search_column: payload.map((e) => e.type),
        per_page: dataLaboratoriumPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataLaboratoriumFormatHandler(response.data.data);
        setDataLaboratorium(result);
        setDataMetaPermintaanLaboratorium(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: "warning",
          message: `${payload} tidak ditemukan`,
        });
        const response = await getListLaboratorium({
          per_page: dataLaboratoriumPerPage,
        });
        const result = dataLaboratoriumFormatHandler(response.data.data);
        setDataLaboratorium(result);
        setDataMetaPermintaanLaboratorium(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaboratorium(false);
    }
  };
  useEffect(() => {
    if (Object.keys(router.query).length !== 0) {
      setActiveContent(parseInt(router.query.active_content));
    }
  }, [router]);

  useEffect(() => {
    initDataLaboratorium();
    initDataPasien();
  }, []);
  return (
    <>
      {isLoadingDataLaboratorium ? (
        <LoaderOnLayout />
      ) : (
        <>
          <TableLayoutPasienLab
            baseRoutePath={`${router.asPath}`}
            title="Tranfusi Darah"
            tableHead={laboratoriumTableHead}
            data={dataLaboratorium}
            meta={dataMetaLaboratorium}
            dataPerPage={dataLaboratoriumPerPage}
            isUpdatingData={isUpdatingDataLaboratorium}
            filterOptions={[
              { label: "Tipe Jaminan", value: "asuransi" },
              { label: "Tanggal", value: "date" },
            ]}
            updateDataPerPage={(e) => {
              setDataPerPage(e.target.value);
              updateDataLaboratoriumHandler({ per_page: e.target.value });
            }}
            updateDataNavigate={(payload) =>
              updateDataLaboratoriumHandler({
                per_page: dataLaboratoriumPerPage,
                cursor: payload,
              })
            }
            refreshData={() =>
              updateDataLaboratoriumHandler({ per_page: dataLaboratoriumPerPage })
            }
            deleteData={deletaDataLaboratoriumHandler}
            searchData={searchDataLaboratoriumHandler}
          />
        </>
      )}
      <Snackbar
        state={snackbarState.state}
        setState={(payload) =>
          setSnackbarState({
            state: payload,
            type: null,
            message: "",
          })
        }
        message={snackbarState.message}
        isSuccessType={snackbarState.type === "success"}
        isErrorType={snackbarState.type === "error"}
        isWarningType={snackbarState.type === "warning"}
      />
    </>
  );
};

export default Laboratorium;
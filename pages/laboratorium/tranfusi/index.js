import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getListTransfusiDarah,
  deleteTransfusiDarah,
  searchTransfusiDarah,
} from "api/laboratorium";
import TableLayout from "components/TableLayout";
import TableLayoutPasienLab from "components/TableLayoutPasienLab";
import LoaderOnLayout from "components/LoaderOnLayout";
import Snackbar from "components/SnackbarMui";
import { getListPasien } from "api/pasien";

const TransfusiDarahTableHead = [
  {
    id: "nama",
    label: "Nama Pasien",
  },
  {
    id: "status_pasien",
    label: "Status Pasien",
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
    label: "Tanggal Permintaan",
  },
  {
    id: "gol_darah",
    label: "Golongan Darah",
  },
  {
    id: "komponen",
    label: "Komponen Darah yang Diminta",
  },
];

const dataTransfusiDarahFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      status_pasien: e.status_pasien || "null",
      nama: e.nama || "null",
      umur: e.umur || "null",
      no_rm: e.no_rm || "null",
      alamat: e.alamat || "null",
      tgl: e.tgl_permintaan || "null",
      gol_darah: e.gol_darah || "null",
      komponen: e.komponen || "null",
      id: e.id,
    };
  });
  // result.sort((a, b) => parseInt(a.antrian) - parseInt(b.antrian));
  return result;
};

const TransfusiDarah = () => {
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
  const [dataTransfusiDarah, setDataTransfusiDarah] = useState([]);
  const [dataMetaTransfusiDarah, setDataMetaPermintaanTransfusiDarah ] = useState({});
  const [dataTransfusiDarahPerPage, setDataPerPage] = useState(8);
  const [isLoadingDataTransfusiDarah, setIsLoadingDataTransfusiDarah] = useState(false);
  const [isUpdatingDataTransfusiDarah, setIsUpdatingDataTransfusiDarah] = useState(false);

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
  
  const initDataTransfusiDarah = async () => {
    try {
      setIsLoadingDataTransfusiDarah(true);
      const params = {
        per_page: dataTransfusiDarahPerPage,
      };
      const response = await getListTransfusiDarah(params);
      const result = dataTransfusiDarahFormatHandler(response.data.data);
      setDataTransfusiDarah(result);
      setDataMetaPermintaanTransfusiDarah(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataTransfusiDarah(false);
    }
  };
  const updateDataTransfusiDarahHandler = async (payload) => {
    try {
      setIsUpdatingDataTransfusiDarah(true);
      const response = await getListTransfusiDarah(payload);
      const result = dataTransfusiDarahFormatHandler(response.data.data);
      setDataTransfusiDarah(result);
      setDataMetaPermintaanTransfusiDarah(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataTransfusiDarah(false);
    }
  };
  const deletaDataTransfusiDarahHandler = async (payload) => {
    try {
      setIsUpdatingDataTransfusiDarah(true);
      const response = await deleteTransfusiDarah({ id: payload });
      setSnackbarState({
        state: true,
        type: "success",
        message: response.data.message,
      });
      updateDataTransfusiDarahHandler({ per_page: dataTransfusiDarahPerPage });
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataTransfusiDarah(false);
    }
  };
  const searchDataTransfusiDarahHandler = async (payload) => {
    try {
      setIsUpdatingDataTransfusiDarah(true);
      const response = await searchTransfusiDarah({
        search_text: payload.map((e) => e.value),
        search_column: payload.map((e) => e.type),
        per_page: dataTransfusiDarahPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataTransfusiDarahFormatHandler(response.data.data);
        setDataTransfusiDarah(result);
        setDataMetaPermintaanTransfusiDarah(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: "warning",
          message: `${payload} tidak ditemukan`,
        });
        const response = await getListTransfusiDarah({
          per_page: dataTransfusiDarahPerPage,
        });
        const result = dataTransfusiDarahFormatHandler(response.data.data);
        setDataTransfusiDarah(result);
        setDataMetaPermintaanTransfusiDarah(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataTransfusiDarah(false);
    }
  };
  useEffect(() => {
    if (Object.keys(router.query).length !== 0) {
      setActiveContent(parseInt(router.query.active_content));
    }
  }, [router]);

  useEffect(() => {
    initDataTransfusiDarah();
    initDataPasien();
  }, []);
  return (
    <>
      {isLoadingDataTransfusiDarah ? (
        <LoaderOnLayout />
      ) : (
        <>
          <TableLayoutPasienLab
            baseRoutePath={`${router.asPath}`}
            title="Tranfusi Darah"
            tableHead={TransfusiDarahTableHead}
            data={dataTransfusiDarah}
            meta={dataMetaTransfusiDarah}
            dataPerPage={dataTransfusiDarahPerPage}
            isUpdatingData={isUpdatingDataTransfusiDarah}
            filterOptions={[
              { label: "Tipe Jaminan", value: "asuransi" },
              { label: "Tanggal", value: "date" },
            ]}
            updateDataPerPage={(e) => {
              setDataPerPage(e.target.value);
              updateDataTransfusiDarahHandler({ per_page: e.target.value });
            }}
            updateDataNavigate={(payload) =>
              updateDataTransfusiDarahHandler({
                per_page: dataTransfusiDarahPerPage,
                cursor: payload,
              })
            }
            refreshData={() =>
              updateDataTransfusiDarahHandler({ per_page: dataTransfusiDarahPerPage })
            }
            deleteData={deletaDataTransfusiDarahHandler}
            searchData={searchDataTransfusiDarahHandler}
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

export default TransfusiDarah;
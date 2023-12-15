import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getListRiwayatPemeriksaanLaboratorium,
  deleteLaboratorium,
  searchLaboratorium,
} from "api/laboratorium";
import TableLayout from "components/TableLayout";
import TableLayoutPasienLab from "components/TableLayoutPasienLab";
import TableLayoutPermintaanLab from "components/TableLayoutPermintaanLab";
import LoaderOnLayout from "components/LoaderOnLayout";
import Snackbar from "components/SnackbarMui";
import DialogProfile from "components/DialogProfile";
import DialogPermintaanLab from "./dialogPermintaanLab";

const laboratoriumTableHead = [

  {
    id: "tgl_pemeriksaan",
    label: "Tgl Pemeriksaan",
  },
  {
    id: "nama_pemeriksaan",
    label: "Nama Pemeriksaan",
  },
  {
    id: "hasil",
    label: "Hasil Pemeriksaan",
  },
];

const dataLaboratoriumFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      tgl_pemeriksaan: e.tgl_pemeriksaan || "null",
      nama_pemeriksaan: e.nama_pemeriksaan || "null",
      hasil: e.hasil || "null",
      id: e.id,
    };
  });
  result.sort((a, b) => parseInt(a.antrian) - parseInt(b.antrian));
  return result;
};

const RiwayatLaboratorium = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [dataPasien, setDataPasien] = useState([]);
  const [dataMetaPasien, setDataMetaPasien] = useState({});
  const [isLoadingDataPasien, setIsLoadingDataPasien] = useState(false);
  const [isUpdatingDataPasien, setIsUpdatingDataPasien] = useState(false);

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
      const response = await getListRiwayatPemeriksaanLaboratorium(params);
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
      const response = await getListRiwayatPemeriksaanLaboratorium({id:slug[0]});
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
      const response = await getListRiwayatPemeriksaanLaboratorium(payload);
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
        const response = await getListRiwayatPemeriksaanLaboratorium({
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
  const [dialogProfile, setDialogProfile] = useState(false);
  const cekbroo = () => {
    setDialogProfile(true)
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

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getListRiwayatPemeriksaanLaboratorium({ id: slug[0] });
          const data = response.data.data;
          const formattedData = dataFormatter(data);
          setDataPasien(formattedData);
          setDetailDataPasien(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingDataPasien(false);
        }
      })();
    }
  }, [router.isReady, slug]);
  
  return (
    <>
      {isLoadingDataLaboratorium ? (
        <LoaderOnLayout />
      ) : (
        <>
          <TableLayoutPermintaanLab
            baseRoutePath={`${router.asPath}`}
            tableHead={laboratoriumTableHead}
            data={dataLaboratorium}
            meta={dataMetaLaboratorium}
            dataPerPage={dataLaboratoriumPerPage}
            isUpdatingData={isUpdatingDataLaboratorium}
            title="Daftar Riwayat Pemeriksaan"
            filterOptions={[
              { label: "Tipe Jaminan", value: "asuransi" },
              { label: "Pelayanan", value: "poli" },
              { label: "Prioritas", value: "prioritas" },
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
            doubleClickHandler={cekbroo}
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
      <DialogPermintaanLab state={dialogProfile} setState={setDialogProfile} />
    </>
  );
};

export default RiwayatLaboratorium;
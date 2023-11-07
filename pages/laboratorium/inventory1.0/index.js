import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getListPermintaanBarangLab, deletePermintaanBarangLab, searchPermintaanBarangLab } from "api/laboratorium";
import Spinner from "components/SpinnerMui";
import Snackbar from "components/SnackbarMui";
import { formatReadable } from "utils/formatTime";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import TableLayoutPermintaanLab from "components/TableLayoutPermintaanLab";

const PermintaanLabTableHead = [
  {
    id: 'tanggal_permintaan',
    label: 'Tanggal Permintaan',
  },
];

const dataPermintaanLabFormatHandler = (payload) => {
    const result = payload.map((e) => {
        return {
          tanggal_permintaan: e.tanggal_permintaan || 'null',
          id: e.id,
        };
    });
   
    return result;
};

const PermintaanLab = () => {
    const router = useRouter();
    const [dataPermintaanLab, setDataPermintaanLab] = useState([]);
    const [dataMetaPermintaanLab, setDataMetaPermintaanLab] = useState({});
    const [dataPermintaanLabPerPage, setDataPerPage] = useState(8);
    const [isLoadingDataPermintaanLab, setIsLoadingDataPermintaanLab] = useState(false);
    const [isUpdatingDataPermintaanLab, setIsUpdatingDataPermintaanLab] = useState(false);
    const [snackbarState, setSnackbarState] = useState({
      state: false,
      type: null,
      message: "",
    });
  
    const initDataPermintaanLab = async () => {
      try {
        setIsLoadingDataPermintaanLab(true);
        const params = {
          per_page: dataPermintaanLabPerPage,
        };
        const response = await getListPermintaanBarangLab(params);
        const result = dataPermintaanLabFormatHandler(response.data.data);
        setDataPermintaanLab(result);
        setDataMetaPermintaanLab(response.data.meta);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingDataPermintaanLab(false);
      }
    };
  
    const updateDataPermintaanLabHandler = async (payload) => {
      try {
        setIsUpdatingDataPermintaanLab(true);
        const response = await getListPermintaanBarangLab(payload);
        const result = dataPermintaanLabFormatHandler(response.data.data);
        setDataPermintaanLab(result);
        setDataMetaPermintaanLab(response.data.meta);
      } catch (error) {
        console.log(error);
        setSnackbarState({
          state: true,
          type: "error",
          message: error.message,
        });
      } finally {
        setIsUpdatingDataPermintaanLab(false);
      }
    };
  
    const deletaDataPermintaanLabHandler = async (payload) => {
      try {
        setIsUpdatingDataPermintaanLab(true);
        const response = await deletePermintaanBarangLab({ id: payload });
        setSnackbarState({
          state: true,
          type: "success",
          message: response.data.message,
        });
        updateDataPermintaanLabHandler({ per_page: dataPermintaanLabPerPage });
      } catch (error) {
        setSnackbarState({
          state: true,
          type: "error",
          message: error.message,
        });
      } finally {
        setIsUpdatingDataPermintaanLab(false);
      }
    };
  
    const searchDataPermintaanLabHandler = async (payload) => {
      try {
        setIsUpdatingDataPermintaanLab(true);
        const response = await searchPermintaanBarangLab({
          search: payload,
          per_page: dataPermintaanLabPerPage,
        });
        if (response.data.data.length !== 0) {
          const result = dataPermintaanLabFormatHandler(response.data.data);
          setDataPermintaanLab(result);
          setDataMetaPermintaanLab(response.data.meta);
        } else {
          setSnackbarState({
            state: true,
            type: "warning",
            message: `${payload} tidak ditemukan`,
          });
          const response = await getListPermintaanBarangLab({
            per_page: dataPermintaanLabPerPage,
          });
          const result = dataPermintaanLabFormatHandler(response.data.data);
          setDataPermintaanLab(result);
          setDataMetaPermintaanLab(response.data.meta);
        }
      } catch (error) {
        setSnackbarState({
          state: true,
          type: "error",
          message: error.message,
        });
      } finally {
        setIsUpdatingDataPermintaanLab(false);
      }
    };
  
    useEffect(() => {
      initDataPermintaanLab();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return (
      <>
        {isLoadingDataPermintaanLab ? (
          <div className="flex justify-center items-center flex--fill-height-with-header">
            <Spinner />
          </div>
        ) : (
          <TableLayoutPermintaanLab
            baseRoutePath={`${router.asPath}`}
            title="Permintaan"
            tableHead={PermintaanLabTableHead}
            data={dataPermintaanLab}
            meta={dataMetaPermintaanLab}
            dataPerPage={dataPermintaanLabPerPage}
            isUpdatingData={isUpdatingDataPermintaanLab}
            updateDataPerPage={(e) => {
              setDataPerPage(e.target.value);
              updateDataPermintaanLabHandler({ per_page: e.target.value });
            }}
            updateDataNavigate={(payload) =>
              updateDataPermintaanLabHandler({
                per_page: dataPermintaanLabPerPage,
                cursor: payload,
              })
            }
            refreshData={() =>
              updateDataPermintaanLabHandler({ per_page: dataPermintaanLabPerPage })
            }
            deleteData={deletaDataPermintaanLabHandler}
            searchData={searchDataPermintaanLabHandler}
          />
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
export default PermintaanLab;
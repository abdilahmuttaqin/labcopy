import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getListinventoryLaboratorium, deleteInventoryLab, searchInventoryLab } from "api/laboratorium";
import TableLayout from "components/TableLayout";
import Spinner from "components/SpinnerMui";
import Snackbar from "components/SnackbarMui";
import { formatReadable } from "utils/formatTime";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import TableLayoutV4 from "components/TableLayoutV4";

const InventoryLabTableHead = [
    {
        id: "nama_barang",
        label: "Nama barang",
    },
    {
        id: "jumlah_barang",
        label: "Jumlah Barang",
    },
];

const dataInventoryLabFormatHandler = (payload) => {
    const result = payload.map((e) => {
        return {
            nama_barang: e.nama_barang || "null",
            jumlah_barang: e.jumlah_barang || "null",
            id: e.id,
        };
    });
   
    return result;
};

const InventoryLab = () => {
    const router = useRouter();
    const [dataInventoryLab, setDataInventoryLab] = useState([]);
    const [dataMetaInventoryLab, setDataMetaInventoryLab] = useState({});
    const [dataInventoryLabPerPage, setDataPerPage] = useState(8);
    const [isLoadingDataInventoryLab, setIsLoadingDataInventoryLab] = useState(false);
    const [isUpdatingDataInventoryLab, setIsUpdatingDataInventoryLab] = useState(false);
    const [snackbarState, setSnackbarState] = useState({
      state: false,
      type: null,
      message: "",
    });
  
    const initDataInventoryLab = async () => {
      try {
        setIsLoadingDataInventoryLab(true);
        const params = {
          per_page: dataInventoryLabPerPage,
        };
        const response = await getListinventoryLaboratorium(params);
        const result = dataInventoryLabFormatHandler(response.data.data);
        setDataInventoryLab(result);
        setDataMetaInventoryLab(response.data.meta);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingDataInventoryLab(false);
      }
    };
  
    const updateDataInventoryLabHandler = async (payload) => {
      try {
        setIsUpdatingDataInventoryLab(true);
        const response = await getListinventoryLaboratorium(payload);
        const result = dataInventoryLabFormatHandler(response.data.data);
        setDataInventoryLab(result);
        setDataMetaInventoryLab(response.data.meta);
      } catch (error) {
        console.log(error);
        setSnackbarState({
          state: true,
          type: "error",
          message: error.message,
        });
      } finally {
        setIsUpdatingDataInventoryLab(false);
      }
    };
  
    const deletaDataInventoryLabHandler = async (payload) => {
      try {
        setIsUpdatingDataInventoryLab(true);
        const response = await deleteInventoryLab({ id: payload });
        setSnackbarState({
          state: true,
          type: "success",
          message: response.data.message,
        });
        updateDataInventoryLabHandler({ per_page: dataInventoryLabPerPage });
      } catch (error) {
        setSnackbarState({
          state: true,
          type: "error",
          message: error.message,
        });
      } finally {
        setIsUpdatingDataInventoryLab(false);
      }
    };
  
    const searchDataInventoryLabHandler = async (payload) => {
      try {
        setIsUpdatingDataInventoryLab(true);
        const response = await searchInventoryLab({
          search: payload,
          per_page: dataInventoryLabPerPage,
        });
        if (response.data.data.length !== 0) {
          const result = dataInventoryLabFormatHandler(response.data.data);
          setDataInventoryLab(result);
          setDataMetaInventoryLab(response.data.meta);
        } else {
          setSnackbarState({
            state: true,
            type: "warning",
            message: `${payload} tidak ditemukan`,
          });
          const response = await getListinventoryLaboratorium({
            per_page: dataInventoryLabPerPage,
          });
          const result = dataInventoryLabFormatHandler(response.data.data);
          setDataInventoryLab(result);
          setDataMetaInventoryLab(response.data.meta);
        }
      } catch (error) {
        setSnackbarState({
          state: true,
          type: "error",
          message: error.message,
        });
      } finally {
        setIsUpdatingDataInventoryLab(false);
      }
    };
  
    useEffect(() => {
      initDataInventoryLab();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return (
      <>
        {isLoadingDataInventoryLab ? (
          <div className="flex justify-center items-center flex--fill-height-with-header">
            <Spinner />
          </div>
        ) : (
          <TableLayoutV4
            baseRoutePath={`${router.asPath}`}
            title="Inventory Lab"
            tableHead={InventoryLabTableHead}
            data={dataInventoryLab}
            meta={dataMetaInventoryLab}
            dataPerPage={dataInventoryLabPerPage}
            isUpdatingData={isUpdatingDataInventoryLab}
            updateDataPerPage={(e) => {
              setDataPerPage(e.target.value);
              updateDataInventoryLabHandler({ per_page: e.target.value });
            }}
            updateDataNavigate={(payload) =>
              updateDataInventoryLabHandler({
                per_page: dataInventoryLabPerPage,
                cursor: payload,
              })
            }
            refreshData={() =>
              updateDataInventoryLabHandler({ per_page: dataInventoryLabPerPage })
            }
            deleteData={deletaDataInventoryLabHandler}
            searchData={searchDataInventoryLabHandler}
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
export default InventoryLab;
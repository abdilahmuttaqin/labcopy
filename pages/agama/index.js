import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getListAgama, deleteAgama } from "api/agama";
import TableLayout from "components/TableLayout";
import Spinner from "components/SpinnerMui";
import Snackbar from "components/SnackbarMui";

const tableHead = [
  {
    id: "name",
    label: "Nama",
  },
];

const dataFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      name: e.name,
      id: e.id,
    };
  });
  return result;
};

const Agama = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [dataMeta, setDataMeta] = useState({});
  const [dataPerPage, setDataPerPage] = useState(8);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isUpdatingData, setIsUpdatingData] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: "",
  });

  const initData = async () => {
    try {
      setIsLoadingData(true);
      const params = {
        per_page: dataPerPage,
      };
      const response = await getListAgama(params);
      const result = dataFormatHandler(response.data.data);
      setData(result);
      setDataMeta(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const updateDataHandler = async (payload) => {
    try {
      setIsUpdatingData(true);
      const response = await getListAgama(payload);
      const result = dataFormatHandler(response.data.data);
      setData(result);
      setDataMeta(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingData(false);
    }
  };

  const deletaDataHandler = async (payload) => {
    try {
      setIsUpdatingData(true);
      const response = await deleteAgama({ id: payload });
      setSnackbarState({
        state: true,
        type: "success",
        message: response.data.message,
      });
      updateDataHandler({ per_page: dataPerPage });
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingData(false);
    }
  };

  useEffect(() => {
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingData ? (
        <div className="flex justify-center items-center flex--fill-height-with-header">
          <Spinner />
        </div>
      ) : (
        <TableLayout
          isSearchAvailable={false}
          baseRoutePath={`${router.asPath}`}
          title="Agama"
          tableHead={tableHead}
          data={data}
          meta={dataMeta}
          dataPerPage={dataPerPage}
          isUpdatingData={isUpdatingData}
          updateDataPerPage={(e) => {
            setDataPerPage(e.target.value);
            updateDataHandler({ per_page: e.target.value });
          }}
          updateDataNavigate={(payload) =>
            updateDataHandler({
              per_page: dataPerPage,
              cursor: payload,
            })
          }
          refreshData={() => updateDataHandler({ per_page: dataPerPage })}
          deleteData={deletaDataHandler}
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

export default Agama;

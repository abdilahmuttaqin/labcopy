import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { 
  getDetailTranfusiDarah, 
  updateTranfusiDarah 
} from "api/laboratorium";
import { getDetailPasien } from "api/pasien";
import Tabs from "@mui/material/Tabs";
import useClientPermission from "custom-hooks/useClientPermission";
import { formatLabelDate } from "utils/formatTime";
import { Grid, Card, Avatar, Dialog } from "@mui/material";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import LoaderOnLayout from "components/LoaderOnLayout";
import { formatGenToIso } from "utils/formatTime";
import getStaticData from "utils/getStaticData";
import FormTranfusi from "components/modules/laboratorium/formTranfusiDarah";

const Detail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [dataTransfusiDarah, setDataTransfusiDarah] = useState({});
  const [detailDataTranfusiDarah, setDetailDataTranfusiDarah] = useState({});
  const [isLoadingDataTransfusiDarah, setIsLoadingDataTransfusiDarah] = useState(true);

  const dataFormatter = (data) => {
    let tempData = {
      status: data.pasien.status || "",
      pmi_rujukan: data.pmi_rujukan || "",
      alamat: data.pasien.alamat_domisili || "",
      tgl_permintaan: formatGenToIso(data.tgl_permintaan) || null,
      gol_darah: getStaticData("golDarah", data.gol_darah || ""),
      rh: getStaticData("rh", data.rh || false),
      komponen: data.komponen || "",
      jumlah: data.jumlah || "",
      cara_bayar: getStaticData("cara_bayar", data.cara_bayar || ""),
      keterangan: data.keterangan || "",
    };
    return { ...tempData };
  };

  const updateData = (data) => {
    setDetailDataTranfusiDarah(data);
    setDataTransfusiDarah(() => dataFormatter(data));
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await updateTranfusiDarah({ id: slug[0] });
          const data = response.data.data;
          const formattedData = dataFormatter(data);
          setDataTransfusiDarah(formattedData);
          setDetailDataTranfusiDarah(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingDataTransfusiDarah(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataTransfusiDarah ? (
        <LoaderOnLayout />
      ) : (
        <>
          <h2 className="color-grey-text mt-0">Detail Transfusi</h2>
          <FormTranfusi
            isEditType
            prePopulatedDataForm={dataTransfusiDarah}
            detailPrePopulatedData={detailDataTranfusiDarah}
            updatePrePopulatedData={updateData}
          />
        </>
      )}
    </>
  );
};

export default Detail;

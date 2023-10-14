import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoaderOnLayout from "components/LoaderOnLayout";
import FormPermintaanLab from "components/modules/laboratorium/formPermintaanLab";
import { formatGenToIso } from "utils/formatTime";
import getStaticData from "utils/getStaticData";
import { getDetailPermintaanLab } from "api/radiologi";

const DetailPermintaanLab = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [dataPermintaanLab, setDataPermintaanLab] = useState({});
  const [detailDataPermintaanLab, setDetailDataPermintaanLab] = useState({});
  const [isLoadingDataPermintaanLab, setIsLoadingDataPermintaanLab] = useState(true);

  const dataFormatter = (data) => {
    let tempData = {
      nama_barang: data.nama_barang || "",
      jumlah_barang: data.jumlah_barang || "",
      tgl_permintaan: formatGenToIso(data.tgl_permintaan),
    };
    return { ...tempData };
  };

  const updateData = (data) => {
    setDetailDataPermintaanLab(data);
    setDataPermintaanLab(() => dataFormatter(data));
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailPermintaanLab({ id: slug[0] });
          const data = response.data.data;
          const formattedData = dataFormatter(data);
          setDataPermintaanLab(formattedData);
          setDetailDataPermintaanLab(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingDataPermintaanLab(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataPermintaanLab ? (
        <LoaderOnLayout />
      ) : (
        <>
          <h2 className="color-grey-text mt-0">Detail Permintaan Lab</h2>
          <FormPermintaanLab
            isEditType
            prePopulatedDataForm={dataPermintaanLab}
            detailPrePopulatedData={detailDataPermintaanLab}
            updatePrePopulatedData={updateData}
          />
        </>
      )}
    </>
  );
};

export default DetailPermintaanLab;

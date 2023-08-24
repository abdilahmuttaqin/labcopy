import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoaderOnLayout from "components/LoaderOnLayout";
import FormBMHPRadiologi from "components/modules/radiologi/formBMHPRadiologi";
import { formatGenToIso } from "utils/formatTime";
import getStaticData from "utils/getStaticData";

const DetailBMHPRadiologi = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [dataBMHPRadiologi, setDataBMHPRadiologi] = useState({});
  const [detailDataBMHPRadiologi, setDetailDataBMHPRadiologi] = useState({});
  const [isLoadingDataBMHPRadiologi, setIsLoadingDataBMHPRadiologi] = useState(true);

  const dataFormatter = (data) => {
    let tempData = {
      namaBarang: data.namaBarang || "",
      jumlahBarang: data.jumlahBarang || "",
      waktuPemakaian: data.waktuPemakaian || "",
    };
    return { ...tempData };
  };

  const updateData = (data) => {
    setDetailDataBMHPRadiologi(data);
    setDataBMHPRadiologi(() => dataFormatter(data));
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailBMHPRadiologi({ id: slug[0] });
          const data = response.data.data;
          const formattedData = dataFormatter(data);
          setDataBMHPRadiologi(formattedData);
          setDetailDataBMHPRadiologi(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingDataBMHPRadiologi(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataBMHPRadiologi ? (
        <LoaderOnLayout />
      ) : (
        <>
          <h2 className="color-grey-text mt-0">Detail BMHP Radiologi</h2>
          <FormBMHPRadiologi
            isEditType
            prePopulatedDataForm={dataBMHPRadiologi}
            detailPrePopulatedData={detailDataBMHPRadiologi}
            updatePrePopulatedData={updateData}
          />
        </>
      )}
    </>
  );
};

export default DetailBMHPRadiologi;

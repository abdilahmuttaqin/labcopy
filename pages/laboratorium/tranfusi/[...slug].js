import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getDetailPasien } from "api/pasien";
import {
  getDetailAsesmenPasienLaboratorium,
  getDetailAsesmenPemeriksaanLaboratorium,
  getDetailGroupingPemeriksaanLaboratorium,
  getDetailPermintaanPemeriksaanLaboratorium,
  getDetailTransfusiDarah,
  getListLaboratorium,
  getListTransfusiDarah,
  updateTranfusiDarah
} from "api/laboratorium";
import LoaderOnLayout from "components/LoaderOnLayout";
import { formatGenToIso } from "utils/formatTime";
import getStaticData from "utils/getStaticData";
import Tabs from "@mui/material/Tabs";
import useClientPermission from "custom-hooks/useClientPermission";
import { formatLabelDate } from "utils/formatTime";
import { Grid, Card, Avatar, Dialog } from "@mui/material";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import FormTranfusi from "components/modules/laboratorium/formTranfusiDarah";


const DetailLaboratorium = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [detailDataTranfusi, setDetailDataTranfusi] = useState({});
  const [dataPasien, setDataPasien] = useState({});
  const [detailDataPasien, setDetailDataPasien] = useState({});
  const [isLoadingDataPasien, setIsLoadingDataPasien] = useState(true);

  const [dataPermintaanLaboratoriumPerPage, setPermintaanLaboratriumPerPage] =
    useState(8);
  const [
    isLoadingDataPermintaanLaboratorium,
    setIsLoadingDataPermintaanLaboratorium,
  ] = useState(false);
  const [
    isUpdatingDataPermintaanLaboratorium,
    setIsUpdatingDataPermintaanLaboratorium,
  ] = useState(false);

  const [menuState, setMenuState] = useState(null);
  const { isActionPermitted } = useClientPermission();
  const openMenuPopover = Boolean(menuState);
  const menuPopover = menuState ? "menu-popover" : undefined;
  const [dialogProfileState, setDialogProfileState] = useState(false);
  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };

  const initDataPermintaanLaboratorium = async () => {
    try {
      setIsLoadingDataPermintaanLaboratorium(true);
      const params = {
        per_page: dataPermintaanLaboratoriumPerPage,
      };
      const response = await getListTransfusiDarah(params);
      const result = dataFormatterTranfusi(response.data.data);
      setDataPermintaanLaboratorium(result);
      setDataMetaPermintaanLaboratorium(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataPermintaanLaboratorium(false);
    }
  };

  const updateDataRoleHandler = async (payload) => {
    try {
      setIsUpdatingDataPermintaanLaboratorium(true);
      const response = await getListEmployee(payload);
      const result = dataFormatterTranfusi(response.data.data);
      setDataPermintaanLaboratorium(result);
      setDataMetaPermintaanLaboratorium(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPermintaanLaboratorium(false);
    }
  };

  const [dataPermintaanLaboratorium, setDataPermintaanLaboratorium] = useState({});
  const [detailDataPermintaanLaboratrium, setDetailDataPermintaanLaboratrium] =
    useState({});
  const [dataMetaPermintaanLaboratorium, setDataMetaPermintaanLaboratorium] =
    useState({});
  const [dataLaboratrium, setDataLaboratrium] = useState({});
  const [detailDataAntrianLaboratorium, setDetailDataAntrianLaboratorium] = useState(
    {}
  );
  const [isLoadingDataLaboratrium, setIsLoadingDataLaboratrium] = useState(true);

  const [detailAssPas, setDataAssPas] = useState({});
  const [detailAssPem, setDataAssPem] = useState({});

  const dataFormatterPasien = (data) => {
    let tempData = {
      nama_pasien: data.nama_pasien || "",
      jenis_kelamin:
        data.jenis_kelamin !== null && data.jenis_kelamin !== undefined
          ? data.jenis_kelamin
          : "",
      tempat_lahir: data.tempat_lahir || "",
      tanggal_lahir: formatGenToIso(data.tanggal_lahir) || null,
      kewarganegaraan: getStaticData("countries", data.kewarganegaraan || ""),
      showNik: false,
      no_passport: data.no_passport || "",
      nik: data.nik || "",
      alamat_domisili: data.alamat_domisili || "",
      provinsi_domisili: data.provinsi_domisili || { kode: "", nama: "" },
      kabupaten_domisili: data.kabupaten_domisili || { kode: "", nama: "" },
      kecamatan_domisili: data.kecamatan_domisili || { kode: "", nama: "" },
      kelurahan_domisili: data.kelurahan_domisili || { kode: "", nama: "" },
      rt_domisili: data.rt_domisili || "",
      rw_domisili: data.rw_domisili || "",
      kode_pos_domisili: (data.kode_pos_domisili || "") + "",
      alamat_ktp: data.alamat_ktp || { kode: "", nama: "" },
      provinsi_ktp: data.provinsi_ktp || { kode: "", nama: "" },
      kabupaten_ktp: data.kabupaten_ktp || { kode: "", nama: "" },
      kecamatan_ktp: data.kecamatan_ktp || { kode: "", nama: "" },
      kelurahan_ktp: data.kelurahan_ktp || { kode: "", nama: "" },
      rt_ktp: data.rt_ktp || "",
      rw_ktp: data.rw_ktp || "",
      kode_pos_ktp: (data.kode_pos_ktp || "") + "",
      telepon: data.telepon || "",
      nowa: data.nowa || "",
      status: getStaticData("maritalStatusDeep", data.status || ""),
      agama: data.agama || { id: "", name: "" },
      pendidikan: data.pendidikan || { id: "", name: "" },
      pekerjaan: data.pekerjaan || { id: "", name: "" },
      nama_ibu: data.nama_ibu || "",
      asuransi: data.asuransi || { id: "", name: "" },
      suku: data.suku || { id: "", name: "" },
      bahasa: data.bahasa || { id: "", name: "" },
      permintaan: [],
      riwayat: [],
    };
    if (tempData.kewarganegaraan.label === "Indonesia") {
      tempData.showNik = true;
    }
    return { ...tempData };
  };

  const dataFormatterTranfusi = (data) =>{
    let tempData = {
    status_pasien: data.status_pasien || "",
    pmi_rujukan: data.pmi_rujukan || "",
    alamat: data.alamat || "",
    tgl_permintaan: formatGenToIso(data.tgl_permintaan) || null,
    gol_darah: data.gol_darah.value || "",
    rh: data.rh || "",
    komponen_yang_diminta: data.komponen_yang_diminta || "",
    jumlah_yang_diminta: data.jumlah_yang_diminta || "",
    cara_pembayaran: data.cara_pembayaran || "",
    keterangan: data.keterangan || "",
    };
    return { ...tempData};
  };

  const updateData = (data) => {
    setDetailDataTranfusi(data);
    setDataLaboratrium(() => dataFormatter(data));
    setDataPasienTranfusi(() => dataFormatterTranfusi(data))
  };

  useEffect(() => {
    initDataPermintaanLaboratorium();
    if (router.isReady) {
      (async () => {
        try {
          const responseAntriandetail = await getDetailTransfusiDarah({ id: slug[0] });
          const dataAntriandetail = responseAntriandetail.data.data;
          setDetailDataAntrianLaboratorium(dataAntriandetail);
          const noAntrian = dataAntriandetail.no_antrian;
          const idPasien = dataAntriandetail.pasien_id;
          // initDataPermintaanLaboratorium();

          const responsePasien = await getDetailPasien({ id: idPasien });
          const dataPasien = responsePasien.data.data;
          const formattedDataPasien = dataFormatterPasien(dataPasien);
          setDataPasien(formattedDataPasien);
          setDetailDataPasien(dataPasien);

          const responseTranfusi = await updateTranfusiDarah({ id: slug[0]});
          const data = respone.data.data;
          const formattedData = dataFormatterTranfusi(data);
          setDataPasienTranfusi(formattedData);
          setDetailDataTranfusi(data)

        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingDataPasien(false);
          setIsLoadingDataPermintaanLaboratorium(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataPasien ? (
        <LoaderOnLayout />
      ) : (  
        <>
          <Grid container spacing={2}>
            <Grid item md={6} sm={12}>
              <Card className="px-14 py-12 mb-0">
                <div className="flex justify-between items-center mb-16">
                  <div className="flex items-center">
                    <PermContactCalendarIcon
                      fontSize="small"
                      style={{ color: "rgb(99, 115, 129)" }}
                    />
                    <p className="m-0 ml-8 font-14">Pasien Info</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <Avatar
                      src={detailDataPasien?.picture}
                      variant="rounded"
                      sx={{ width: 120, height: 120 }}
                    />
                    <div className="ml-8 mt-8">
                      <div className="font-w-700">
                        {dataPasien?.nama_pasien}
                      </div>
                      <div>
                        {detailDataPasien?.tanggal_lahir
                          ? formatLabelDate(detailDataPasien.tanggal_lahir)
                          : ""}{" "}
                        / {detailDataPasien?.umur} tahun
                      </div>
                      <div>
                        {detailDataPasien?.jenis_kelamin
                          ? "Laki-laki"
                          : "Perempuan"}{" "}
                        / {detailDataPasien?.status}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div>NO REKAM MEDIS</div>
                    <div
                      className="font-28 font-w-700"
                      style={{ textAlign: "right" }}
                    >
                      {detailDataPasien?.no_rm}
                    </div>
                  </div>
                </div>
              </Card>
            </Grid>
          </Grid>
          
          <Tabs
            onChange={(event, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Sub-menu"
            sx={{ marginBottom: "-18px" }} // Add spacing below the tabs
          >
          </Tabs>
          <h2 className="color-grey-text mt-0">Form Tranfusi Darah</h2>
          <Card sx={{
            border: "0px solid #e0e0e0",
            borderTop: "0px",
            borderRadius: "0px"}}>
          
          <FormTranfusi
            isEditType
            prePopulatedDataForm={dataPasien}
            detailPrePopulatedData={detailDataTranfusi}
            updatePrePopulatedData={updateData}
            />

          </Card>
        </>
      )}
      
    </>
  );
};

export default DetailLaboratorium;

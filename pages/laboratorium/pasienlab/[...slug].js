import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getDetailPasien } from "api/pasien";
import {
  getDetailAsesmenPasienLaboratorium,
  getDetailAsesmenPemeriksaanLaboratorium,
  getDetailGroupingPemeriksaanLaboratorium,
  getDetailPermintaanPemeriksaanLaboratorium,
  getDetailLaboratorium,
} from "api/laboratorium";
import LoaderOnLayout from "components/LoaderOnLayout";
import FormPasien from "components/modules/pasien/form";
import { formatGenToIso } from "utils/formatTime";
import getStaticData from "utils/getStaticData";
import Popover from "@mui/material/Popover";
import TableLayout from "pages/pasien/TableLayout";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useClientPermission from "custom-hooks/useClientPermission";
import { formatLabelDate } from "utils/formatTime";
import { Grid, Card, IconButton, Tooltip, Avatar, Dialog } from "@mui/material";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import FormExpertise from "components/modules/laboratorium/formExpertise";
import RiwayatPemeriksaanTable from "components/modules/laboratorium/riwayatPemeriksaanTable";
import Assessment from "components/modules/laboratorium/assessment";
import FormHasilPemeriksaan from "components/modules/laboratorium/formHasilPemeriksaan";
import PermintaanLaboratoriumTableLayout from "components/modules/laboratorium/permintaanLaboratoriumTableLayout";

const permintaanTableHead = [
  {
    id: "no_pemeriksaan",
    label: "No. Pemeriksaan",
  },
  {
    id: "waktu_permintaan",
    label: "Waktu Permintaan",
  },
  {
    id: "dokter_pengirim",
    label: "Dokter Pengirim",
  },
  {
    id: "unit",
    label: "Unit Pengirim",
  },
  {
    id: "diagnosis_kerja",
    label: "Diagnosis Kerja",
  },
  {
    id: "catatan_permintaan",
    label: "Catatan Permintaan",
  },
];
const dataPermintaanLaboratoriumFormatHandler = (
  payload,
) => {
  const result = payload.map((e) => {
    return {
      no_pemeriksaan: e.no_pemeriksaan || "null",
      waktu_permintaan_pemeriksaan: e.waktu_permintaan_pemeriksaan || "null",
      dokter_pengirim: e.dokter_pengirim || "null",
      unit_pengirim: e.unit_pengirim || "null",
      diagnosis_kerja: e.diagnosis_kerja || "null",
      catatan_permintaan: e.catatan_permintaan || "null",
      id: e.id,
    };
  });
  return result;
};

const riwayatPemeriksaanTableHead = [
  {
    id: "tanggal_pemeriksaan",
    label: "Tanggal Pemeriksaan",
  },
  {
    id: "no_pemeriksaan",
    label: "No. Pemeriksaan",
  },
  {
    id: "nama_pemeriksaan",
    label: "Nama Pemeriksaan",
  },
  {
    id: "jenis_pemeriksaan",
    label: "Jenis Pemeriksaan",
  },
  {
    id: "dokter_pengirim",
    label: "Dokter Pengirim",
  },
  {
    id: "diagnosis_kerja",
    label: "Diagnosis Kerja",
  },
];

const DetailLaboratorium = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [isEditingMode, setIsEditingMode] = useState(false);
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
      const response = await getListLaboratorium(params);
      const result = dataPermintaanLaboratoriumFormatHandler(response.data.data);
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
      const result = dataPermintaanLaboratoriumFormatHandler(response.data.data);
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
      tarif: data.tarif || "0",
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

  const updateData = (data) => {
    setDetailDataLaboratrium(data);
    setDataLaboratrium(() => dataFormatter(data));
  };

  useEffect(() => {
    initDataPermintaanLaboratorium();
    if (router.isReady) {
      (async () => {
        try {
          const responseAntriandetail = await getDetailLaboratorium({ id: slug[0] });
          const dataAntriandetail = responseAntriandetail.data.data;
          setDetailDataAntrianLaboratorium(dataAntriandetail);
          const noAntrian = dataAntriandetail.no_antrian;
          const idPasien = dataAntriandetail.pasien_id;
          initDataPermintaanLaboratorium();

          const responsePasien = await getDetailPasien({ id: idPasien });
          const dataPasien = responsePasien.data.data;
          const formattedDataPasien = dataFormatterPasien(dataPasien);
          setDataPasien(formattedDataPasien);
          setDetailDataPasien(dataPasien);

          const responsePermintaan =
            await getDetailPermintaanPemeriksaanLaboratorium({
              no_antrian: noAntrian,
            });
          const dataPermintaan = responsePermintaan.data.data;
          setDataPermintaanLaboratorium(dataPermintaan);
          const groupingId =
            dataPermintaan[0].grouping_pemeriksaan_laboratorium_id;
          const permintaanId = dataPermintaan[0].id;

          const responseGrouping = await getDetailGroupingPemeriksaanLaboratorium({
            id: groupingId,
          });
          const dataGrouping = responseGrouping.data.data;
          const namaPemeriksaan = dataGrouping.kategori_pemeriksaan;
          const jenisPemeriksaan = dataGrouping.jenis_pemeriksaan;

          const formattedDataPermintaanLaboratorium =
            dataPermintaanLaboratoriumFormatHandler(
              dataPermintaan,
              namaPemeriksaan,
              jenisPemeriksaan
            );

          setDataPermintaanLaboratorium(formattedDataPermintaanLaboratorium);

          const responseAsesmenPasienLaboratorium =
            await getDetailAsesmenPasienLaboratorium({ no_antrian: noAntrian });
          const dataAssPas = responseAsesmenPasienLaboratorium.data.data;
          setDataAssPas(dataAssPas);

          const responseAsesmenPemeriksaanLaboratorium =
            await getDetailAsesmenPemeriksaanLaboratorium({
              permintaanId: permintaanId,
            });
          const dataAssPem = responseAsesmenPemeriksaanLaboratorium.data.data;
          setDataAssPem(dataAssPem);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingDataPasien(false);
          setIsLoadingDataPermintaanLaboratorium(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  const menuItems = [
    {
      label: "Permintaan Laboratorium",
      component: (
        <>
          <PermintaanLaboratoriumTableLayout
            tableHead={permintaanTableHead}
            data={dataPermintaanLaboratorium}
          ></PermintaanLaboratoriumTableLayout>
        </>
      ),
    },
    {
      label: "Assessment Pemeriksaan",
      component: (
        <Assessment
          namaPemeriksaan={
            dataPermintaanLaboratorium.permintaan?.[0]?.nama_pemeriksaan
          }
          jenisPemeriksaan={
            dataPermintaanLaboratorium.permintaan?.[0]?.jenis_pemeriksaan
          }
        />
      ),
    },
    { label: "Hasil Pemeriksaan", component: <FormHasilPemeriksaan /> },
    { label: "Riwayat Pemeriksaan", component: <RiwayatPemeriksaanTable /> },
  ];

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      {isLoadingDataPasien ? (
        <LoaderOnLayout />
      ) : (  
        <>
          <Grid container spacing={2}>
            <Grid item md={6} sm={12}>
              <Card className="px-14 py-12 mb-16">
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

            {/* Tambahkan tabel di sini */}
            <Grid item md={6} sm={12}>
              <table className="custom-table">
                <thead>
                  <tr>
                  <Card className="px-14 py-12 mb-16">
                <div className="flex justify-between items-center mb-16">
                  <div className="flex items-center">
                    <p className="m-0 ml-8 font-14">Tarif</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-start">
                    <div className="ml-8 mt-">
                      <div className="font-28 font-w-700">
                      <span style={{ fontWeight: 'bold' }}>Rp</span>{detailDataPasien?.pasien}
                        {dataPasien?.tarif}
                      </div>
                      <div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
                  </tr>
                </thead>
              </table>
            </Grid>
          </Grid>
          
          <Tabs
            value={selectedTab}
            onChange={(event, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Sub-menu"
            sx={{ marginBottom: "16px" }} // Add spacing below the tabs
          >
            {menuItems.map((item, index) => (
              <Tab
                key={index}
                label={item.label}
                sx={{
                  borderBottom:
                    selectedTab === index ? "2px solid #3f51b5" : "none",
                  marginRight: "16px", // Add spacing between tabs
                }}
              />
            ))}
          </Tabs>
          <Card
            sx={{
              border: "1px solid #e0e0e0",
              borderTop: "none",
              borderRadius: "0px",
              marginBottom: "16px", // Add spacing below the card
            }}
          >
            {menuItems[selectedTab].component}
          </Card>
        </>
      )}
      
    </>
  );
};

export default DetailLaboratorium;

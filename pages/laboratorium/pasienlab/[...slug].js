import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getDetailPasien } from "api/pasien";
import { getDetailLaboratorium } from "api/laboratorium";
import LoaderOnLayout from "components/LoaderOnLayout";
import { formatGenToIso } from "utils/formatTime";
import getStaticData from "utils/getStaticData";
import { formatLabelDate } from "utils/formatTime";
import { Grid, Card, Avatar } from "@mui/material";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import TriasePasienForm from "components/modules/laboratorium/TriasePasienform";
import FormHasilPemeriksaan from "components/modules/laboratorium/formHasilPemeriksaan";
import Laboratorium from "components/modules/laboratorium/permintaanLaboratoriumTableLayout";
import RiwayatPemeriksaanTable from "components/modules/laboratorium/riwayatPemeriksaanTable";
import AssessmentLaboratorium from "components/modules/laboratorium/assessment";

const Detail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [dataPasien, setDataPasien] = useState({});
  const [detailDataPasien, setDetailDataPasien] = useState({});
  const [isLoadingDataPasien, setIsLoadingDataPasien] = useState(true);
  const [activeContent, setActiveContent] = useState(1);

  const dataFormatter = (data) => {
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
    };
    if (tempData.kewarganegaraan.label === "Indonesia") {
      tempData.showNik = true;
    }
    return { ...tempData };
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailLaboratorium({ id: slug[0] });
          const data = response.data.data.pasien;
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
                    <p className="m-0 ml-8 font-14">Pasien Laboratorium</p>
                  </div>
                  <div className="flex items-center"></div>
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

            <Grid item md={12} sm={12}>
              <div className="tab-list flex">
                <div
                  className={activeContent === 1 ? "pointer active" : "pointer"}
                  onClick={() => setActiveContent(1)}
                >
                  Permintaan Laboratorium
                </div>
                <div
                  className={activeContent === 2 ? "pointer active" : "pointer"}
                  onClick={() => setActiveContent(2)}
                >
                  Assessment Pemeriksaan
                </div>
                <div
                  className={activeContent === 3 ? "pointer active" : "pointer"}
                  onClick={() => setActiveContent(3)}
                >
                  Hasil Pemeriksaan
                </div>
                <div
                  className={activeContent === 4 ? "pointer active" : "pointer"}
                  onClick={() => setActiveContent(4)}
                >
                  Riwayat Pemeriksaan
                </div>
              </div>
            </Grid>
            <Grid item md={12} sm={12}>
              {activeContent === 1 && <Laboratorium/>}
              {activeContent === 2 && <AssessmentLaboratorium/>}
              {activeContent === 3 && <FormHasilPemeriksaan />}
              {activeContent === 4 && <RiwayatPemeriksaanTable/>}
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Detail;
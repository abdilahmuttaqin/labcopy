import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Paper from "@mui/material/Paper";
import { Grid } from "@mui/material";
import FormAssessmentPemeriksaan from "./formAssessmentPemeriksaan";
import FormAssessmentPasien from "./formAssessmentPasien";
// import {
//   getSkriningGizi,
//   getSkriningNyeri,
//   getSkriningLukaDecubitus,
//   getSkriningResikoJatuh,
// } from "api/ugd";
// import SkriningGiziForm from "components/modules/ugd/perawat/skrining-pasien/skriningGiziForm";
// import SkriningNyeriForm from "components/modules/ugd/perawat/skrining-pasien/skriningNyeriForm";
// import SkriningLukaDecubitusForm from "components/modules/ugd/perawat/skrining-pasien/skriningLukaDecubitusForm";
// import SkriningResikoJatuhForm from "components/modules/ugd/perawat/skrining-pasien/skriningResikoJatuhForm";

const menu = [
  {
    name: "Asessment Pemeriksaan",
    value: 0,
  },
  {
    name: "Asessment Pasien",
    value: 1,
  },
];

const skriningGiziFormatter = (payload) => {
  let tempData = {
    id: payload.id,
    tb: payload.tb,
    bb: payload.bb,
    imt: payload.imt,
  };
  return { ...tempData };
};

const skriningNyeriFormatter = (payload) => {
  let tempData = {
    id: payload.id,
    lokasi_nyeri: payload.lokasi_nyeri,
    frekuensi_nyeri: payload.frekuensi_nyeri,
    penyebab_nyeri: payload.penyebab_nyeri,
    durasi_nyeri: payload.durasi_nyeri,
  };
  return { ...tempData };
};


const AssessmentLaboratorium = () => {
  const [activeContent, setActiveContent] = useState(menu[0].value);
  const [skriningGizi, setSkriningGizi] = useState({});
  const [skriningNyeri, setSkriningNyeri] = useState({});

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getSkriningGizi({ medis_id: slug[0] });
          const data = response.data.data;
          if (data.length) {
            const formattedData = skriningGiziFormatter(data[0]);
            setSkriningGizi(formattedData);
          }
          const responseNyeri = await getSkriningNyeri({ medis_id: slug[0] });
          const dataNyeri = responseNyeri.data.data;
          if (dataNyeri.length) {
            const formattedData = skriningNyeriFormatter(dataNyeri[0]);
            setSkriningNyeri(formattedData);
          }
        } catch (error) {
          console.log(error);
        } finally {
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      <Paper sx={{ width: "100%", padding: 0 }}>
        <Grid container spacing={0}>
          <Grid item sm={2}>
            <div className="menu-vertical-container">
              {menu.map((e) => {
                return (
                  <div
                    key={e.value}
                    className={
                      activeContent === e.value ? "pointer active" : "pointer"
                    }
                    onClick={() => setActiveContent(e.value)}
                  >
                    {e.name}
                  </div>
                );
              })}
            </div>
          </Grid>
          <Grid item sm={10}>
            <div
              className="py-12 px-24"
              style={{ borderLeft: "1px solid var(--color-grey-text)" }}
            >
              {activeContent === 0 ? (
                <FormAssessmentPemeriksaan
                  isEditType={!!skriningGizi?.id}
                  prePopulatedDataForm={skriningGizi}
                  updatePrePopulatedData={(payload) => {
                    const formattedData = skriningGiziFormatter(payload);
                    setSkriningGizi(formattedData);
                  }}
                />
              ) : null}
              {activeContent === 1 ? (
                <FormAssessmentPasien
                  isEditType={!!skriningNyeri?.id}
                  prePopulatedDataForm={skriningNyeri}
                  updatePrePopulatedData={(payload) => {
                    const formattedData = skriningNyeriFormatter(payload);
                    setSkriningNyeri(formattedData);
                  }}
                />
                ) : null}

            </div>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default AssessmentLaboratorium;
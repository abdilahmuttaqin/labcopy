import React, { useState, forwardRef, useRef } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { FocusError } from "focus-formik-error";
import * as Yup from "yup";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import PlusIcon from "@material-ui/icons/Add";
import BackIcon from "@material-ui/icons/ArrowBack";
import SaveIcon from "@material-ui/icons/Save";
import Snackbar from "components/SnackbarMui";
import Grid from "@mui/material/Grid";
import SelectAsync from "components/SelectAsync";
import SelectStatic from "components/SelectStatic";
import DatePicker from "components/DatePicker";
import { stringSchema, dateSchema } from "utils/yupSchema";
import { createSuster, updateSuster, getDetailSuster } from "api/suster";
import { getListOptionEmployee } from "api/employee";
import { golDarah } from "public/static/data";
import { rh } from "public/static/data";
import { cara_pembayaran } from "public/static/data";
import { formatIsoToGen } from "utils/formatTime";
import useClientPermission from "custom-hooks/useClientPermission";
import ReactToPrint from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";


const CheckupToPrint = forwardRef(function CheckupToPrint({ data }, ref) {
  return (
    <div ref={ref} className="printableContent">
  <div className="w-full">
    <div className="flex items-center justify-center">
      <img src="/icons/logo.png" alt="logo-rsmp" width={80} height={80} className="w-full" />
      <div>
        <div className="font-w-700">RSU MITRA PARAMEDIKA</div>
        <div className="font-12">
          Jl. Raya Ngemplak, Kemasan, Widodomartani, Ngemplak, Sleman, Yogyakarta
        </div>
        <div className="font-12">Telp: (0274) 4461098. Email: rsumitraparamedika@yahoo.co.id</div>
        <div className="font-12">Website: rsumitraparamedika.co.id</div>
      </div>
      <img src="/icons/kars.jpg" alt="logo-kars" width={80} height={80} className="w-full" />
    </div>
  </div>

  <hr></hr>
  <center><div className="font-w-600">HASIL PEMERIKSAAN LABORATORIUM</div></center>
      <div className="flex p-4" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="column">
          <div>No. Pemeriksaan: {data.no_pemeriksaan || "-"}</div>
          <div>No. RM: {data.no_rm || "-"}</div>
          <div>Nama Pasien: {data.nama_pasien || "-"}</div>
          <div>Tanggal Lahir: {data.tanggal_lahir || "-"}</div>
          <div>Umur: {data.umur || "-"}</div>
        </div>
        <div className="column">
          <div>Tanggal Pemeriksaan: {data.tanggal_pemeriksaan || "-"}</div>
          <div>Diagnosa: {data.diagnosis_kerja || "-"}</div>
          <div>Nama Pemeriksaan: {data.namaPemeriksaan || "-"}</div>
          <div>Jenis Pemeriksaan: {data.jenis_pemeriksaan || "-"}</div>
          <div>Dokter Pengirim: {data.dokter || "-"}</div>
          <div>Pelayanan: {data.poli || "-"}</div>
        </div>
      </div>
      <div>Hasil Expertise: {data.hasil_expertise || "-"}</div>


</div>

  );
});

const FormHasilPemeriksaan = ({
  isEditType = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => "update data",
}) => {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const router = useRouter();
  const { isActionPermitted } = useClientPermission();
  const checkupPrintRef = useRef();
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: "",
  });

  const tranfusiInitialValue = !isEditType
    ? {
        hgb_hasil: "", hgb_nilai_rujukan: "", hgb_satuan: "",
        rbc_hasil: "", rbc_nilai_rujukan: "", rbc_satuan: "",
        hct_hasil: "", hct_nilai_rujukan: "", hct_satuan: "",
        mcv_hasil: "", mcv_nilai_rujukan: "", mcv_satuan: "",
        mch_hasil: "", mch_nilai_rujukan: "", mch_satuan: "",
        mchc_hasil: "", mchc_nilai_rujukan: "", mchc_satuan: "",
        pct_hasil: "", pct_nilai_rujukan: "", pct_satuan: "",
        wbc_hasil: "", wbc_nilai_rujukan: "", wbc_satuan: "",

        limfosit_hasil: "", limfosit_nilai_rujukan: "", limfosit_satuan: "",
        monosit_hasil: "", monosit_nilai_rujukan: "", monosit_satuan: "",
        granulosit_hasil: "", granulosit_nilai_rujukan: "", granulosit_satuan: "",
        tombosit_hasil: "", tombosit_nilai_rujukan: "", tombosit_satuan: "",

        asam_urat_hasil: "", asam_urat_nilai_rujukan: "", asam_urat_satuan: "",

        kolesterol_hasil: "", kolesterol_nilai_rujukan: "", kolesterol_satuan: "",

        glukosa_hasil: "", glukosa_nilai_rujukan: "", glukosa_satuan: "",

        status_pasien: "",
        pmi_rujukan: "",
        alamat:"",
        tgl_permintaan: null,
        gol_darah: { name: "", value: "" },
        rh: { name: "", value: "" },
        komponen_yang_diminta:"",
        jumlah_yang_diminta:"",
        cara_pembayaran: { name: "", value: ""},
        keterangan:""
      }
    : prePopulatedDataForm;

  const tranfusiSchema = Yup.object({
    hgb_hasil: stringSchema("", true), hgb_nilai_rujukan: stringSchema("", true), hgb_satuan: stringSchema("", true),
    rbc_hasil: stringSchema("", true), rbc_nilai_rujukan: stringSchema("", true), rbc_satuan: stringSchema("", true),
    hct_hasil: stringSchema("", true), hct_nilai_rujukan: stringSchema("", true), hct_satuan: stringSchema("", true),
    mcv_hasil: stringSchema("", true), mcv_nilai_rujukan: stringSchema("", true), mcv_satuan: stringSchema("", true),
    mch_hasil: stringSchema("", true), mch_nilai_rujukan: stringSchema("", true), mch_satuan: stringSchema("", true),
    mchc_hasil: stringSchema("", true), mchc_nilai_rujukan: stringSchema("", true), mchc_satuan: stringSchema("", true),
    pct_hasil: stringSchema("", true), pct_nilai_rujukan: stringSchema("", true), pct_satuan: stringSchema("", true),
    wbc_hasil: stringSchema("", true), wbc_nilai_rujukan: stringSchema("", true), wbc_satuan: stringSchema("", true),

    limfosit_hasil: stringSchema("", true), limfosit_nilai_rujukan: stringSchema("", true), limfosit_satuan: stringSchema("", true),
    monosit_hasil: stringSchema("", true), monosit_nilai_rujukan: stringSchema("", true), monosit_satuan: stringSchema("", true),
    granulosit_hasil: stringSchema("", true), granulosit_nilai_rujukan: stringSchema("", true), granulosit_satuan: stringSchema("", true),
    tombosit_hasil: stringSchema("", true), tombosit_nilai_rujukan: stringSchema("", true), tombosit_satuan: stringSchema("", true),

    asam_urat_hasil: stringSchema("", true), asam_urat_nilai_rujukan: stringSchema("", true), asam_urat_satuan: stringSchema("", true),

    kolesterol_hasil: stringSchema("", true), kolesterol_nilai_rujukan: stringSchema("", true), kolesterol_satuan: stringSchema("", true),

    glukosa_hasil: stringSchema("", true), glukosa_nilai_rujukan: stringSchema("", true), glukosa_satuan: stringSchema("", true),

    status_pasien: stringSchema("Status Pasien", true),
    pmi_rujukan: stringSchema("PMI Rujukan", true),
    alamat: stringSchema("PMI Rujukan", true),
    tgl_permintaan: dateSchema("Tanggal Permintaan"),
    gol_darah: Yup.object({
      value: stringSchema("Pilih Golongan Darah", true),
    }),
    rh: Yup.object({
      value: Yup.boolean("Pilih RH").required("RH wajib diisi"),
    }),
    komponen_yang_diminta: stringSchema("Komponen Yang Diminta", true),
    jumlah_yang_diminta: stringSchema("Jumlah Yang Diminta", true),
    cara_pembayaran: Yup.object({
      value: Yup.boolean("Pilih Pembayaran").required("Cara Pembayaran wajib diisi"),
    }),
    keterangan: stringSchema("Keterangan", true)
  });

  const tranfusiValidation = useFormik({
    initialValues: tranfusiInitialValue,
    validationSchema: tranfusiSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let data = {
        hgb_hasil: values.hgb_nilai, hgb_nilai_rujukan: values.hgb_nilai_rujukan, hgb_satuan: values.hgb_satuan,
        rbc_hasil: values.rbc_nilai, rbc_nilai_rujukan: values.rbc_nilai_rujukan, rbc_satuan: values.rbc_satuan,
        hct_hasil: values.hct_nilai, hct_nilai_rujukan: values.hct_nilai_rujukan, hct_satuan: values.hct_satuan,
        mcv_hasil: values.mcv_nilai, mcv_nilai_rujukan: values.mcv_nilai_rujukan, mcv_satuan: values.mcv_satuan,
        mch_hasil: values.mch_nilai, mch_nilai_rujukan: values.mch_nilai_rujukan, mch_satuan: values.mch_satuan,
        mchc_hasil: values.mchc_nilai, mchc_nilai_rujukan: values.mchc_nilai_rujukan, mchc_satuan: values.mchc_satuan,
        pct_hasil: values.pct_nilai, pct_nilai_rujukan: values.pct_nilai_rujukan, pct_satuan: values.pct_satuan,
        wbc_hasil: values.wbc_nilai, wbc_nilai_rujukan: values.wbc_nilai_rujukan, wbc_satuan: values.wbc_satuan,

        limfosit_hasil: values.limfosit_nilai, limfosit_nilai_rujukan: values.limfosit_nilai_rujukan, limfosit_satuan: values.limfosit_satuan,
        monosit_hasil: values.monosit_nilai, monosit_nilai_rujukan: values.monosit_nilai_rujukan, monosit_satuan: values.monosit_satuan,
        granulosit_hasil: values.granulosit_nilai, granulosit_nilai_rujukan: values.granulosit_nilai_rujukan, granulosit_satuan: values.granulosit_satuan,
        tombosit_hasil: values.tombosit_nilai, tombosit_nilai_rujukan: values.tombosit_nilai_rujukan, tombosit_satuan: values.tombosit_satuan,

        asam_urat_hasil: values.asam_urat_nilai, asam_urat_nilai_rujukan: values.asam_urat_nilai_rujukan, asam_urat_satuan: values.asam_urat_satuan,

        kolesterol_hasil: values.kolesterol_nilai, kolesterol_nilai_rujukan: values.kolesterol_nilai_rujukan, kolesterol_satuan: values.kolesterol_satuan,

        glukosa_hasil: values.glukosa_nilai, glukosa_nilai_rujukan: values.glukosa_nilai_rujukan, glukosa_satuan: values.glukosa_satuan,

        status_pasien: values.status_pasien,
        pmi_rujukan: values.pmi_rujukan,
        alamat,
        tgl_permintaan: formatIsoToGen(values.tgl_permintaan),
        gol_darah: values.gol_darah.value,
        rh,
        komponen_yang_diminta: values.komponen_yang_diminta,
        jumlah_yang_diminta: values.jumlah_yang_diminta,
        cara_pembayaran: values.cara_pembayaran,
        keterangan: values.keterangan
  
      };
      try {
        if (!isEditType) {
          await createSuster(data);
          resetForm();
        } else {
          await updateSuster({ ...data, id: detailPrePopulatedData.id });
          const response = await getDetailSuster({
            id: detailPrePopulatedData.id,
          });
          updatePrePopulatedData({ ...response.data.data });
        }
        setSnackbar({
          state: true,
          type: "success",
          message: `"${values.employee_id.name}" berhasil ${messageContext}!`,
        });
      } catch (error) {
        console.log(error);
        setSnackbar({
          state: true,
          type: "error",
          message: `Terjadi kesalahan, "${values.employee_id.name}" gagal ${messageContext}!`,
        });
      }
    },
  });

  return (
    <>
      <Paper sx={{ width: "100%", padding: 3, paddingTop: 3 }}>
        <form onSubmit={tranfusiValidation.handleSubmit}>
          <FocusError formik={tranfusiValidation} />
          <Grid container spacing={2} style={{ backgroundColor: 'InactiveCaptionText' }}>
            <Grid item xs={3}>
                <div className="mb-16" style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
                Nama Pemeriksaan
                </div>
            </Grid>
            <Grid item xs={3}>
                <div className="mb-16" style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
                Hasil
                </div>
            </Grid>
            <Grid item xs={3}>
                <div className="mb-16" style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
                Nilai Rujukan
                </div>
            </Grid>
            <Grid item xs={3}>
                <div className="mb-16" style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
                Satuan
                </div>
            </Grid>
            </Grid>

            <div className="mb-16" style={{marginTop: '16px', fontWeight: 'bold'}}>
                HEMATOLOGI
            </div>

            <div className="mb-16" style={{marginTop: '16px', marginLeft: '16px'}}>
                DARAH LENGKAP
            </div>

            <Grid container spacing={2}>
              <Grid item xs={3}>
                <div className="mb-16" style={{marginTop: '16px', marginLeft: '16px'}}>
                    Hemogoblin (HGB)
                </div>
              </Grid>
              <Grid item xs={3}>
              <div className="mb-16">
                <TextField
                    fullWidth
                    id="hgb_hasil"
                    name="hgb_hasil"
                    label="HGB Hasil"
                    value={tranfusiValidation.values.hgb_hasil}
                    onChange={tranfusiValidation.handleChange}
                    error={
                        tranfusiValidation.touched.hgb_hasil &&
                        Boolean(tranfusiValidation.errors.hgb_hasil)
                    }
                    helperText={
                        tranfusiValidation.touched.hgb_hasil &&
                        tranfusiValidation.errors.hgb_hasil
                    }
                    />
              </div>
              </Grid>
              <Grid item xs={3}>
              <div className="mb-16">
                <TextField
                        fullWidth
                        id="hgb_nilai_rujukan"
                        name="hgb_nilai_rujukan"
                        label="HGB Nilai Rujukan"
                        value={tranfusiValidation.values.hgb_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                            tranfusiValidation.touched.hgb_nilai_rujukan &&
                            Boolean(tranfusiValidation.errors.hgb_nilai_rujukan)
                        }
                        helperText={
                            tranfusiValidation.touched.hgb_nilai_rujukan &&
                            tranfusiValidation.errors.hgb_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
              </div>
              </Grid>
              <Grid item xs={3}>
              <div className="mb-16">
                <TextField
                        fullWidth
                        id="hgb_satuan"
                        name="hgb_satuan"
                        label="HGB Satuan"
                        value={tranfusiValidation.values.hgb_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                            tranfusiValidation.touched.hgb_satuan &&
                            Boolean(tranfusiValidation.errors.hgb_satuan)
                        }
                        helperText={
                            tranfusiValidation.touched.hgb_satuan &&
                            tranfusiValidation.errors.hgb_satuan
                        }
                        disabled={!isEditingMode}
                    />
              </div>
              </Grid>
            </Grid>


          <div className="mt-16 flex justify-end items-center">
            <Button
              type="button"
              variant="outlined"
              startIcon={<PlusIcon />}
              sx={{ marginRight: 2 }}
              onClick={() => router.push("/laboratorium/tranfusi")}
            >
              Tambah
            </Button>

              <ReactToPrint
                trigger={() => (
                  <Button variant="outlined" startIcon={<PrintIcon />}>
                    EXPORT HASIL
                  </Button>
                )}
                content={() => checkupPrintRef.current}
              /><CheckupToPrint
                data={{
                  no_pemeriksaan: detailPrePopulatedData.no_pemeriksaan,
                  no_rm: detailPrePopulatedData.no_rm,
                  nama_pasien: detailPrePopulatedData.nama_pasien,
                }}
                ref={checkupPrintRef}
              />
          </div>
        </form>
      </Paper>
      <Snackbar
        state={snackbar.state}
        setState={setSnackbar}
        message={snackbar.message}
        isSuccessType={snackbar.type === "success"}
        isErrorType={snackbar.type === "error"}
      />
    </>
  );
};

export default FormHasilPemeriksaan;

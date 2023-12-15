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
import { Typography } from "@mui/material";


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
        trombosit_hasil: "", trombosit_nilai_rujukan: "", trombosit_satuan: "",

        asam_urat_hasil: "", asam_urat_nilai_rujukan: "", asam_urat_satuan: "",

        kolesterol_hasil: "", kolesterol_nilai_rujukan: "", kolesterol_satuan: "",

        glukosa_hasil: "", glukosa_nilai_rujukan: "", glukosa_satuan: "",

        // status_pasien: "",
        // pmi_rujukan: "",
        // alamat:"",
        // tgl_permintaan: null,
        // gol_darah: { name: "", value: "" },
        // rh: { name: "", value: "" },
        // komponen_yang_diminta:"",
        // jumlah_yang_diminta:"",
        // cara_pembayaran: { name: "", value: ""},
        // keterangan:""
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
    trombosit_hasil: stringSchema("", true), trombosit_nilai_rujukan: stringSchema("", true), trombosit_satuan: stringSchema("", true),

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
        trombosit_hasil: values.trombosit_nilai, trombosit_nilai_rujukan: values.trombosit_nilai_rujukan, trombosit_satuan: values.trombosit_satuan,

        asam_urat_hasil: values.asam_urat_nilai, asam_urat_nilai_rujukan: values.asam_urat_nilai_rujukan, asam_urat_satuan: values.asam_urat_satuan,

        kolesterol_hasil: values.kolesterol_nilai, kolesterol_nilai_rujukan: values.kolesterol_nilai_rujukan, kolesterol_satuan: values.kolesterol_satuan,

        glukosa_hasil: values.glukosa_nilai, glukosa_nilai_rujukan: values.glukosa_nilai_rujukan, glukosa_satuan: values.glukosa_satuan,

        // status_pasien: values.status_pasien,
        // pmi_rujukan: values.pmi_rujukan,
        // alamat,
        // tgl_permintaan: formatIsoToGen(values.tgl_permintaan),
        // gol_darah: values.gol_darah.value,
        // rh,
        // komponen_yang_diminta: values.komponen_yang_diminta,
        // jumlah_yang_diminta: values.jumlah_yang_diminta,
        // cara_pembayaran: values.cara_pembayaran,
        // keterangan: values.keterangan
  
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
      <Paper sx={{ width: "100%", padding: 0, paddingTop: 0, height: "400px",  overflow: "scroll" }}>
  
          <FocusError formik={tranfusiValidation} />
            <div style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#4CAF50' }}>
                <Grid container spacing={2} style={{ margin: 0, padding: 0 }}>
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
            </div>
            <div onSubmit={tranfusiValidation.handleSubmit} style={{paddingLeft: 20, paddingRight: 20}}>
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
                    // label="HGB Hasil"
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
                        <div>
                            <Typography variant="body1">
                                {tranfusiValidation.values.hgb_nilai_rujukan}
                            </Typography>
                        </div>
                    </div>
                </Grid>
              <Grid item xs={3}>
              <div className="mb-16">
                <div>
                    <Typography variant="body1">
                        {tranfusiValidation.values.hgb_satuan}
                    </Typography>
                </div>
              </div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={3}>
                <div className="mb-16" style={{marginTop: '16px', marginLeft: '16px'}}>
                    Eritrosit (RBC)
                </div>
              </Grid>
              <Grid item xs={3}>
              <div className="mb-16">
                <TextField
                    fullWidth
                    id="rbc_hasil"
                    name="rbc_hasil"
                    // label="RBC Hasil"
                    value={tranfusiValidation.values.rbc_hasil}
                    onChange={tranfusiValidation.handleChange}
                    error={
                        tranfusiValidation.touched.rbc_hasil &&
                        Boolean(tranfusiValidation.errors.rbc_hasil)
                    }
                    helperText={
                        tranfusiValidation.touched.rbc_hasil &&
                        tranfusiValidation.errors.rbc_hasil
                    }
                    />
              </div>
              </Grid>
              <Grid item xs={3}>
              <div className="mb-16">
                <TextField
                        fullWidth
                        id="rbc_nilai_rujukan"
                        name="rbc_nilai_rujukan"
                        // label="RBC Nilai Rujukan"
                        value={tranfusiValidation.values.rbc_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                            tranfusiValidation.touched.rbc_nilai_rujukan &&
                            Boolean(tranfusiValidation.errors.rbc_nilai_rujukan)
                        }
                        helperText={
                            tranfusiValidation.touched.rbc_nilai_rujukan &&
                            tranfusiValidation.errors.rbc_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
              </div>
              </Grid>
              <Grid item xs={3}>
              <div className="mb-16">
                <TextField
                        fullWidth
                        id="rbc_satuan"
                        name="rbc_satuan"
                        // label="RBC Satuan"
                        value={tranfusiValidation.values.rbc_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                            tranfusiValidation.touched.rbc_satuan &&
                            Boolean(tranfusiValidation.errors.rbc_satuan)
                        }
                        helperText={
                            tranfusiValidation.touched.rbc_satuan &&
                            tranfusiValidation.errors.rbc_satuan
                        }
                        disabled={!isEditingMode}
                    />
              </div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    Hematokrit (HCT) 
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="hct_hasil"
                        name="hct_hasil" 
                        // label="HCT Hasil"
                        value={tranfusiValidation.values.hct_hasil} 
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.hct_hasil &&
                        Boolean(tranfusiValidation.errors.hct_hasil) 
                        }
                        helperText={
                        tranfusiValidation.touched.hct_hasil && 
                        tranfusiValidation.errors.hct_hasil 
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="hct_nilai_rujukan"
                        name="hct_nilai_rujukan" 
                        // label="HCT Nilai Rujukan" 
                        value={tranfusiValidation.values.hct_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.hct_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.hct_nilai_rujukan) 
                        }
                        helperText={
                        tranfusiValidation.touched.hct_nilai_rujukan && 
                        tranfusiValidation.errors.hct_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="hct_satuan" 
                        name="hct_satuan" 
                        // label="HCT Satuan" 
                        value={tranfusiValidation.values.hct_satuan} 
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.hct_satuan && 
                        Boolean(tranfusiValidation.errors.hct_satuan) 
                        }
                        helperText={
                        tranfusiValidation.touched.hct_satuan && 
                        tranfusiValidation.errors.hct_satuan 
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
            </Grid>
            
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    Mean Corpuscular Volume (MCV)
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="mcv_hasil"
                        name="mcv_hasil"
                        // label="MCV Hasil"
                        value={tranfusiValidation.values.mcv_hasil}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.mcv_hasil &&
                        Boolean(tranfusiValidation.errors.mcv_hasil)
                        }
                        helperText={
                        tranfusiValidation.touched.mcv_hasil &&
                        tranfusiValidation.errors.mcv_hasil
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="mcv_nilai_rujukan"
                        name="mcv_nilai_rujukan"
                        // label="MCV Nilai Rujukan"
                        value={tranfusiValidation.values.mcv_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.mcv_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.mcv_nilai_rujukan)
                        }
                        helperText={
                        tranfusiValidation.touched.mcv_nilai_rujukan &&
                        tranfusiValidation.errors.mcv_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="mcv_satuan"
                        name="mcv_satuan"
                        // label="MCV Satuan"
                        value={tranfusiValidation.values.mcv_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.mcv_satuan &&
                        Boolean(tranfusiValidation.errors.mcv_satuan)
                        }
                        helperText={
                        tranfusiValidation.touched.mcv_satuan &&
                        tranfusiValidation.errors.mcv_satuan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
            </Grid>
            
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    Mean Corpuscular Hemoglobin (MCH)
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="mch_hasil"
                        name="mch_hasil"
                        // label="MCH Hasil"
                        value={tranfusiValidation.values.mch_hasil}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.mch_hasil &&
                        Boolean(tranfusiValidation.errors.mch_hasil)
                        }
                        helperText={
                        tranfusiValidation.touched.mch_hasil &&
                        tranfusiValidation.errors.mch_hasil
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="mch_nilai_rujukan"
                        name="mch_nilai_rujukan"
                        // label="MCH Nilai Rujukan"
                        value={tranfusiValidation.values.mch_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.mch_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.mch_nilai_rujukan)
                        }
                        helperText={
                        tranfusiValidation.touched.mch_nilai_rujukan &&
                        tranfusiValidation.errors.mch_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="mch_satuan"
                        name="mch_satuan"
                        // label="MCH Satuan"
                        value={tranfusiValidation.values.mch_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.mch_satuan &&
                        Boolean(tranfusiValidation.errors.mch_satuan)
                        }
                        helperText={
                        tranfusiValidation.touched.mch_satuan &&
                        tranfusiValidation.errors.mch_satuan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    MCHC
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="mchc_hasil"
                        name="mchc_hasil"
                        // label="MCHC Hasil"
                        value={tranfusiValidation.values.mchc_hasil}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.mchc_hasil &&
                        Boolean(tranfusiValidation.errors.mchc_hasil)
                        }
                        helperText={
                        tranfusiValidation.touched.mchc_hasil &&
                        tranfusiValidation.errors.mchc_hasil
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="mchc_nilai_rujukan"
                        name="mchc_nilai_rujukan"
                        // label="MCHC Nilai Rujukan"
                        value={tranfusiValidation.values.mchc_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.mchc_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.mchc_nilai_rujukan)
                        }
                        helperText={
                        tranfusiValidation.touched.mchc_nilai_rujukan &&
                        tranfusiValidation.errors.mchc_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="mchc_satuan"
                        name="mchc_satuan"
                        // label="MCHC Satuan"
                        value={tranfusiValidation.values.mchc_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.mchc_satuan &&
                        Boolean(tranfusiValidation.errors.mchc_satuan)
                        }
                        helperText={
                        tranfusiValidation.touched.mchc_satuan &&
                        tranfusiValidation.errors.mchc_satuan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
            </Grid>
            
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    Platelet Crit (PCT)
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="pct_hasil"
                        name="pct_hasil"
                        // label="PCT Hasil"
                        value={tranfusiValidation.values.pct_hasil}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.pct_hasil &&
                        Boolean(tranfusiValidation.errors.pct_hasil)
                        }
                        helperText={
                        tranfusiValidation.touched.pct_hasil &&
                        tranfusiValidation.errors.pct_hasil
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="pct_nilai_rujukan"
                        name="pct_nilai_rujukan"
                        // label="PCT Nilai Rujukan"
                        value={tranfusiValidation.values.pct_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.pct_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.pct_nilai_rujukan)
                        }
                        helperText={
                        tranfusiValidation.touched.pct_nilai_rujukan &&
                        tranfusiValidation.errors.pct_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="pct_satuan"
                        name="pct_satuan"
                        // label="PCT Satuan"
                        value={tranfusiValidation.values.pct_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.pct_satuan &&
                        Boolean(tranfusiValidation.errors.pct_satuan)
                        }
                        helperText={
                        tranfusiValidation.touched.pct_satuan &&
                        tranfusiValidation.errors.pct_satuan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    Leukosit (WBC)
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="wbc_hasil"
                        name="wbc_hasil"
                        // label="WBC Hasil"
                        value={tranfusiValidation.values.wbc_hasil}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.wbc_hasil &&
                        Boolean(tranfusiValidation.errors.wbc_hasil)
                        }
                        helperText={
                        tranfusiValidation.touched.wbc_hasil &&
                        tranfusiValidation.errors.wbc_hasil
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="wbc_nilai_rujukan"
                        name="wbc_nilai_rujukan"
                        // label="WBC Nilai Rujukan"
                        value={tranfusiValidation.values.wbc_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.wbc_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.wbc_nilai_rujukan)
                        }
                        helperText={
                        tranfusiValidation.touched.wbc_nilai_rujukan &&
                        tranfusiValidation.errors.wbc_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="wbc_satuan"
                        name="wbc_satuan"
                        // label="WBC Satuan"
                        value={tranfusiValidation.values.wbc_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.wbc_satuan &&
                        Boolean(tranfusiValidation.errors.wbc_satuan)
                        }
                        helperText={
                        tranfusiValidation.touched.wbc_satuan &&
                        tranfusiValidation.errors.wbc_satuan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
            </Grid>

            <div className="mb-16" style={{marginTop: '16px', marginLeft: '16px'}}>
                HITUNG JENIS :
            </div>
            
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    - Limfosit
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="limfosit_hasil"
                        name="limfosit_hasil"
                        // label="Limfosit Hasil"
                        value={tranfusiValidation.values.limfosit_hasil}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.limfosit_hasil &&
                        Boolean(tranfusiValidation.errors.limfosit_hasil)
                        }
                        helperText={
                        tranfusiValidation.touched.limfosit_hasil &&
                        tranfusiValidation.errors.limfosit_hasil
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="limfosit_nilai_rujukan"
                        name="limfosit_nilai_rujukan"
                        // label="Limfosit Nilai Rujukan"
                        value={tranfusiValidation.values.limfosit_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.limfosit_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.limfosit_nilai_rujukan)
                        }
                        helperText={
                        tranfusiValidation.touched.limfosit_nilai_rujukan &&
                        tranfusiValidation.errors.limfosit_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="limfosit_satuan"
                        name="limfosit_satuan"
                        // label="Limfosit Satuan"
                        value={tranfusiValidation.values.limfosit_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.limfosit_satuan &&
                        Boolean(tranfusiValidation.errors.limfosit_satuan)
                        }
                        helperText={
                        tranfusiValidation.touched.limfosit_satuan &&
                        tranfusiValidation.errors.limfosit_satuan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
            </Grid>
            
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    - Monosit
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="monosit_hasil"
                        name="monosit_hasil"
                        // label="Monosit Hasil"
                        value={tranfusiValidation.values.monosit_hasil}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.monosit_hasil &&
                        Boolean(tranfusiValidation.errors.monosit_hasil)
                        }
                        helperText={
                        tranfusiValidation.touched.monosit_hasil &&
                        tranfusiValidation.errors.monosit_hasil
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="monosit_nilai_rujukan"
                        name="monosit_nilai_rujukan"
                        // label="Monosit Nilai Rujukan"
                        value={tranfusiValidation.values.monosit_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.monosit_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.monosit_nilai_rujukan)
                        }
                        helperText={
                        tranfusiValidation.touched.monosit_nilai_rujukan &&
                        tranfusiValidation.errors.monosit_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="monosit_satuan"
                        name="monosit_satuan"
                        // label="Monosit Satuan"
                        value={tranfusiValidation.values.monosit_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.monosit_satuan &&
                        Boolean(tranfusiValidation.errors.monosit_satuan)
                        }
                        helperText={
                        tranfusiValidation.touched.monosit_satuan &&
                        tranfusiValidation.errors.monosit_satuan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
            </Grid>
            
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    - Granulosit
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="granulosit_hasil"
                        name="granulosit_hasil"
                        // label="Granulosit Hasil"
                        value={tranfusiValidation.values.granulosit_hasil}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.granulosit_hasil &&
                        Boolean(tranfusiValidation.errors.granulosit_hasil)
                        }
                        helperText={
                        tranfusiValidation.touched.granulosit_hasil &&
                        tranfusiValidation.errors.granulosit_hasil
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="granulosit_nilai_rujukan"
                        name="granulosit_nilai_rujukan"
                        // label="Granulosit Nilai Rujukan"
                        value={tranfusiValidation.values.granulosit_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.granulosit_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.granulosit_nilai_rujukan)
                        }
                        helperText={
                        tranfusiValidation.touched.granulosit_nilai_rujukan &&
                        tranfusiValidation.errors.granulosit_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="granulosit_satuan"
                        name="granulosit_satuan"
                        // label="Granulosit Satuan"
                        value={tranfusiValidation.values.granulosit_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.granulosit_satuan &&
                        Boolean(tranfusiValidation.errors.granulosit_satuan)
                        }
                        helperText={
                        tranfusiValidation.touched.granulosit_satuan &&
                        tranfusiValidation.errors.granulosit_satuan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    Trombosit
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="trombosit_hasil"
                        name="trombosit_hasil"
                        // label="Trombosit Hasil"
                        value={tranfusiValidation.values.trombosit_hasil}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.trombosit_hasil &&
                        Boolean(tranfusiValidation.errors.trombosit_hasil)
                        }
                        helperText={
                        tranfusiValidation.touched.trombosit_hasil &&
                        tranfusiValidation.errors.trombosit_hasil
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="trombosit_nilai_rujukan"
                        name="trombosit_nilai_rujukan"
                        // label="Trombosit Nilai Rujukan"
                        value={tranfusiValidation.values.trombosit_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.trombosit_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.trombosit_nilai_rujukan)
                        }
                        helperText={
                        tranfusiValidation.touched.trombosit_nilai_rujukan &&
                        tranfusiValidation.errors.trombosit_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="trombosit_satuan"
                        name="trombosit_satuan"
                        // label="Trombosit Satuan"
                        value={tranfusiValidation.values.trombosit_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.trombosit_satuan &&
                        Boolean(tranfusiValidation.errors.trombosit_satuan)
                        }
                        helperText={
                        tranfusiValidation.touched.trombosit_satuan &&
                        tranfusiValidation.errors.trombosit_satuan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
            </Grid>

            <div className="mb-16" style={{marginTop: '16px', fontWeight: 'bold'}}>
                FUNGSI GINJAL
            </div>

            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    Asam Urat
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="asam_urat_hasil"
                        name="asam_urat_hasil"
                        // label="Asam Urat Hasil"
                        value={tranfusiValidation.values.asam_urat_hasil}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.asam_urat_hasil &&
                        Boolean(tranfusiValidation.errors.asam_urat_hasil)
                        }
                        helperText={
                        tranfusiValidation.touched.asam_urat_hasil &&
                        tranfusiValidation.errors.asam_urat_hasil
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="asam_urat_nilai_rujukan"
                        name="asam_urat_nilai_rujukan"
                        // label="Asam Urat Nilai Rujukan"
                        value={tranfusiValidation.values.asam_urat_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.asam_urat_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.asam_urat_nilai_rujukan)
                        }
                        helperText={
                        tranfusiValidation.touched.asam_urat_nilai_rujukan &&
                        tranfusiValidation.errors.asam_urat_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="asam_urat_satuan"
                        name="asam_urat_satuan"
                        // label="Asam Urat Satuan"
                        value={tranfusiValidation.values.asam_urat_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.asam_urat_satuan &&
                        Boolean(tranfusiValidation.errors.asam_urat_satuan)
                        }
                        helperText={
                        tranfusiValidation.touched.asam_urat_satuan &&
                        tranfusiValidation.errors.asam_urat_satuan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
            </Grid>

            <div className="mb-16" style={{marginTop: '16px', fontWeight: 'bold'}}>
                LEMAK
            </div>

            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    Kolesterol
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="kolesterol_hasil"
                        name="kolesterol_hasil"
                        // label="Kolesterol Hasil"
                        value={tranfusiValidation.values.kolesterol_hasil}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.kolesterol_hasil &&
                        Boolean(tranfusiValidation.errors.kolesterol_hasil)
                        }
                        helperText={
                        tranfusiValidation.touched.kolesterol_hasil &&
                        tranfusiValidation.errors.kolesterol_hasil
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="kolesterol_nilai_rujukan"
                        name="kolesterol_nilai_rujukan"
                        // label="Kolesterol Nilai Rujukan"
                        value={tranfusiValidation.values.kolesterol_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.kolesterol_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.kolesterol_nilai_rujukan)
                        }
                        helperText={
                        tranfusiValidation.touched.kolesterol_nilai_rujukan &&
                        tranfusiValidation.errors.kolesterol_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="kolesterol_satuan"
                        name="kolesterol_satuan"
                        // label="Kolesterol Satuan"
                        value={tranfusiValidation.values.kolesterol_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.kolesterol_satuan &&
                        Boolean(tranfusiValidation.errors.kolesterol_satuan)
                        }
                        helperText={
                        tranfusiValidation.touched.kolesterol_satuan &&
                        tranfusiValidation.errors.kolesterol_satuan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
            </Grid>

            <div className="mb-16" style={{marginTop: '16px', fontWeight: 'bold'}}>
                GLUKOSA DARAH
            </div>
            
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <div className="mb-16" style={{ marginTop: '16px', marginLeft: '16px' }}>
                    Glukosa Puasa
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="glukosa_hasil"
                        name="glukosa_hasil"
                        // label="Glukosa Hasil"
                        value={tranfusiValidation.values.glukosa_hasil}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.glukosa_hasil &&
                        Boolean(tranfusiValidation.errors.glukosa_hasil)
                        }
                        helperText={
                        tranfusiValidation.touched.glukosa_hasil &&
                        tranfusiValidation.errors.glukosa_hasil
                        }
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="glukosa_nilai_rujukan"
                        name="glukosa_nilai_rujukan"
                        // label="Glukosa Nilai Rujukan"
                        value={tranfusiValidation.values.glukosa_nilai_rujukan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.glukosa_nilai_rujukan &&
                        Boolean(tranfusiValidation.errors.glukosa_nilai_rujukan)
                        }
                        helperText={
                        tranfusiValidation.touched.glukosa_nilai_rujukan &&
                        tranfusiValidation.errors.glukosa_nilai_rujukan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="mb-16">
                    <TextField
                        fullWidth
                        id="glukosa_satuan"
                        name="glukosa_satuan"
                        // label="Glukosa Satuan"
                        value={tranfusiValidation.values.glukosa_satuan}
                        onChange={tranfusiValidation.handleChange}
                        error={
                        tranfusiValidation.touched.glukosa_satuan &&
                        Boolean(tranfusiValidation.errors.glukosa_satuan)
                        }
                        helperText={
                        tranfusiValidation.touched.glukosa_satuan &&
                        tranfusiValidation.errors.glukosa_satuan
                        }
                        disabled={!isEditingMode}
                    />
                    </div>
                </Grid>
                </Grid>

                <div className="mt-16 flex justify-end items-center">
                    <ReactToPrint
                        trigger={() => (
                        <Button variant="outlined" startIcon={<PrintIcon />}>
                            EXPORT HASIL
                        </Button>
                        )}
                        content={() => checkupPrintRef.current}
                    />
                    <div style={{ marginRight: '16px' }} /> {/* Menambah jarak */}
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        disabled={
                        JSON.stringify(tranfusiValidation.initialValues) ===
                            JSON.stringify(tranfusiValidation.values) ||
                        !isActionPermitted("suster:update")
                        }
                        startIcon={<SaveIcon />}
                        loadingPosition="start"
                        loading={tranfusiValidation.isSubmitting}
                    >
                        Simpan perubahan
                    </LoadingButton>
                </div>

              
 
          
        </div>
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

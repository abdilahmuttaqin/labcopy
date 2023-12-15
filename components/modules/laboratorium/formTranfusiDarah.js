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
import { createSuster, updateTranfusiDarah, getDetailTransfusiDarah} from "api/laboratorium";
import { getListOptionEmployee } from "api/employee";
import { golDarah } from "public/static/data";
import { rh } from "public/static/data";
import { cara_bayar } from "public/static/data";
import { bloodType } from "public/static/data";
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

  {/* <hr></hr>
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
      <div>Hasil Expertise: {data.hasil_expertise || "-"}</div> */}


</div>

  );
});

const FormTranfusi = ({
  isEditType = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => "update data",
}) => {
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
        status: "",
        pmi_rujukan: "",
        alamat:"",
        tgl_permintaan: null,
        gol_darah: { name: "", value: "" },
        rh: { name: "", value: "" },
        komponen:"",
        jumlah:"",
        cara_bayar: { name: "", value: ""},
        keterangan:""
      }
    : prePopulatedDataForm;

  const tranfusiSchema = Yup.object({
    status: stringSchema("Status Pasien", true),
    pmi_rujukan: stringSchema("PMI Rujukan", true),
    alamat: stringSchema("PMI Rujukan", true),
    tgl_permintaan: dateSchema("Tanggal Permintaan"),
    gol_darah: Yup.object({
      value: stringSchema("Pilih Golongan Darah", true),
    }),
    rh: Yup.object({
      value: Yup.boolean("Pilih RH").required("RH wajib diisi"),
    }),
    komponen: stringSchema("Komponen Yang Diminta", true),
    jumlah: stringSchema("Jumlah Yang Diminta", true),
    cara_bayar: Yup.object({
      value: stringSchema("Pilih Pembayaran", true),
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
        status: values.status,
        pmi_rujukan: values.pmi_rujukan,
        alamat: values.alamat,
        tgl_permintaan: formatIsoToGen(values.tgl_permintaan),
        gol_darah: values.gol_darah.value,
        rh: values.rh.value,
        komponen: values.komponen,
        jumlah: values.jumlah,
        cara_bayar: values.cara_bayar.value,
        keterangan: values.keterangan,
      };
      try {
        if (!isEditType) {
          // await createSuster(data);
          // resetForm();
        } else {
          await updateTranfusiDarah({ ...data, id: detailPrePopulatedData.id });
          const response = await getDetailTransfusiDarah({
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
          <div className="mb-16">
                <TextField
                  fullWidth
                  id="status"
                  name="status"
                  label="Status Pasien"
                  value={tranfusiValidation.values.status}
                  onChange={tranfusiValidation.handleChange}
                  error={
                    tranfusiValidation.touched.status &&
                    Boolean(tranfusiValidation.errors.status)
                  }
                  helperText={
                    tranfusiValidation.touched.status &&
                    tranfusiValidation.errors.status
                  }
                />
            </div>
            <div className="mb-16">
                <TextField
                  fullWidth
                  id="pmi_rujukan"
                  name="pmi_rujukan"
                  label="PMI Rujukan"
                  value={tranfusiValidation.values.pmi_rujukan}
                  onChange={tranfusiValidation.handleChange}
                  error={
                    tranfusiValidation.touched.pmi_rujukan &&
                    Boolean(tranfusiValidation.errors.pmi_rujukan)
                  }
                  helperText={
                    tranfusiValidation.touched.pmi_rujukan &&
                    tranfusiValidation.errors.pmi_rujukan
                  }
                />
            </div>
            <div className="mb-16">
                <TextField
                  fullWidth
                  id="alamat"
                  name="alamat"
                  label="Alamat"
                  value={tranfusiValidation.values.alamat}
                  onChange={tranfusiValidation.handleChange}
                  error={
                    tranfusiValidation.touched.alamat &&
                    Boolean(tranfusiValidation.errors.alamat)
                  }
                  helperText={
                    tranfusiValidation.touched.alamat &&
                    tranfusiValidation.errors.alamat
                  }
                />
            </div>
            <div className="mb-16">
                <DatePicker
                  id="tgl_permintaan"
                  label="Tanggal Permintaan"
                  handlerRef={tranfusiValidation}
                />
              </div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
              <div className="mb-16">
                <SelectStatic
                  id="gol_darah"
                  handlerRef={tranfusiValidation}
                  label="Gol Darah"
                  options={bloodType}
                />
              </div>
              </Grid>
              <Grid item xs={6}>
              <div className="mb-16">
                <SelectStatic
                  id="rh"
                  handlerRef={tranfusiValidation}
                  label="RH"
                  options={rh}
                />
              </div>
              </Grid>
            </Grid>
            <div className="mb-16">
            <TextField
                  fullWidth
                  id="komponen"
                  name="komponen"
                  label="Komponen Yang Diminta"
                  value={tranfusiValidation.values.komponen}
                  onChange={tranfusiValidation.handleChange}
                  error={
                    tranfusiValidation.touched.komponen &&
                    Boolean(tranfusiValidation.errors.komponen)
                  }
                  helperText={
                    tranfusiValidation.touched.komponen &&
                    tranfusiValidation.errors.komponen
                  }
                />
                {/* {komponen === 'lainnya' && (
                  <div id="komponen_lainnya">
                    <label for="lainnya_input">Value dari "komponen_lainnya":</label>
                    <input
                      type="text"
                      id="lainnya_input"
                      name="lainnya_input"
                      value={tranfusiValidation.values.komponen_lainya}
                      onChange={tranfusiValidation.handleChange}
                      error={
                        tranfusiValidation.touched.komponen_lainya &&
                        Boolean(tranfusiValidation.errors.komponen_lainya)
                      }
                      helperText={
                        tranfusiValidation.touched.komponen_lainya &&
                        tranfusiValidation.errors.komponen_lainya
                      }
                    />
                  </div>
                )} */}
                </div>
            <div className="mb-16">
                <TextField
                  fullWidth
                  id="jumlah"
                  name="jumlah"
                  label="Jumlah Yang Diminta"
                  value={tranfusiValidation.values.jumlah}
                  onChange={tranfusiValidation.handleChange}
                  error={
                    tranfusiValidation.touched.jumlah &&
                    Boolean(tranfusiValidation.errors.jumlah)
                  }
                  helperText={
                    tranfusiValidation.touched.jumlah &&
                    tranfusiValidation.errors.jumlah
                  }
                />
            </div>
            <div className="mb-16">
                <SelectStatic
                  id="cara_bayar"
                  handlerRef={tranfusiValidation}
                  label="Cara Pembayaran"
                  options={cara_bayar}
                />
              </div>
            <div className="mb-16">
                <TextField
                  fullWidth
                  id="keterangan"
                  name="keterangan"
                  label="Keterangan"
                  value={tranfusiValidation.values.keterangan}
                  onChange={tranfusiValidation.handleChange}
                  error={
                    tranfusiValidation.touched.keterangan &&
                    Boolean(tranfusiValidation.errors.keterangan)
                  }
                  helperText={
                    tranfusiValidation.touched.keterangan &&
                    tranfusiValidation.errors.keterangan
                  }
                />
            </div>

          <div className="mt-16 flex justify-end items-center">
            <Button
              type="button"
              variant="outlined"
              startIcon={<BackIcon />}
              sx={{ marginRight: 2 }}
              onClick={() => router.push("/laboratorium/tranfusi")}
            >
              Kembali
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
                  tanggal_lahir: detailPrePopulatedData.tanggal_lahir,
                  umur: detailPrePopulatedData.umur,
                  tanggal_pemeriksaan: detailPrePopulatedData.tanggal_pemeriksaan,
                  diagnosis_kerja: detailPrePopulatedData.diagnosis_kerja,
                  nama_pemeriksaan: detailPrePopulatedData.nama_pemeriksaan,
                  jenis_pemeriksaan: detailPrePopulatedData.jenis_pemeriksaan,
                  dokter_pengirim: detailPrePopulatedData.dokter_pengirim,
                  poli: detailPrePopulatedData.poli,
                }}
                ref={checkupPrintRef}
              />

            <LoadingButton
                type="submit"
                variant="contained"
                disabled={
                  JSON.stringify(tranfusiValidation.initialValues) ===
                  JSON.stringify(tranfusiValidation.values) ||
                  !isActionPermitted("tranfusidarah:update")
                }
                startIcon={<SaveIcon />}
                marginRight="100dp"
                loadingPosition="start"
                loading={tranfusiValidation.isSubmitting}
              >
                Simpan perubahan
              </LoadingButton>  
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

export default FormTranfusi;

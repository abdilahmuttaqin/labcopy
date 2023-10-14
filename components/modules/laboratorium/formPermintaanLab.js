import { useState } from "react";
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
import Grid from "@mui/material/Grid";
import DatePicker from "components/DatePicker";
import Snackbar from "components/SnackbarMui";
import { formatIsoToGen } from "utils/formatTime";
import { dateSchema, stringSchema, phoneNumberSchema } from "utils/yupSchema";
import useClientPermission from "custom-hooks/useClientPermission";
import { createPermintaanLab, updatePermintaanLab, getDetailPermintaanLab } from "api/laboratorium";

const FormPermintaanLab = ({
  isEditType = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => "update data",
}) => {
  const router = useRouter();
  const { isActionPermitted } = useClientPermission();
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: "",
  });

  const PermintaanLabInitialValue = !isEditType
    ? {
      nama_barang: "",
      jumlah_barang: "",
      tgl_permintaan: null,
    }
    : prePopulatedDataForm;

  const PermintaanLabschema = Yup.object({
    nama_barang: stringSchema("Nama Barang", true),
    jumlah_barang: stringSchema("Jumlah Barang", true),
    tgl_permintaan: dateSchema("Tanggal Permintaan")
  });

  const PermintaanLabValidation = useFormik({
    initialValues: PermintaanLabInitialValue,
    validationSchema: PermintaanLabschema,
    enableReinitialize: true,
    // onSubmit: async (values, { resetForm, setFieldError }) => {
    onSubmit: async (values, { resetForm }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let data = {
        nama_barang: values.nama_barang,
        jumlah_barang: values.jumlah_barang,
        tgl_permintaan: formatIsoToGen(values.tgl_permintaan),
      };

      // let validData = {};
      // for (let key in formattedData) {
      //   if (formattedData[key]) {
      //     validData[`${key}`] = formattedData[key];
      //   }
      // }
      
      try {
        if (!isEditType) {
          await createPermintaanLab(data);
          resetForm();
        } else {
          await updatePermintaanLab({ ...data, id: detailPrePopulatedData.id });
          const response = await getDetailPermintaanLab({
            id: detailPrePopulatedData.id,
          });
          updatePrePopulatedData({ ...response.data.data });
        }
        setSnackbar({
          state: true,
          type: "success",
          message: `"${values.nama_barang}" berhasil ${messageContext}!`,
        });
      } catch (error) {
        if (Object.keys(error.errorValidationObj).length >= 1) {
          for (let key in error.errorValidationObj) {
            setFieldError(key, error.errorValidationObj[key][0]);
          }
        }
        setSnackbar({
          state: true,
          type: "error",
          message: `Terjadi kesalahan, "${values.nama_barang}" gagal ${messageContext}!`,
        });
      }
    },
  });

  return (
    <>
      <Paper sx={{ width: "100%", padding: 2, paddingTop: 3 }}>
        <div className="font-14 mb-14">
          <i>
            Catatan: Field bertanda{" "}
            <span className="font-w-700 font-16">*</span> wajib terisi
          </i>
        </div>
        <form onSubmit={PermintaanLabValidation.handleSubmit}>
          <FocusError formik={PermintaanLabValidation} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="nama_barang"
                  name="nama_barang"
                  label="Nama Barang"
                  value={PermintaanLabValidation.values.nama_barang}
                  onChange={PermintaanLabValidation.handleChange}
                  error={
                    PermintaanLabValidation.touched.nama_barang &&
                    Boolean(PermintaanLabValidation.errors.nama_barang)
                  }
                  helperText={
                    PermintaanLabValidation.touched.nama_barang &&
                    PermintaanLabValidation.errors.nama_barang
                  }
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="jumlah_barang"
                  name="jumlah_barang"
                  label="Jumlah Barang *"
                  value={PermintaanLabValidation.values.jumlah_barang}
                  onChange={PermintaanLabValidation.handleChange}
                  error={
                    PermintaanLabValidation.touched.jumlah_barang &&
                    Boolean(PermintaanLabValidation.errors.jumlah_barang)
                  }
                  helperText={
                    PermintaanLabValidation.touched.jumlah_barang &&
                    PermintaanLabValidation.errors.jumlah_barang
                  }
                />
              </div>
              <div className="mb-16">
                <DatePicker
                  id="tgl_permintaan"
                  label="Tanggal Permintaan *"
                  handlerRef={PermintaanLabValidation}
                />
              </div>
            </Grid>
          </Grid>
          <div className="mt-16 flex justify-end items-center">
            <Button
              type="button"
              variant="outlined"
              startIcon={<BackIcon />}
              sx={{ marginRight: 2 }}
              onClick={() => router.push("/permintaanlab")}
            >
              Kembali
            </Button>
            {isEditType ? (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={
                  JSON.stringify(PermintaanLabValidation.initialValues) ===
                  JSON.stringify(PermintaanLabValidation.values) ||
                  !isActionPermitted("permintaanlab:update")
                }
                startIcon={<SaveIcon />}
                loadingPosition="start"
                loading={PermintaanLabValidation.isSubmitting}
              >
                Simpan perubahan
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!isActionPermitted("permintaanlab:store")}
                startIcon={<PlusIcon />}
                loadingPosition="start"
                loading={PermintaanLabValidation.isSubmitting}
              >
                Tambah Permintaan
              </LoadingButton>
            )}
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


export default FormPermintaanLab;

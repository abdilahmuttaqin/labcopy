import { useState } from "react";
import { useRouter } from "next/router";
import { FocusError } from "focus-formik-error";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import PlusIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import BackIcon from "@material-ui/icons/ArrowBack";
import { useFormik } from "formik";
import * as Yup from "yup";
import Snackbar from "components/SnackbarMui";
// import { createTriase } from "api/ugd";
import { stringSchema, phoneNumberSchema } from "utils/yupSchema";
import InputPhoneNumber from "components/InputPhoneNumber";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import useClientPermission from "custom-hooks/useClientPermission";
import SelectStatic from "components/SelectStatic";
import { saranaTransportasi, esiLevel } from "public/static/data";

const TriasePasienForm = ({
  isEditType = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => "update data",
  handleClose = () => {},
}) => {
  const { isActionPermitted } = useClientPermission();
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: "",
  });
  const [isEditingMode, setIsEditingMode] = useState(false);
  const router = useRouter();
  const { slug } = router.query;

  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };

  const triaseInitialValues = !isEditType
    ? {
        sarana_transportasi: { name: "", value: "" },
        no_pengantar: "",
        esi_level: { name: "", value: "" },
        surat_pengantar_rujukan: { name: "", value: "" },
        nama_pengantar: "",
      }
    : prePopulatedDataForm;

  const createTriaseSchema = Yup.object({
    sarana_transportasi: Yup.object({
      value: stringSchema("Sarana transportasi", true),
    }),
    no_pengantar: phoneNumberSchema(true),
    esi_level: Yup.object({
      value: stringSchema("Kondisi pasien tiba", true),
    }),
    surat_pengantar_rujukan: Yup.object({
      value: stringSchema("Surat pengantar rujukan", true),
    }),
    nama_pengantar: stringSchema("Surat pengantar rujukan", true),
  });

  const createTriaseValidation = useFormik({
    initialValues: triaseInitialValues,
    validationSchema: createTriaseSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setFieldError }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let formattedData = {
        ...values,
        id_pasien: slug[0],
        sarana_transportasi: values.sarana_transportasi.value,
        esi_level: values.esi_level.value,
        surat_pengantar_rujukan: values.surat_pengantar_rujukan.value,
      };
      if (formattedData.no_pengantar !== "") {
        formattedData.no_pengantar = formattedData.no_pengantar.substring(1);
      }
      if (formattedData.surat_pengantar_rujukan !== "") {
        formattedData.surat_pengantar_rujukan = parseInt(
          formattedData.surat_pengantar_rujukan
        );
      }
      try {
        let response;
        if (!isEditType) {
          console.log(formattedData);
          response = await createTriase(formattedData);
          resetForm();
        } else {
          // await updatePasien({
          //   ...formattedData,
          //   id: detailPrePopulatedData.id,
          // });
          // response = await getDetailPasien({
          //   id: detailPrePopulatedData.id,
          // });
          // updatePrePopulatedData({ ...response.data.data });
        }
        setSnackbar({
          state: true,
          type: "success",
          message: `"${formattedData.no_pengantar}" berhasil ${messageContext}!`,
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
          message: `Terjadi kesalahan, "${formattedData.no_pengantar}" gagal ${messageContext}!`,
        });
      }
    },
  });

  return (
    <>
      <Paper sx={{ width: "100%", padding: 2, paddingTop: 1 }}>
        {isEditType ? (
          <div className="flex justify-end mb-40">
            <FormControlLabel
              control={
                <Switch
                  checked={isEditingMode}
                  onChange={handleIsEditingMode}
                  inputProps={{ "aria-label": "controlled" }}
                  disabled={!isActionPermitted("pasien:update")}
                />
              }
              label="Ubah data"
            />
          </div>
        ) : null}
        <h2 className="color-grey-text">Formulir Triase Pasien</h2>
        <form onSubmit={createTriaseValidation.handleSubmit}>
          <FocusError formik={createTriaseValidation} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className="mb-16">
                <SelectStatic
                  id="sarana_transportasi"
                  handlerRef={createTriaseValidation}
                  label="Sarana transportasi"
                  options={saranaTransportasi}
                />
              </div>
              <div className="mb-16">
                <InputPhoneNumber
                  id="no_pengantar"
                  labelField="No telepon pengantar"
                  handlerRef={createTriaseValidation}
                  disabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <SelectStatic
                  id="esi_level"
                  handlerRef={createTriaseValidation}
                  label="Kondisi pasien tiba"
                  options={esiLevel}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="mb-16">
                <SelectStatic
                  id="surat_pengantar_rujukan"
                  handlerRef={createTriaseValidation}
                  label="Surat pengantar rujukan"
                  options={[
                    { name: "Ya", value: "1" },
                    { name: "Tidak", value: "0" },
                  ]}
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="nama_pengantar"
                  name="nama_pengantar"
                  label="Nama pengantar pasien"
                  value={createTriaseValidation.values.nama_pengantar}
                  onChange={createTriaseValidation.handleChange}
                  error={
                    createTriaseValidation.touched.nama_pengantar &&
                    Boolean(createTriaseValidation.errors.nama_pengantar)
                  }
                  helperText={
                    createTriaseValidation.touched.nama_pengantar &&
                    createTriaseValidation.errors.nama_pengantar
                  }
                  disabled={isEditType && !isEditingMode}
                />
              </div>
            </Grid>
          </Grid>
          <div className="flex justify-end items-center mt-16">
            <Button
              type="button"
              variant="outlined"
              startIcon={<BackIcon />}
              sx={{ marginRight: 2 }}
              onClick={() => handleClose()}
            >
              Kembali
            </Button>
            {isEditType ? (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={
                  JSON.stringify(createTriaseValidation.initialValues) ===
                    JSON.stringify(createTriaseValidation.values) ||
                  !isActionPermitted("pasien:update") ||
                  (isEditType && !isEditingMode)
                }
                startIcon={<SaveIcon />}
                loadingPosition="start"
                loading={createTriaseValidation.isSubmitting}
              >
                Simpan perubahan
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!isActionPermitted("pasien:store")}
                startIcon={<PlusIcon />}
                loadingPosition="start"
                loading={createTriaseValidation.isSubmitting}
              >
                Tambah triase
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

export default TriasePasienForm;
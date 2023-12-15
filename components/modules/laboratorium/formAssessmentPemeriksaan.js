import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Grid, Paper, TextField, Button, MenuItem, Dialog,
  DialogTitle,
  DialogContent, DialogActions, FormControlLabel
} from "@mui/material";
import DateTimePickerComp from "components/DateTimePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { stringSchema, dateSchema, phoneNumberSchema } from "utils/yupSchema";
import InputPhoneNumber from "components/InputPhoneNumber";
import EditIcon from "@material-ui/icons/Edit";
import Switch from "@mui/material/Switch";
import useClientPermission from "custom-hooks/useClientPermission";
import Snackbar from "components/SnackbarMui";
import {getListAsesmenPemeriksaanLab, createAsesmenPemeriksaanLab, updateAsesmenPemeriksaanLab, getDetailAsesmenPemeriksaanLab} from "api/laboratorium";
import { formatIsoToGen } from "utils/formatTime";
import { statusAlergi, statusKehamilan } from "public/static/data";

import SelectStatic from "components/SelectStatic";


const FormAssessmentPemeriksaan = ({  
  data,
  isEditType = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => "update data",}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const { isActionPermitted } = useClientPermission();
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: "",
  });
  const [dataAssessmentPemeriksaanLabPerPage, setAssessmentPemeriksaanLabPerPage] = useState(8);
  const [
    isLoadingDataAssessmentPemeriksaanLab,
    setIsLoadingDataAssessmentPemeriksaanLab,
  ] = useState(false);
  const [
    isUpdatingDataAssessmentPemeriksaanLab,
    setIsUpdatingDataAssessmentPemeriksaanLab,
  ] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const initDataAssessmentPemeriksaanLab = async () => {
    try {
      setIsLoadingDataAssessmentPemeriksaanLab(true);
      const params = {
        per_page: dataAssessmentPemeriksaanLabPerPage,
      };
      const response = await getListAsesmenPemeriksaanLab(params);
      const result = dataAssessmentPemeriksaanLabFormatHandler(response.data.data);
      // setDataPermintaanRadiologi(result);
      setDataMetaAssessmentPemeriksaanLab(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataAssessmentPemeriksaanLab(false);
    }
  };

  const updateDataAssessmentPemeriksaanLabHandler = async (payload) => {
    try {
      setIsUpdatingDataAssessmentPemeriksaanLab(true);
      const response = await getListAsesmenPemeriksaanLab(payload);
      const result = dataAssessmentPemeriksaanLabFormatHandler(response.data.data);
      // setDataPermintaanLab(result);
      setDataMetaAssessmentPemeriksaanLab(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataAssessmentPemeriksaanLab(false);
    }
  };

  // ASSESSMENT PASIEN 
  const [dataAssessmentPemeriksaanLab, setDataAssessmentPemeriksaanLab] = useState({});
  const [dataMetaAssessmentPemeriksaanLab, setDataMetaAssessmentPemeriksaanLab] = useState({});
  const [detailDatAssessmentPemeriksaanLab, setDetailDataAssessmentPemeriksaanLab] = useState(
    {}
  );





  // const handleConfirm = () => {
  //   if (confirmAction === "save") {
  //     AssessmentPemerikasaanValidation.handleSubmit()
  //       .then(() => {
  //         // Submission was successful
  //         setSnackbarMessage("Data berhasil disimpan.");
  //         setIsSnackbarOpen(true);
  //       })
  //       .catch((error) => {
  //         // Handle submission error
  //         setSnackbarMessage("Gagal menyimpan data.");
  //         setIsSnackbarOpen(true);
  //       });
  //   } else if (confirmAction === "cancel") {
  //     console.log("Canceling action...");
  //   }
  //   handleCloseDialog();
  // };
  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };
  const handleOpenDialog = (action) => {
    setIsDialogOpen(true);
    setConfirmAction(action);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (confirmAction === "save") {

      console.log("Saving data...");
      AssessmentPemerikasaanValidation.handleSubmit();
    } else if (confirmAction === "cancel") {

      console.log("Canceling action...");
    }
    handleCloseDialog();
  };

  const AssessmentPemerikasaanInitialValues = !isEditType
  ?  {
    nama_pemeriksaan: "",
    tarif_pemeriksaan: "",
    // diambil: null,
    jenis_pemeriksaan: { name: "", value: "" },
    // status_kehamilan:{ name: "", value: "" },
    // waktu_pemeriksaan: null,
  }: prePopulatedDataForm;

  const AssessmentPemerikasaanSchema = Yup.object({
    nama_pemeriksaan: Yup.string(),
    tarif_pemeriksaan: Yup.string(),
    jenis_pemeriksaan: Yup.object({
        value: stringSchema("Jenis Pemeriksaan", true),
      }),
    // diambil: dateSchema("Tanggal Pengambilan"),
    // waktu_pemeriksaan: dateSchema("Waktu Pemeriksaan"),
  });

  const AssessmentPemerikasaanValidation = useFormik({
    initialValues: AssessmentPemerikasaanInitialValues,
    validationSchema: AssessmentPemerikasaanSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let data = {
        nama_pemeriksaan: values.nama_pemeriksaan,
        tarif_pemeriksaan: values.tarif_pemeriksaan,
        diambil: formatIsoToGen(values.diambil),
        waktu_pemeriksaan: formatIsoToGen(values.waktu_pemeriksaan),
      };
      try {
        if (!isEditType) {
          await createAsesmenPemeriksaanLab(data);
          resetForm();
        } else {
          await updateAsesmenPemeriksaanLab({ ...data, id: detailPrePopulatedData.id });
          const response = await getDetailAsesmenPemeriksaanLab({
            id: detailPrePopulatedData.id,
          });
          updatePrePopulatedData({ ...response.data.data });
        }
        setSnackbar({
          state: true,
          type: "success",
          message: `"Assessment Pemerikasaan berhasil ${messageContext}!`,
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
          message: `Terjadi kesalahan, Assessment Pemerikasaan gagal ${messageContext}!`,
        });
      }
    },
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          sx={{
            padding: "16px",
            mb: "16px",
            mt: "16px",
          }}
        >
          <form onSubmit={AssessmentPemerikasaanValidation.handleSubmit}>
            <div className="mb-16">
              <TextField
                fullWidth
                id="nama_pemeriksaan"
                name="nama_pemeriksaan"
                label="Nama pemeriksaan"
                value={AssessmentPemerikasaanValidation.values.namaPemeriksaan}
                onChange={AssessmentPemerikasaanValidation.handleChange}
                error={AssessmentPemerikasaanValidation.touched.namaPemeriksaan && Boolean(AssessmentPemerikasaanValidation.errors.namaPemeriksaan)}
                helperText={AssessmentPemerikasaanValidation.touched.namaPemeriksaan && AssessmentPemerikasaanValidation.errors.namaPemeriksaan}

              />
            </div>
            <div className="mb-16">
            <SelectStatic
                  id="jenis_pemeriksaan"
                  handlerRef={AssessmentPemerikasaanValidation}
                  label="Jenis Pemeriksaan"
                  options={statusAlergi}
  
                />
            </div>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          sx={{
            padding: "16px",
            mb: "16px", // Add margin-bottom for spacing
            mt: "16px", // Add margin-top for spacing
          }}
        >
          <form onSubmit={AssessmentPemerikasaanValidation.handleSubmit}>
            <div className="mb-16">
              <TextField
                fullWidth
                id="tarif_pemeriksaan"
                name="tarif_pemeriksaan"
                label="Tarif Pemeriksaan"
                value={AssessmentPemerikasaanValidation.values.tarif_pemeriksaan}
                onChange={AssessmentPemerikasaanValidation.handleChange}
                error={AssessmentPemerikasaanValidation.touched.tarif_pemeriksaan && Boolean(AssessmentPemerikasaanValidation.errors.tarif_pemeriksaan)}
                helperText={AssessmentPemerikasaanValidation.touched.tarif_pemeriksaan && AssessmentPemerikasaanValidation.errors.tarif_pemeriksaan}

              />
            </div>
          </form>

        </Paper>
      </Grid>
      <Grid item xs={12} md={12}>
        <Grid container justifyContent="flex-end" spacing={2} sx={{ marginBottom: "16px" }}>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleOpenDialog("cancel")} 
            >
              BATAL
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton
              type="button"
              variant="contained"
              startIcon={<SaveIcon />}
              loading={AssessmentPemerikasaanValidation.isSubmitting}
              onClick={() => handleOpenDialog("save")}
            >
              SIMPAN
            </LoadingButton>
          </Grid>
        </Grid>
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogContent>
            {confirmAction === "save" && <p>Simpan data Assessment Pemerikasaan?</p>}
            {confirmAction === "cancel" && <p>Batal mengubah data Assessment Pemerikasaan?</p>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              TIDAK
            </Button>
            <Button onClick={handleConfirm} color="primary">
              YA
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Snackbar
        state={snackbar.state}
        setState={setSnackbar}
        message={snackbar.message}
        isSuccessType={snackbar.type === "success"}
        isErrorType={snackbar.type === "error"}
      />
    </Grid>
  );
};

export default FormAssessmentPemeriksaan;
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
import {getListAsesmenPasienLab, createAsesmenPasienLab, updateAsesmenPasienLab, getDetailAsesmenPasienLab} from "api/laboratorium";
import { formatIsoToGen } from "utils/formatTime";
import { statusAlergi, statusKehamilan } from "public/static/data";

import SelectStatic from "components/SelectStatic";


const FormAssessmentPasien = ({  
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
  const [dataAssessmentPasienLabPerPage, setAssessmentPasienLabPerPage] = useState(8);
  const [
    isLoadingDataAssessmentPasienLab,
    setIsLoadingDataAssessmentPasienLab,
  ] = useState(false);
  const [
    isUpdatingDataAssessmentPasienLab,
    setIsUpdatingDataAssessmentPasienLab,
  ] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const initDataAssessmentPasienLab = async () => {
    try {
      setIsLoadingDataAssessmentPasienLab(true);
      const params = {
        per_page: dataAssessmentPasienLabPerPage,
      };
      const response = await getListAsesmenPasienLab(params);
      const result = dataAssessmentPasienLabFormatHandler(response.data.data);
      // setDataPermintaanRadiologi(result);
      setDataMetaAssessmentPasienLab(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataAssessmentPasienLab(false);
    }
  };

  const updateDataAssessmentPasienLabHandler = async (payload) => {
    try {
      setIsUpdatingDataAssessmentPasienLab(true);
      const response = await getListAsesmenPasienLab(payload);
      const result = dataAssessmentPasienLabFormatHandler(response.data.data);
      // setDataPermintaanLab(result);
      setDataMetaAssessmentPasienLab(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataAssessmentPasienLab(false);
    }
  };

  // ASSESSMENT PASIEN 
  const [dataAssessmentPasienLab, setDataAssessmentPasienLab] = useState({});
  const [dataMetaAssessmentPasienLab, setDataMetaAssessmentPasienLab] = useState({});
  const [detailDatAssessmentPasienLab, setDetailDataAssessmentPasienLab] = useState(
    {}
  );





  // const handleConfirm = () => {
  //   if (confirmAction === "save") {
  //     AssessmentPasienValidation.handleSubmit()
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
      AssessmentPasienValidation.handleSubmit();
    } else if (confirmAction === "cancel") {

      console.log("Canceling action...");
    }
    handleCloseDialog();
  };

  const AssessmentPasienInitialValues = !isEditType
  ?  {
    no_wa: "",
    email: "",
    tanggal_pengambilan: null,
    waktu_pemeriksaan: null,
  }: prePopulatedDataForm;

  const AssessmentPasienSchema = Yup.object({
    no_wa: phoneNumberSchema(),
    email: Yup.string().email("Email tidak valid"),
    tanggal_pengambilan: dateSchema("Tanggal Pengambilan"),
    waktu_pemeriksaan: dateSchema("Waktu Pemeriksaan"),
  });

  const AssessmentPasienValidation = useFormik({
    initialValues: AssessmentPasienInitialValues,
    validationSchema: AssessmentPasienSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let data = {
        no_wa: values.no_wa,
        email: values.email,
        diambil: formatIsoToGen(values.diambil),
        waktu_pemeriksaan: formatIsoToGen(values.waktu_pemeriksaan),
      };
      try {
        if (!isEditType) {
          await createAsesmenPasienLab(data);
          resetForm();
        } else {
          await updateAsesmenPasienLab({ ...data, id: detailPrePopulatedData.id });
          const response = await getDetailAsesmenPasienLab({
            id: detailPrePopulatedData.id,
          });
          updatePrePopulatedData({ ...response.data.data });
        }
        setSnackbar({
          state: true,
          type: "success",
          message: `"Assessment Pasien berhasil ${messageContext}!`,
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
          message: `Terjadi kesalahan, Assessment Pasien gagal ${messageContext}!`,
        });
      }
    },
  });



  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            padding: "16px",
            mb: "16px",
            mt: "16px",
          }}
        >
          <form onSubmit={AssessmentPasienValidation.handleSubmit}>
            <div className="mb-16">
              <TextField
                fullWidth
                id="no_wa"
                name="no_wa"
                label="No. WhatsApp"
                value={AssessmentPasienValidation.values.noWhatsapp}
                onChange={AssessmentPasienValidation.handleChange}
                error={AssessmentPasienValidation.touched.noWhatsapp && Boolean(AssessmentPasienValidation.errors.noWhatsapp)}
                helperText={AssessmentPasienValidation.touched.noWhatsapp && AssessmentPasienValidation.errors.noWhatsapp}
              />
            </div>
            <div className="mb-16">
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={AssessmentPasienValidation.values.email}
                onChange={AssessmentPasienValidation.handleChange}
                error={AssessmentPasienValidation.touched.email && Boolean(AssessmentPasienValidation.errors.email)}
                helperText={AssessmentPasienValidation.touched.email && AssessmentPasienValidation.errors.email}
              />
            </div>
            <div className="mb-16">
              <DateTimePickerComp
                id="diambil"
                label="Tanggal Diambil"
                handlerRef={AssessmentPasienValidation}
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
          <form onSubmit={AssessmentPasienValidation.handleSubmit}>
            <div className="mb-16">
              <DateTimePickerComp
                id="waktu_pemeriksaan"
                label="Waktu Pemeriksaan"
                handlerRef={AssessmentPasienValidation}
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
              loading={AssessmentPasienValidation.isSubmitting}
              onClick={() => handleOpenDialog("save")}
            >
              SIMPAN
            </LoadingButton>
          </Grid>
        </Grid>
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogContent>
            {confirmAction === "save" && <p>Simpan data Assessment Pasien?</p>}
            {confirmAction === "cancel" && <p>Batal mengubah data Assessment Pasien?</p>}
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

export default FormAssessmentPasien;
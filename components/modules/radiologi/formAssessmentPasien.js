import { useEffect, useState } from "react";
import {
  Grid, Paper, TextField, Button, MenuItem, Dialog,
  DialogTitle,
  DialogContent, DialogActions
} from "@mui/material";
import DateTimePickerComp from "components/DateTimePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import Switch from "@mui/material/Switch";

const FormAssessmentPasien = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
      formik.handleSubmit();
    } else if (confirmAction === "cancel") {

      console.log("Canceling action...");
    }
    handleCloseDialog();
  };

  const initialValues = {
    metodePenyampaianHasil: "",
    noWhatsapp: "",
    email: "",
    diambil: null,
    statusAlergi: "",
    statusKehamilan: "",
    waktuPemeriksaan: null,
  };


  const validationSchema = Yup.object({
    metodePenyampaianHasil: Yup.string().required("Metode wajib dipilih"),
    noWhatsapp: Yup.string().when("metodePenyampaianHasil", {
      is: "WhatsApp",
      then: Yup.string()
        .matches(/^[0-9]+$/, "Nomor WhatsApp hanya boleh mengandung angka")
        .required("Nomor WhatsApp wajib diisi"),
    }),
    email: Yup.string().when("metodePenyampaianHasil", {
      is: "Email",
      then: Yup.string()
        .email("Email tidak valid")
        .required("Email wajib diisi"),
    }), diambil: Yup.string().when("metodePenyampaianHasil", {
      is: "Tanggal Diambil",
      then: Yup.date().required("Tanggal diambil wajib diisi"),
    }),
    statusAlergi: Yup.string().required("Status alergi wajib dipilih"),
    statusKehamilan: Yup.string().required("Status kehamilan wajib dipilih"),

    waktuPemeriksaan: Yup.date().required("Waktu pemeriksaan wajib diisi"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {

      console.log(values);
    },
  });

  const metodePenyampaianHasilOptions = ["WhatsApp", "Email", "Diambil"];
  const statusAlergiOptions = ["Ada", "Tidak Ada"];
  const statusKehamilanOptions = ["Ada", "Tidak Ada"];

  return (
    <Grid container spacing={2}>
      <Grid container justifyContent="flex-end" spacing={2} sx={{ marginTop: "12px", marginRight: "12px" }}>
        <Grid item>
          <Switch
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
          >
            Edit Data
          </Switch>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          sx={{
            padding: "16px",
            mb: "16px",
            mt: "16px",
            opacity: isEditing ? 1 : 0.5,
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-16">
              <TextField
                fullWidth
                id="noWhatsapp"
                name="noWhatsapp"
                label="No. WhatsApp"
                value={formik.values.noWhatsapp}
                onChange={formik.handleChange}
                error={formik.touched.noWhatsapp && Boolean(formik.errors.noWhatsapp)}
                helperText={formik.touched.noWhatsapp && formik.errors.noWhatsapp}
                disabled={!isEditing}
              />
            </div>
            <div className="mb-16">
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={!isEditing}
              />
            </div>
            <div className="mb-16">
              <DateTimePickerComp
                id="diambil"
                label="Tanggal Diambil"
                handlerRef={formik}
                disabled={!isEditing}
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
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-16">
              <TextField
                fullWidth
                select
                id="statusAlergi"
                name="statusAlergi"
                label="Status Alergi"
                value={formik.values.statusAlergi}
                onChange={formik.handleChange}
                error={formik.touched.statusAlergi && Boolean(formik.errors.statusAlergi)}
                helperText={formik.touched.statusAlergi && formik.errors.statusAlergi} disabled={!isEditing}

              >
                {statusAlergiOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}

                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="mb-16">
              <TextField
                fullWidth
                select
                id="statusKehamilan"
                name="statusKehamilan"
                label="Status Kehamilan"
                value={formik.values.statusKehamilan}
                onChange={formik.handleChange}
                error={formik.touched.statusKehamilan && Boolean(formik.errors.statusKehamilan)}
                helperText={formik.touched.statusKehamilan && formik.errors.statusKehamilan}
                disabled={!isEditing}
              >
                {statusKehamilanOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </div><div className="mb-16">
              <DateTimePickerComp
                id="waktuPemeriksaan"
                label="Waktu Pemeriksaan"
                handlerRef={formik}
                disabled={!isEditing}
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
              disabled={!isEditing} // Disable BATAL button when not in editing mode
            >
              BATAL
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton
              type="button"
              variant="contained"
              startIcon={<SaveIcon />}
              loading={formik.isSubmitting}
              onClick={() => handleOpenDialog("save")}
              disabled={!isEditing} // Disable SIMPAN button when not in editing mode
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
    </Grid>
  );
};

export default FormAssessmentPasien;
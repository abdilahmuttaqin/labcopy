import Dialog from "@mui/material/Dialog";
import React, { useState, useEffect } from "react";
import { getItem } from "utils/storage";
import { useRouter } from "next/router";
import { DialogContent, DialogTitle, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { getDetailPermintaanPemeriksaanLaboratorium, getListPermintaanPemeriksaanLaboratorium } from "api/laboratorium";

const DialogPermintaanLab = ({ state, setState }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(true);
  const [dataPermintaanLaboratorium, setDataPermintaanLaboratorium] = useState([]);

  useEffect(() => {
    // Fetch data from the endpoint
    const fetchData = async () => {
      try {
        // Use selectedData from router query instead of slug
        const response = await getDetailPermintaanPemeriksaanLaboratorium({ id: slug });
        const result = response.data.data.tindakan_permintaan;
        setDataPermintaanLaboratorium(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, []); // Add selectedData as a dependency

  const handleClose = () => {
    setState(false);
  };

  return (
    <Dialog open={state} onClose={handleClose}>
      <DialogTitle sx={{ paddingLeft: 2, paddingBottom: 1 }}>Detail Permintaan</DialogTitle>
      <Divider sx={{ borderWidth: "1px" }} />
      <DialogContent sx={{ paddingBottom: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Nama Pemeriksaan</TableCell>
                <TableCell align="center">Jenis Pemeriksaan</TableCell>
                <TableCell align="center">Tarif</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataPermintaanLaboratorium.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.nama_pemeriksaan}</TableCell>
                  <TableCell>{data.jenis_pemeriksaan}</TableCell>
                  <TableCell>{data.tarif}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPermintaanLab;

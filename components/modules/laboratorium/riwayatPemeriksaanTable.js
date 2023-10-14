import React from "react";
import { useRouter } from "next/router";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import Link from "next/link";

const RiwayatPemeriksaanTable = () => {
  const router = useRouter();
  const { selectedData } = router.query;

  const dataPermintaanRadiologi = [
    {
    },

  ];

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Tanggal Pemeriksaan</TableCell>
              <TableCell align="center">Nama Pemeriksaan</TableCell>
              <TableCell align="center">Jenis Pemeriksaan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPermintaanRadiologi.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.waktuPemeriksaan}</TableCell>
                <TableCell>{data.namaPemeriksaan}</TableCell>
                <TableCell>{data.jenisPemeriksaan}</TableCell>
                {/* <TableCell>
                  <Link
                    href={{
                      pathname: "components/modules/radiologi/detailRiwayat.js",
                      query: { data: JSON.stringify(data) },
                    }}
                    passHref
                  >
                    <Button variant="contained" color="primary">
                      Detail
                    </Button>
                  </Link>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RiwayatPemeriksaanTable;

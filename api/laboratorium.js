// utils/api/laboratorium.js
import request from "utils/request";

//Antrian Laboratorium
export function getListLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/permintaanlab`,
    method: "GET",
    params,
  });
}

export function getDetailPasienLab(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/permintaanlab/show`,
    method: "GET",
    params,
  });
}

export function searchLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/permintaanlab/search`,
    method: "GET",
    params,
  });
}

export function showLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/permintaanlab/show`,
    method: "GET",
    params,
  });
}

// Permintaan Tranfusi Darah
export function getListTransfusiDarah(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/transfusidarah`,
    method: "GET",
    params,
  });
}

//inventory Laboratorium
export function getListinventoryLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/inventorylab`,
    method: "GET",
    params,
  });
}

export function getDetailinventoryLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/inventorylaboratorium/show`,
    method: "GET",
    params,
  });
}

export function createinventoryLaboratorium(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/inventorylaboratorium`,
    method: "POST",
    data,
  });
}

export function updateinventoryLaboratorium(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/inventorylaboratorium`,
    method: "PATCH",
    data,
  });
}

//Permintaan Barang Laboratorium
export function getListPermintaanLab(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/baranglab`,
    method: "GET",
    params,
  });
}

export function createPermintaanLab(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/baranglab`,
    method: "POST",
    data,
  });
}

export function deletePermintaanLab(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/baranglab`,
    method: "DELETE",
    data,
  });
}

export function searchPermintaanLab(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/baranglab/search`,
    method: "GET",
    params,
  });
}

//Permintaan Pemeriksaan Laboratorium
export function getListPermintaanPemeriksaanLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/permintaanlab`,
    method: "GET",
    params,
  });
}

export function getDetailPermintaanPemeriksaanLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/permintaanlab/show`,
    method: "GET",
    params,
  });
}

//Hasil Pemeriksaan Laboratorium
export function getListHasilPemeriksaanLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/hasilpemeriksaanlaboratorium`,
    method: "GET",
    params,
  });
}

export function getDetailHasilPemeriksaanLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/hasilpemeriksaanlaboratorium/show`,
    method: "GET",
    params,
  });
}

//Asesmen Pasien Laboratorium
export function getListAsesmenPasienLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/asesmenpasienlaboratorium`,
    method: "GET",
    params,
  });
}

export function getDetailAsesmenPasienLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/asesmenpasienlaboratorium/show`,
    method: "GET",
    params,
  });
}

export function createAsesmenPasienLaboratorium(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/asesmenpasienlaboratorium`,
    method: "POST",
    data,
  });
}

export function updateAsesmenPasienLaboratorium(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/asesmenpasienlaboratorium`,
    method: "PATCH",
    data,
  });
}

//Asesmen Pemeriksaan Laboratorium
export function getListAsesmenPemeriksaanLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/asesmenpemeriksaanlaboratorium`,
    method: "GET",
    params,
  });
}

export function getDetailAsesmenPemeriksaanLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/asesmenpemeriksaanlaboratorium/show`,
    method: "GET",
    params,
  });
}

export function createAsesmenPemeriksaanLaboratorium(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/asesmenpemeriksaanlaboratorium`,
    method: "POST",
    data,
  });
}

export function updateAsesmenPemeriksaanLaboratorium(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/asesmenpemeriksaanlaboratorium`,
    method: "PATCH",
    data,
  });
}

//Prioritas Pemeriksaan Laboratorium
export function getListOptionPrioritas(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/prioritaspemeriksaanlaboratorium/list`,
    method: "GET",
    params,
  });
}

//Grouping Pemeriksaan Laboratorium
export function getDetailGroupingPemeriksaanLaboratorium(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/rs-service/groupingpemeriksaanlaboratorium/show`,
    method: "GET",
    params,
  });
}

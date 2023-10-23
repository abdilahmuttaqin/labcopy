import request from "utils/request";

export function getGudang(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/inventory-service/gudang`,
    method: "GET",
    params,
  });
}
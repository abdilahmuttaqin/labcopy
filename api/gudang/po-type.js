import request from "utils/request";

export function getPoType(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/inventory-service/potype`,
    method: "GET",
    params,
  });
}

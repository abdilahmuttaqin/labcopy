import request from 'utils/request';

export function getRetur(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/inventory-service/retur`,
    method: 'GET',
    params,
  });
}

export function getDetailRetur(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/inventory-service/retur/show`,
    method: 'GET',
    params,
  });
}
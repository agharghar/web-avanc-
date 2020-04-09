import http from "./httpservice";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "depots";

function depotUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getDepots() {
  return http.get(apiEndpoint, { withCredentials: true });
}

export function saveDepot(depot) {
  return http.post(apiEndpoint, depot, { withCredentials: true });
}

export function updateDepot(id, depot) {
  return http.put(depotUrl(id), depot, { withCredentials: true });
}

export function deleteDepot(id) {
  return http.delete(depotUrl(id), { withCredentials: true });
}
export function getDepot(id) {
  return http.get(depotUrl(id), { withCredentials: true });
}

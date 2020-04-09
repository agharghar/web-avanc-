import http from "./httpservice";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "fournisseurs";

function fournisseurUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getFournisseurs() {
  return http.get(apiEndpoint, { withCredentials: true });
}

export function getFournisseur(id) {
  return http.get(fournisseurUrl(id));
}

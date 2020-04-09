import http from "./httpservice";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "clients";

function clientUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getCients() {
  return http.get(apiEndpoint);
}

export function getMe() {
  return http.get(apiEndpoint + "/me", { withCredentials: true });
}

export function getMyCommands(id) {
  return http.get(apiEndpoint + "/commands/" + id, { withCredentials: true });
}

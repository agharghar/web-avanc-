import http from "./httpservice";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "clients";

function clientUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getClients() {
  return http.get(apiEndpoint, { withCredentials: true });
}

export function saveClient(client) {
  return http.post(apiEndpoint, client, { withCredentials: true });
}

export function updateClient(id, client) {
  return http.put(clientUrl(id), client, { withCredentials: true });
}

export function deleteClient(id) {
  return http.delete(clientUrl(id), { withCredentials: true });
}
export function getClient(id) {
  return http.get(clientUrl(id), { withCredentials: true });
}

export function getCommands(id) {
  return http.get(apiEndpoint + "/commands/" + id, { withCredentials: true });
}

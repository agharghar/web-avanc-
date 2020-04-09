import http from "./httpservice";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "commands";

function commandUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function saveCommand(commande) {
  const { data: command } = await http.post(apiEndpoint, commande, {
    withCredentials: true,
  });
}

export async function getCommands() {
  return await http.get(apiEndpoint, {
    withCredentials: true,
  });
}

export function getCommand(id) {
  return http.get(commandUrl(id), { withCredentials: true });
}

export function acceptCommand(id) {
  return http.put(
    apiEndpoint + "/AddLivraison/" + id,
    {},
    {
      withCredentials: true,
    }
  );
}

export function validate(id) {
  return http.put(
    apiEndpoint + "/validateLivraison/" + id,
    {},
    {
      withCredentials: true,
    }
  );
}

export function deleteCommand(id) {
  return http.delete(commandUrl(id), { withCredentials: true });
}

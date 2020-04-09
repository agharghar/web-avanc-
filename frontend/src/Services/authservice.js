import jwtDecode from "jwt-decode";
import http from "./httpservice";
import { apiUrl } from "../config.json";
import Cookies from "universal-cookie";

const apiEndpoint = apiUrl + "auth";
const tokenKey = "token";
const cookie = new Cookies();

export async function login(email, password) {
  const { data: token } = await http.post(apiEndpoint, { email, password });
  cookie.set(tokenKey, token.token, {
    path: "/",
    expires: new Date(Date.now() + 60 * 60 * 1000)
  });
  window.location.reload();
}
export function logout() {
  cookie.remove(tokenKey);
  window.location.reload();
}

export function getCurrentUser() {
  try {
    const jwt = cookie.get(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  getCurrentUser,
  logout
};

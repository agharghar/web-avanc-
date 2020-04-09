import http from "./httpservice";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "articles";

function articlesUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getArticles() {
  return http.get(apiEndpoint, { withCredentials: true });
}

export function saveArticle(article) {
  return http.post(apiEndpoint, article, { withCredentials: true });
}

export function updateArticle(id, article) {
  return http.put(articlesUrl(id), article, { withCredentials: true });
}

export function deleteArticle(id) {
  return http.delete(articlesUrl(id), { withCredentials: true });
}

export function getArticle(id) {
  return http.get(articlesUrl(id), { withCredentials: true });
}

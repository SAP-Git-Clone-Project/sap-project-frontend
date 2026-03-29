import { apiGet } from "./client";

export async function fetchDocumentById(documentId) {
  return apiGet(`/documents/${documentId}/`);
}

export async function fetchVersionsByDocumentId(documentId) {
  const versions = await apiGet("/versions/");
  return versions.filter((version) => version.document === documentId);
}
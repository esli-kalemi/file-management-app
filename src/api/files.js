import { apiRequest } from "./api";

export async function getFiles() {
  return apiRequest("/files?page=1&limit=100");
}

export async function uploadFile(file, folderId = null) {
  const formData = new FormData();

  formData.append("file", file);

  if (folderId !== null) {
    formData.append("folder_id", folderId);
  }

  return apiRequest("/files", {
    method: "POST",
    headers: {},
    body: formData
  });
}

export async function renameFile(id, originalName) {
  return apiRequest(`/files/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      original_name: originalName
    })
  });
}

export async function deleteFile(id) {
  return apiRequest(`/files/${id}`, {
    method: "DELETE"
  });
}

export function getDownloadUrl(id) {
  return `http://localhost:8080/files/${id}/download`;
}
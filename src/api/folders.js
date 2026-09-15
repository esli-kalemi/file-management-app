import { apiRequest } from "./api";

export async function getFolders() {
  return apiRequest("/folders?parent_id=root&page=1&limit=100");
}

export async function createFolder(name, parentId = null) {
  return apiRequest("/folders", {
    method: "POST",
    body: JSON.stringify({
      name,
      parent_id: parentId
    })
  });
}

export async function renameFolder(id, name) {
  return apiRequest(`/folders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name
    })
  });
}

export async function deleteFolder(id) {
  return apiRequest(`/folders/${id}`, {
    method: "DELETE"
  });
}
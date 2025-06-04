import api from "../api/apiCLient";

export const deleteFile = async (userId, fileId) => {
  return api.delete(`/user/files/${userId}/${fileId}`);
};
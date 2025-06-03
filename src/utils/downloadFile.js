
import api from '../api/apiCLient';

export const downloadFile = async (fileId, fileName) => {
  try {
    const res = await api.get(`/download/${fileId}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error('Download failed:', err);
    alert('Download failed. Please try again.');
  }
};

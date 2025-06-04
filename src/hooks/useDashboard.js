import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiCLient';
import { useAuth } from '../context/AuthContext';

export function useDashboard() {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    try {
      const res = await api.get(`user/files/${user.id}`);
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await api.post(`upload/${user.id}`, formData);
      setSelectedFile(null);
      fetchFiles();
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return {
    user,
    files,
    selectedFile,
    setSelectedFile,
    handleUpload,
    handleLogout,
  };
}

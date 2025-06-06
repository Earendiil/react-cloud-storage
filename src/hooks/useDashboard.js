import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { deleteAccount } from '../api/apiCLient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export function useDashboard() {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const expiryTimeout = useRef({});

  const fetchFiles = async () => {
    try {
      const res = await api.get(`user/files/${user.id}`);
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  const handleUpload = async (e) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    e.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File size exceeds 5MB. Please choose a smaller file.");
      return;
  }
    formData.append('file', selectedFile);

    try {
      await api.post(`upload/${user.id}`, formData);
      setSelectedFile(null);
      fetchFiles();
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };


  const handleDelete = async (fileId) => {
  try {
    await api.delete(`/user/files/${user.id}/${fileId}`);
    setFiles(prevFiles => prevFiles.filter(file => file.fileId !== fileId));
  } catch (err) {
    console.error('Delete failed:', err);
  }
};


const confirmDelete = (fileId, fileName) => {
  if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
    handleDelete(fileId);
  }
};

 const handleExpiryChange = (fileId, newDate) => {
    if (expiryTimeout.current[fileId]) {
      clearTimeout(expiryTimeout.current[fileId]);
    }

    expiryTimeout.current[fileId] = setTimeout(async () => {
      try {
        const isoDate = new Date(newDate).toISOString();

        await api.put(`/files/${fileId}/expiry`, {
          expiryDate: isoDate,
        });

        setFiles(prevFiles =>
          prevFiles.map(file =>
            file.fileId === fileId ? { ...file, expiryDate: isoDate } : file
          )
        );

        toast("Expiry date updated");
      } catch (error) {
        console.error(error);
        toast.error("Error updating expiry date");
      }
    }, 500); // 0.5 seconds
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = async(userId) =>{
   const confirmed = window.confirm("Are you sure you want to delete your account and files? This action cannot be undone.");
  if (confirmed) {
    try {
      await deleteAccount();
      localStorage.clear(); // logout cleanup
      navigate('/login');
    } catch (error) {
      alert("Failed to delete account.");
      console.error(error);
    }
  }
};


  useEffect(() => {
    fetchFiles();
  }, []);

  
  return {
    user,
    files,
    setFiles,
    selectedFile,
    handleDelete,
    confirmDelete,
    setSelectedFile,
    handleUpload,
    handleLogout,
    handleExpiryChange,
    handleDeleteAccount,
  };
}

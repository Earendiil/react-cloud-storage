import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiCLient';
import { downloadFile } from '../utils/downloadFile';

export default function DashboardPage() {
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

  return (
    <div className="min-h-screen bg-gray-500 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-orange-100 rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.username}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
        >
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="block w-full sm:w-auto border bg-amber-50 border-gray-500 rounded-md p-2 text-sm file:mr-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Upload
          </button>
        </form>

        {/* Files List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Files
          </h2>
          {files.length > 0 ? (
            <ul className="space-y-4">
              {files.map((file) => (
                <li
                  key={file.fileId}
                  className="flex justify-between items-center bg-green-400 p-4 rounded-lg"
                >
                  <div >
                    <p className="font-medium text-gray-800 bg">
                      {file.fileName}
                    </p>
                    <p className="text-sm text-gray-900">
                      {(file.size / 1024).toFixed(1)} KB •{' '}
                      {new Date(file.uploadDate).toLocaleString()}
                    </p>
                  </div>
                  <button 
                      onClick={() => downloadFile(file.fileId, file.fileName)}
                      className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition"
                    >
                      Download
                  </button>

                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No files uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

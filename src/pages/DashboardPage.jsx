import { useState } from 'react';
import { downloadFile } from '../utils/downloadFile';
import { useDashboard } from '../hooks/useDashboard';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

export default function DashboardPage() {
  const {
    user,
    files,
    selectedFile,
    setFiles,
    setSelectedFile,
    totalSize,
    MAX_TOTAL_SIZE,
    handleUpload,
    handleLogout,
    handleDelete,
    handleExpiryChange,
    handleDeleteAccount,
  } = useDashboard();

  const navigate = useNavigate();

  const [fileToDelete, setFileToDelete] = useState(null);
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);

  const confirmFileDelete = (file) => setFileToDelete(file);
  const confirmAccountDelete = () => setShowAccountDeleteModal(true);

  return (
  <div className="min-h-screen py-6 px-3 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-orange-100 rounded-2xl shadow-md p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Welcome, {user.username}
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/change-password')}
            className="w-full sm:w-auto bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
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
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </form>

      {/* Files List */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
          Your Files
        </h2>
        <div className="text-sm text-gray-600 mb-2">
          Storage used:&nbsp;
          <span
            className={`font-medium ${
              totalSize / MAX_TOTAL_SIZE > 0.9 ? 'text-red-600' : 'text-gray-800'
            }`}
          >
            {(totalSize / (1024 * 1024)).toFixed(2)} MB /{' '}
            {(MAX_TOTAL_SIZE / (1024 * 1024)).toFixed(0)} MB
          </span>
        </div>
        {files.length > 0 ? (
          <ul className="space-y-4">
            {files.map((file) => (
              <li
                key={file.fileId}
                className="flex flex-col sm:flex-row sm:justify-between bg-green-400 p-4 rounded-lg gap-4 overflow-x-hidden"
              >
                <div className="flex flex-col">
                  <p className="font-medium text-gray-800 break-words">{file.fileName}</p>
                  <p className="text-sm text-gray-900">
                    {(file.size / 1024).toFixed(1)} KB •{' '}
                    {new Date(file.uploadDate).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  {/* Expiry Input */}
                  <div className="flex flex-col sm:items-end space-y-1 text-sm w-full sm:w-auto">
                    <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded whitespace-nowrap">
                      Expires at: {new Date(file.expiryDate).toLocaleDateString()}
                    </div>
                    <input
                      type="date"
                      className="text-xs border rounded px-2 py-1 w-full sm:w-auto"
                      min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      max={new Date(
                        new Date(file.uploadDate).getTime() + 30 * 24 * 60 * 60 * 1000
                      ).toISOString().split('T')[0]}
                      value={
                        file.expiryDate
                          ? new Date(file.expiryDate).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) => handleExpiryChange(file.fileId, e.target.value)}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => downloadFile(file.fileId, file.fileName)}
                      className="bg-blue-600 text-white text-sm px-3 py-2 rounded w-full sm:w-auto hover:bg-blue-700 transition"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => confirmFileDelete(file)}
                      className="bg-red-500 text-white text-sm px-3 py-2 rounded w-full sm:w-auto hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No files uploaded yet.</p>
        )}
      </div>
    </div>

    {/* Delete Account Button */}
    <div className="mt-10 flex justify-center px-2">
      <button
        onClick={confirmAccountDelete}
        className="w-full sm:w-auto bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
      >
        Delete My Account
      </button>
    </div>

    {/* Confirm Modals */}
    {fileToDelete && (
      <ConfirmModal
        message={`Are you sure you want to delete "${fileToDelete.fileName}"?`}
        onConfirm={() => {
          handleDelete(fileToDelete.fileId);
          setFileToDelete(null);
        }}
        onCancel={() => setFileToDelete(null)}
      />
    )}

    {showAccountDeleteModal && (
      <ConfirmModal
        message="Are you sure you want to delete your account and files? This action cannot be undone."
        onConfirm={() => {
          handleDeleteAccount();
          setShowAccountDeleteModal(false);
        }}
        onCancel={() => setShowAccountDeleteModal(false)}
      />
    )}
  </div>
);

}

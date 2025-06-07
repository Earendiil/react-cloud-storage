import { downloadFile } from '../utils/downloadFile';
import { useDashboard } from '../hooks/useDashboard';
import { useNavigate } from 'react-router-dom';
import { deleteFile } from '../utils/deleteFile';
import api from '../api/apiCLient';





export default function DashboardPage() {
  const {
    user,
    files,
    selectedFile,
    setFiles,
    setSelectedFile,
    handleUpload,
    handleLogout,
    confirmDelete,
    handleExpiryChange,
    handleDeleteAccount,
  } = useDashboard();

  const navigate = useNavigate();

 

  return (
    <div className="min-h-screen bg-gray-500 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-orange-100 rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.username}
          </h1>
           <button
          onClick={() => navigate('/change-password')}
          className="cursor-pointer bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          Change Password
        </button>
          <button
            onClick={handleLogout}
            className="cursor-pointer align- bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
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
            className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
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
                <div>
                  <p className="font-medium text-gray-800">{file.fileName}</p>
                  <p className="text-sm text-gray-900">
                    {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadDate).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                  {/* Expires At Box */}
                <div className="flex flex-col items-end space-y-1 text-sm">
                  <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded whitespace-nowrap">
                    Expires at: {new Date(file.expiryDate).toLocaleDateString()}
                  </div>
                  <input
                    type="date"
                    className="cursor-pointer text-xs border rounded px-1"
                    min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    max={new Date(new Date(file.uploadDate).getTime() + 30 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]}
                    value={file.expiryDate ? new Date(file.expiryDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleExpiryChange(file.fileId, e.target.value)}
                  />
                </div>


                  {/* Action Buttons */}
                  <button
                    onClick={() => downloadFile(file.fileId, file.fileName)}
                    className="cursor-pointer text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => confirmDelete(file.fileId, file.fileName)}
                    className="cursor-pointer text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </li>


              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No files uploaded yet.</p>
          )}
        </div> 
       
      </div>
      <div className="cursor-pointer mt-10 flex justify-center">
          <button
            onClick={handleDeleteAccount}
            className="cursor-pointer bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
          >
            Delete My Account
          </button>
        </div>
    </div>
  );
}

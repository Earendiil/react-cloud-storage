import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/apiCLient';
import { toast } from 'react-toastify';

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validatePasswords = () => {
    const errors = {};
    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword) errors.oldPassword = 'Old password is required.';
    if (!newPassword || newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword)) {
      errors.newPassword =
        'New password must be at least 8 characters and contain at least one letter.';
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'New password and confirm password do not match.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const errors = validatePasswords();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
        await api.put(`user/${user.id}`, formData);
        toast.success('Password updated successfully!');
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        navigate('/dashboard');
    } catch (error) {
        console.error('Error response:', error.response);

        const errors = error.response?.data?.errors;

        if (errors?.confirmPassword === 'Current password is incorrect!') {
          setFormErrors({ oldPassword: 'Old password is incorrect.' });
        } else if (errors?.confirmPassword) {
          toast.error(errors.confirmPassword);
        } else {
          toast.error('Something went wrong.');
        }
      }

  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div>
            <input
              name="oldPassword"
              type="password"
              placeholder="Old Password"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              required
            />
            {formErrors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">{formErrors.oldPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <input
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              required
            />
            {formErrors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{formErrors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              required
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </form>

        {/* Back Button */}
        <p className="mt-4 text-center text-gray-600">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>
        </p>
      </div>
    </div>
  );
}

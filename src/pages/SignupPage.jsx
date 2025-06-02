import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/create', formData);
      toast.success('Account created! You can now log in.');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Registration failed.');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          required
        /><br/>
        <input
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          required
        /><br/>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;

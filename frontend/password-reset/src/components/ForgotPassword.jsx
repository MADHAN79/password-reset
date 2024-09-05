import { useState } from 'react';
import axios from 'axios'; // Fix Axios import

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call backend API to request password reset link
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      setError(''); // Clear error if the request was successful
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred.');
      setMessage(''); // Clear message if an error occurs
    }
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Send Reset Link</button>
      </form>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default ForgotPassword;

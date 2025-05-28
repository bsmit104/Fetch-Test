/* global React, axios */

const { useState, useCallback } = React;

function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    try {
      await axios.post('https://frontend-take-home-service.fetch.com/auth/login', { name, email }, { withCredentials: true });
      onLogin();
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err.message, err.stack);
    }
  }, [name, email, onLogin]);

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-[37.5%] flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white p-10 border-2 border-teal-300 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-3xl font-semibold mb-8 text-center text-teal-700">Dog Adoption Portal</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-800">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
            </div>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg hover:bg-teal-600 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:block w-0 md:w-[62.5%] relative">
        <img
          src="assets/dog.jpg"
          alt="Dog"
          className="absolute inset-0 w-full h-full object-cover object-left"
        />
      </div>
    </div>
  );
}

window.Login = Login;
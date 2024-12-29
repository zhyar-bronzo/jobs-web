import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthRedirect from './ChekingAuth';
import { Slide, ToastContainer, toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import './tailwind.css';
import { GiHamburgerMenu } from 'react-icons/gi';
import './Navbar.css';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import { auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from './FirebaseService';
import { FaGoogle } from 'react-icons/fa';

const LoginForm = () => {
  useAuthRedirect();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await axios.post("http://localhost:3500/login", { email, password }, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        navigate('/');
      }
    } catch (err) {
      setMessage("Login failed, Invalid credentials");
      toast.error('Login failed, Invalid credentials', { transition: Slide });
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const response = await axios.post("http://localhost:3500/googleauth", { email: result.user.email }, { headers: { Authorization: `Bearer ${idToken}` }, withCredentials: true })

      console.log(`response.status: ${response.status}`);

      if (response.status === 200) {
        console.log(`response.status === 200`);
        navigate('/jobs');
      } else if (response.status === 201) {
        console.log(`response.status === 201`);
        navigate(`/SignUpGoogle?email=${encodeURIComponent(result.user.email)}&displayName=${encodeURIComponent(result.user.displayName)}`);
      }
    } catch (err) {
      toast.error(`${err.message}`, { transition: Slide });
      console.error(err);
    }
  }

  return (
    <><div>
      <nav style={{ padding: '20px' }} className="navbar">
        <a className='text-decoration-none' href="/jobs"><div className="navbar-logo">Job Finder</div></a>

        {/* For larger screens, navigation links */}
        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="/jobs">Jobs</a>
          <a href="/aboutposting">Post a Job</a>
          <a href="#cv">Create a CV</a>
          <a href="/aboutus">About Us</a>
        </div>

        {/* User Dropdown */}
        <div className="user-dropdown">
          <button className="dropdown-btn" onClick={toggleDropdown}>
            <i className="fas fa-user me-2"></i> guest
          </button>
          <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
            <>
              <a href="/login"><i class="fa-solid fa-right-to-bracket me-2"></i> Login</a>
              <a href="/signup"><i class="fa-solid fa-user-plus me-2"></i> signup</a>
            </>
          </div>
        </div>

        {/* Hamburger menu for smaller screens */}
        <GiHamburgerMenu
          className="hamburger-icon"
          onClick={toggleSidebar}
          size={35}
        />

        {/* Sidebar for mobile */}
        <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
          <div style={{ marginRight: '20px' }} className="sidebar-header">
            <span></span>
            <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
          </div>
          <a href="#home">
            <i className="fa-solid fa-house me-2"></i> Home
          </a>
          <a href="#jobs">
            <i className="fas fa-briefcase me-2"></i> Jobs
          </a>
          <a href="#post">
            <i className="fa-solid fa-plus me-2"></i> Post a Job
          </a>
          <a href="#cv">
            <i className="fas fa-file-alt me-2"></i> Create a CV
          </a>
          <a href="#about">
            <i className="fas fa-info-circle me-2"></i> About Us
          </a>
        </div>
      </nav>
    </div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

          {/* Google Sign In Button */}
          <button onClick={handleGoogleLogin} className="w-full mb-4 flex items-center justify-center gap-2 bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <FaGoogle />
            <span>Sign in with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="bg-white px-4 text-sm text-gray-500 absolute">or</span>
          </div>

          <form className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  value={email} onChange={(e) =>
                    setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete='off'
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password" name='password'
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="/passwordreset" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </a>
          </p>
          <ToastContainer position='top-right' />
        </div>
      </div>
    </>
  );
};

export default LoginForm;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthRedirect from './ChekingAuth';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import { auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from './FirebaseService';
import { FaGoogle, FaBriefcase, FaFileAlt, FaInfoCircle } from 'react-icons/fa';

const LoginForm = () => {
  useAuthRedirect();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

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
      <header>
        <nav className="navbar">
          {/* Hamburger Menu */}
          <div className="hamburger-menu" onClick={toggleSidebar}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>

          {/* Text in the middle */}
          <div style={{ color: 'white' }} className="navbar-text">Job Finder</div>

          {/* Logo on the right */}
          <div className="logo">
            <img src="logo.png" alt="Logo" width="100" height="100" />
          </div>
        </nav>

        {/* Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
          <div className="close-btn" onClick={closeSidebar}>×</div> {/* Cross Button */}
          <ul>
            <li><a href="/"><i class="fa-solid fa-house"></i>Home</a></li>
            <li><a href="/jobs"><FaBriefcase /> Jobs</a></li>
            <li><a href="#"><FaFileAlt /> Create Your CV</a></li>
            <li><a href="/addjob"><i class="fa-solid fa-plus"></i> Post a Job</a></li>
            <li><a href="#"><FaInfoCircle /> About Us</a></li>
          </ul>
          <div className="auth-buttons">
            <button className="auth-btn signup-btn"><a style={{ textDecoration: 'none', color: 'white' }} href="/signup">Signup</a></button>
            <button className="auth-btn signin-btn"><a style={{ textDecoration: 'none', color: 'white' }} href="/login">Sign In</a></button>
          </div>
        </div>

        {/* Overlay for closing sidebar when clicked outside */}
        {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
      </header>
    </div>
      <div style={{ marginTop: '60px' }} className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-4" style={{ maxWidth: '450px', width: '100%' }}>
          <h3 className="text-center mb-4">Login</h3>
          {message && <p className="alert alert-danger text-center">{message}</p>}
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label"><i class="fa-duotone fa-solid fa-envelope me-2 mb-1"></i>Email</label>
              <div style={{ height: '40px' }} className="input-group">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete='off'
                  required />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label"> <i class="fa-solid fa-lock me-2 mb-1"></i>Password</label>
              <div style={{ height: '40px' }} className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  name='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePassword}
                >
                  {showPassword ? <i class="fa-duotone fa-regular fa-eye-slash "></i> : <i class="fa-solid fa-eye"></i>}
                </button>
              </div>
            </div>
            <div className="mb-3 text-end">
              <a href="/passwordreset" className="text-decoration-none">Forgot Password?</a>
            </div>
            <div className="text-center">
              <button onClick={handleLogin} type="submit" className=" btn btn-primary font-weight-bold w-100 mb-3">
                Sign in
              </button>
            </div>
            <ToastContainer position='top-right' />
            <div className="d-flex align-items-center justify-content-center mb-3">
              <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
              <small className="mx-3 mb-0">OR</small>
              <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
            </div>
            <div className='text-center'>
              <button onClick={handleGoogleLogin} type="button" className="btn btn-danger w-100">
                <FaGoogle className="me-2" /> Login with Google
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p className="mb-0">
              Don't have an account?{' '}
              <a href="/signup" className="text-decoration-none">Sign up here</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;

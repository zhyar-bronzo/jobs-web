import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import './home.css';
import './tailwind.css';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { GiHamburgerMenu } from 'react-icons/gi';
import './Navbar.css';
import axios from 'axios';

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [scrollProgress, setScrollProgress] = useState(0); // State for scroll progress
    const [showSidebar, setShowSidebar] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const deleteCookie = (name) => {
        document.cookie = `${name}=; Max-Age=0; path=/;`;
    };

    const logout = () => {
        signOut(auth)
            .then(() => {
                deleteCookie('idToken');
                console.log("User logged out");
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    };

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        setScrollProgress(scrollPercent);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                console.log('Firebase user:', firebaseUser);
                try {
                    const response = await axios.post(
                        "http://localhost:3500/checkAuth",
                        { uid: firebaseUser.uid },
                        { withCredentials: true }
                    );

                    console.log(`Firebase user response status: ${response.status}`);
                    if (response.status === 200) {
                        console.log("Authenticated user");
                        setUser(firebaseUser);
                    } else if (response.status === 404) {
                        console.log("User not authenticated or profile not complete");
                        setUser(false);
                    } else {
                        console.log(`Unexpected status code: ${response.status}`);
                        setUser(false);
                    }
                } catch (error) {
                    console.error(`Error checking authentication: ${error.message}`);
                    setUser(false);
                }
            } else {
                console.log("No user signed in");
                setUser(false);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    function navToJobs() {
        navigate('/jobs');
    }

    return (
        <div>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: `${scrollProgress}%`, // Set width based on scroll progress
                    height: '4px',
                    backgroundColor: '#007bff',
                    zIndex: 9999,
                    transition: 'width 0.1s ease-out',
                }}
            ></div>
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
                        {user ? (
                            <>
                                <i className="fa-solid fa-user me-2"></i>
                                {(user.displayName?.split(" ")[0])}
                            </>
                        ) : (
                            <div>
                                <i className="fa-solid fa-user me-2"></i>
                                guest
                            </div>
                        )}
                    </button>
                    <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                        {user ? (
                            <>
                                <a href="/settings"><i class="fa-solid fa-gear me-2"></i> Settings</a>
                                <a href="/savedjobs"><i class="fa-solid fa-bookmark me-2"></i> Your Saves</a>
                                <a href="/logout" onClick={logout}><i class="fa-solid fa-right-from-bracket me-2"></i> Logout</a>
                            </>
                        ) : (
                            <>
                                <a href="/login"><i class="fa-solid fa-right-to-bracket me-2"></i> Login</a>
                                <a href="/signup"><i class="fa-solid fa-user-plus me-2"></i> signup</a>
                            </>
                        )}
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
            <div
                className="d-flex align-items-center justify-content-center text-center text-white bg-dark"
                style={{
                    minHeight: '100vh', // Ensure the div takes up at least the full viewport height
                    background: "url('background-image.jpg') no-repeat center center / cover",
                }}
            >
                <div className="p-5 bg-dark bg-opacity-75 rounded">
                    <h1 style={{ fontSize: '3.5rem' }} className="display-4 fw-bold">Discover Your Dream Job</h1><br />
                    <p style={{ maxWidth: '870px' }} className="lead">
                        Explore exciting career opportunities and take the next step in your professional journey.
                        Whether you're looking for remote work, part-time, or full-time positions, we've got you covered.
                    </p>
                    <br />
                    <p>
                        Browse through a variety of job listings, and find the perfect match that fits your skills and aspirations.
                    </p>

                    <button
                        className="cool-btn mt-3"
                        onClick={navToJobs}
                    >
                        View Jobs
                    </button><br /><br />
                    <p>You can <a style={{ color: '#007bff' }} href="/login">Login</a> or <a style={{ color: '#007bff' }} href="/signup">Signup</a> or Continue as Guest</p>
                </div>
            </div>

            {/* Image and Text Sections */}
            <div className='contentandimgs'>
                <div className="container">
                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <div className="flex-grow-1 mt-5 border-bottom border-2" style={{ height: '2px' }}></div>
                        <h2 style={{ fontSize: '2rem' }} className="mx-3 mt-5 mb-0 fw-bold">Why Choose Us</h2>
                        <div className="flex-grow-1  mt-5 border-bottom border-2" style={{ height: '2px' }}></div>
                    </div>
                    <br />
                    <div className="row align-items-center mb-5">
                        <div className="col-md-6">
                            <img src="7.webp" alt="Job Search" className="img-fluid rounded" />
                        </div>
                        <div className="col-md-6">
                            <h2 className="mb-3 mb-sm-4 mb-md-0"> Tired of looking for a job?</h2>
                            <p>
                                Finding the right job can feel exhausting, going from place to place, applying endlessly, and facing rejections. With us, you don’t need to struggle anymore. Our platform connects you directly to top employers, saving you time, effort, and stress. Let us make your job search easier and more effective.
                            </p>
                        </div>
                    </div>
                    <div className="row align-items-center ">
                        <div className="col-md-6 order-md-2">
                            <img src="workfromhome.jpg" alt="Career Growth" className="img-fluid rounded mb-5" />
                        </div>
                        <div className="col-md-6 order-md-1">
                            <h2 className="mb-3 mb-sm-4 mb-md-0">Find Jobs Easier</h2>
                            <p>
                                On our website, you can filter jobs based on your preferences, whether it’s the job type, location, salary, or industry. This makes it simple to find opportunities that match your skills and needs, all in one place. Start searching today and discover how easy job hunting can be!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <div className="footer-container">
                    {/* Main Content */}
                    <div className="footer-main">
                        {/* Left Section */}
                        <div className="footer-about">
                            <h3 className="footer-title">
                                About Us
                                <span className="title-underline"></span>
                            </h3>
                            <p className="footer-description">
                                We are dedicated to delivering exceptional digital experiences through innovative solutions and cutting-edge technology, empowering businesses to thrive.
                            </p>
                        </div>

                        {/* Right Section - Quick Links */}
                        <div className="footer-links">
                            <div className="footer-links-row">
                                {['Products', 'Resources'].map((section) => (
                                    <div key={section} className="footer-section">
                                        <h4 className="section-title">
                                            {section}
                                            <span className="title-underline"></span>
                                        </h4>
                                        <nav className="section-links">
                                            {['Link 1', 'Link 2', 'Link 3', 'Link 4'].map(item => (
                                                <a key={item} href="#" className="footer-link">
                                                    <span className="link-bullet"></span>
                                                    {item}
                                                </a>
                                            ))}
                                        </nav>
                                    </div>
                                ))}
                            </div>
                            <div className="footer-section company-section">
                                <h4 className="section-title">
                                    Company
                                    <span className="title-underline"></span>
                                </h4>
                                <nav className="section-links">
                                    {['Link 1', 'Link 2', 'Link 3', 'Link 4'].map(item => (
                                        <a key={item} href="#" className="footer-link">
                                            <span className="link-bullet"></span>
                                            {item}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="social-section">
                        <span className="social-text">Follow us on:</span>
                        <div className="social-icons">
                            {[
                                { Icon: Instagram, color: '#E4405F' },
                                { Icon: Facebook, color: '#1877F2' },
                                { Icon: Twitter, color: '#1DA1F2' }
                            ].map(({ Icon, color }, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="social-icon"
                                    style={{ '--hover-color': color }}
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="footer-bottom">
                        <div className="logo">LC</div>
                        <div className="copyright">
                            © 2024 Your Company. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home
import React, { useEffect, useState } from 'react'
import { FaBriefcase, FaFileAlt, FaPlusCircle, FaHome, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import './home.css';
import axios from 'axios';

const Home = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [scrollProgress, setScrollProgress] = useState(0); // State for scroll progress
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

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
                    <div className="close-btn" onClick={closeSidebar}>×</div>
                    <ul>
                        {user ? (
                            <>
                                <li><a href="/"><FaHome /> Home</a></li>
                                <li><a href="/jobs"><FaBriefcase /> Jobs</a></li>
                                <li><a href="#"><FaFileAlt /> Create Your CV</a></li>
                                <li><a href="/aboutposting"><FaPlusCircle /> Post a Job</a></li>
                                <li><a href="#"><FaInfoCircle /> About Us</a></li>
                                <li><a href="#"><FaInfoCircle /> Account Settings</a></li>
                                <li><a className="btn btn-danger" onClick={logout} href="#"><FaInfoCircle /> Logout</a></li>
                            </>
                        ) : (
                            <>
                                <li><a href="/"><FaHome /> Home</a></li>
                                <li><a href="/jobs"><FaBriefcase /> Jobs</a></li>
                                <li><a href="#"><FaFileAlt /> Create Your CV</a></li>
                                <li><a href="/aboutposting"><FaPlusCircle /> Post a Job</a></li>
                                <li><a href="#"><FaInfoCircle /> About Us</a></li>
                                <div className="auth-buttons">
                                    <button className="auth-btn signup-btn"><a style={{ textDecoration: 'none', color: 'white' }} href="/signup">Signup</a></button>
                                    <button className="auth-btn signin-btn"><a style={{ textDecoration: 'none', color: 'white' }} href="/login">Sign In</a></button>
                                </div>
                            </>
                        )}
                    </ul>
                </div>
                {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
            </header><br /><br />

            <div
                className="d-flex align-items-center justify-content-center text-center text-white bg-dark"
                style={{
                    minHeight: '100vh', // Ensure the div takes up at least the full viewport height
                    background: "url('background-image.jpg') no-repeat center center / cover",
                    paddingTop: '3rem', // Adds space above the content, useful for smaller screens with a navbar
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
            <div className="container my-5">
                <div className="d-flex align-items-center justify-content-center mb-4">
                    <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
                    <h2 className="mx-3 mb-0 fw-bold">Why Choose Us</h2>
                    <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
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
                <div className="row align-items-center">
                    <div className="col-md-6 order-md-2">
                        <img src="workfromhome.jpg" alt="Career Growth" className="img-fluid rounded" />
                    </div>
                    <div className="col-md-6 order-md-1">
                        <h2 className="mb-3 mb-sm-4 mb-md-0">Find Jobs Easier</h2>
                        <p>
                            On our website, you can filter jobs based on your preferences, whether it’s the job type, location, salary, or industry. This makes it simple to find opportunities that match your skills and needs, all in one place. Start searching today and discover how easy job hunting can be!
                        </p>
                    </div>
                </div>
            </div>


            <footer className="bg-dark text-white pt-3">
                <div className="container">
                    <div className="row pt-2">
                        <div className="col-md-3">
                            <h5>About Us</h5>
                            <p>
                                We connect you to your dream job by offering tailored job listings
                                and a seamless application process.
                            </p>
                            <img
                                src="favicon.ico"
                                alt="Logo"
                                className="img-fluid mt-3"
                                style={{ maxWidth: "150px", display: "block", margin: "0 auto" }}
                            />
                        </div>

                        <div className="col-md-3">
                            <h5>Company</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        Our Services
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        Affiliate Program
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="col-md-3 ">
                            <h5>Get Help</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        Shipping
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        Returns
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        Order Status
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        Payment Options
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="col-md-3">
                            <h5>Online Shop</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        Watch
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        Bag
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        Shoes
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-white text-decoration-none">
                                        Dress
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-md-12 text-end">
                            <h5>Follow Us</h5>
                            <div className="d-flex justify-content-end align-items-center">
                                <a
                                    href="#"
                                    className="text-white me-3"
                                    style={{ fontSize: "1.8rem" }}
                                >
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a
                                    href="#"
                                    className="text-white me-3"
                                    style={{ fontSize: "1.8rem" }}
                                >
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a
                                    href="#"
                                    className="text-white me-3"
                                    style={{ fontSize: "1.8rem" }}
                                >
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="text-white" style={{ fontSize: "1.8rem" }}>
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>
                    </div>


                    <hr className="border-light" />
                    <div className="text-center pb-1">
                        <p>2024 &copy; All Rights Reserved to Zhyar</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home
import React, { useState, useEffect } from "react";
import './Navbar.css';
import { GiHamburgerMenu } from 'react-icons/gi';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import axios from 'axios';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

const Aboutus = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
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
                // Redirect to a different page or update the UI accordingly
            })
            .catch((error) => {
                // An error happened
                console.error("Error signing out: ", error);
            });
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

    return (
        <div>
            <nav style={{ padding: '20px' }} className="navbar">
                <a className='text-decoration-none' href="/jobs"><div className="navbar-logo">Job Finder</div></a>

                {/* For larger screens, navigation links */}
                <div className="navbar-links">
                    <a href="/">Home</a>
                    <a href="/jobs">Jobs</a>
                    <a href="/aboutposting">Post a Job</a>
                    <a href="#cv">Create a CV</a>
                    <a href="#about">About Us</a>
                </div>

                {/* User Dropdown */}
                <div className="user-dropdown">
                    <button className="dropdown-btn" onClick={toggleDropdown}>
                        {user ? (
                            <>
                                <i className="fa-solid fa-user me-2"></i>
                                {(user.displayName?.split(" ")[0]) || 'guest'}
                            </>
                        ) : (
                            'guest'
                        )}
                    </button>
                    <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                        {user ? (
                            <>
                                <a href="#profile"><i class="fa-solid fa-gear me-2"></i> Settings</a>
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

            <div className="container py-5">
                {/* Hero Section */}
                <div className="text-center mb-5">
                    <h1 className="display-4 mb-4 text-white fw-bold">Welcome to Job Finder</h1>
                    <p className="lead text-light">Connecting talent with opportunities across our nation</p>
                    <hr className="my-4 border-secondary" />
                </div>

                {/* Mission & What We Offer Section */}
                <div className="row g-4 mb-5">
                    <div className="col-md-6">
                        <div style={{ height: '800px' }} className="card bg-dark border border-secondary h-100">
                            <div className="card-body p-4 mt-0 text-white">
                                <h2 style={{ color: '#5CA9F7' }} className="card-title h4 mb-3">Our Mission</h2>
                                <p className="card-text">
                                    As a student passionate about making a difference, I created Job Finder with a simple goal:
                                    to make job hunting easier and more accessible for everyone in our country. We believe that
                                    finding the right job shouldn't be a challenge, and every talented individual deserves
                                    their perfect career opportunity.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card bg-dark border border-secondary h-100">
                            <div className="card-body p-4 mt-0 text-white">
                                <h2 style={{ color: '#5CA9F7' }} className="card-title h4 mb-3">What We Offer</h2>
                                <ul className="list-unstyled">
                                    <li className="mb-3">
                                        <i style={{ color: '#5CA9F7' }} className="fas fa-search me-2"></i>
                                        Advanced search and filter options
                                    </li>
                                    <li className="mb-3">
                                        <i style={{ color: '#5CA9F7' }} className="fas fa-sliders-h me-2"></i>
                                        Preference-based job matching
                                    </li>
                                    <li className="mb-3">
                                        <i style={{ color: '#5CA9F7' }} className="fas fa-bullhorn me-2"></i>
                                        Easy job posting for employers
                                    </li>
                                    <li className="mb-3">
                                        <i style={{ color: '#5CA9F7' }}  className="fas fa-user-shield me-2"></i>
                                        Secure application process
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="text-center mb-4">
                    <h2 style={{ color: '#5CA9F7' }} className="h2 mb-5">Key Features</h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card bg-dark border border-secondary h-100">
                                <div className="card-body p-4 mt-0 text-white">
                                    <i style={{ color: '#5CA9F7' }}  className="fas fa-search fa-2x mb-3"></i>
                                    <h3 style={{ color: '#5CA9F7' }}  className="h5">For Job Seekers</h3>
                                    <p className="card-text">
                                        Search jobs by location, industry, and experience level.
                                        Filter by salary, work type, and more to find your perfect match.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-dark border border-secondary h-100">
                                <div className="card-body  p-4 mt-0 text-white">
                                    <i style={{ color: '#5CA9F7' }}  className="fas fa-building fa-2x mb-3"></i>
                                    <h3 style={{ color: '#5CA9F7' }}  className="h5">For Employers</h3>
                                    <p className="card-text">
                                        Post jobs easily, manage applications, and find the right talent
                                        for your organization quickly and efficiently.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-dark border border-secondary h-100">
                                <div className="card-body  p-4 mt-0 text-white">
                                    <i style={{ color: '#5CA9F7' }}  className="fas fa-handshake fa-2x mb-3"></i>
                                    <h3 style={{ color: '#5CA9F7' }}  className="h5">Easy Connection</h3>
                                    <p className="card-text">
                                        Direct communication channels between employers and job seekers
                                        for a smoother hiring process.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="row mt-5">
                    <div className="col-md-6 mx-auto">
                        <div className="card bg-dark border border-secondary">
                            <div className="card-body  p-4 mt-0 text-white">
                                <h2 style={{ color: '#5CA9F7' }}  className="card-title h4 mb-4 text-center">Contact Us</h2>
                                <div className="mb-3">
                                    <i style={{ color: '#5CA9F7' }}  className="fas fa-envelope me-2"></i>
                                    Email: support@jobfinder.com
                                </div>
                                <div className="mb-3">
                                    <i style={{ color: '#5CA9F7' }}  className="fas fa-phone me-2"></i>
                                    Phone: +1 (555) 123-4567
                                </div>
                                <div className="mb-3">
                                    <i style={{ color: '#5CA9F7' }}  className="fas fa-building me-2"></i>
                                    Business Inquiries: business@jobfinder.com
                                </div>
                                <hr className="my-4 border-secondary" />
                                <p className="text-center mb-0">
                                    We're here to help! Whether you're a job seeker or an employer,
                                    don't hesitate to reach out with any questions or concerns.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 mx-auto">
                        <div className="card bg-dark border border-secondary">
                            <div className="card-body  p-4 mt-0 text-white">
                                <h2 style={{ color: '#5CA9F7' }}  className="card-title h4 mb-4 text-center">Follow Us</h2>
                                <div className="mb-3">
                                    <i style={{ color: '#5CA9F7' }}  class="fa-brands fa-facebook me-2"></i>
                                    Facebook : <a className="text-white text-decoration-none" href="/">esh bdozarawa</a>
                                </div>
                                <div className="mb-3">
                                    <i style={{ color: '#5CA9F7' }}  class="fa-brands fa-tiktok me-2"></i>
                                    Tiktok : <a className="text-white text-decoration-none" href="/">esh.bdozarawa</a>
                                </div>
                                <div className="mb-3">
                                    <i style={{ color: '#5CA9F7' }}  class="fa-brands fa-instagram me-2"></i>
                                    Instagram : <a className="text-white text-decoration-none" href="/">esh.bdozarawa12</a>
                                </div>
                                <hr className="my-4 border-secondary" />
                                <p className="text-center mb-0">
                                   If you want to be updated with our latest news, Follow us for job-seeking and hiring tips! We're here to help!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Aboutus
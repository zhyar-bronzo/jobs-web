import React, { useEffect, useState } from 'react';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import './Prepostjob.css';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import { FaCrown, FaQuestionCircle, FaExclamationCircle, FaCog } from 'react-icons/fa';

const Prepostjob = () => {
    const [user, setUser] = useState(null);
    const [isEmployeeSeeker, setIsEmployeeSeeker] = useState(false); // State for checking user role
    const [canPostJob, setCanPostJob] = useState(false); // State to enable/disable button
    const navigate = useNavigate();
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
            .catch((error) => console.error("Error signing out: ", error));
    };

    const handlePostJobClick = () => {
        if (user && isEmployeeSeeker) {
            navigate('/addjob');
        }
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
                        checksUserRole();
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
                setCanPostJob(false);
                setUser(false);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const checksUserRole = async () => {
        try {
            const role = await axios.get('http://localhost:3500/checkroles', { withCredentials: true });
            const userRole = role.data.roles;
            console.log(userRole);
            if (userRole === 'employeeSeeker') {
                setIsEmployeeSeeker(true);
                setCanPostJob(true); // Allow posting job
            } else {
                setIsEmployeeSeeker(false);
                setCanPostJob(false); // Don't allow posting job
            }
        } catch (error) {
            console.error(error);
            alert('Error checking user role');
            setCanPostJob(false); // In case of error, disable posting job
        }
    };

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

            <div
                className="d-flex align-items-center justify-content-center text-center text-white bg-dark pt-3">
                <div className="p-5 bg-dark bg-opacity-75 rounded shadow-lg">
                    <h1 className="display-4 fw-bold mb-4">Find Your Perfect Candidate</h1>
                    <p className="lead mb-4">
                        Post a job and connect with hundreds of talented professionals eager to contribute to your success. Let’s bring your team together with top-tier talent.
                    </p>

                    <button
                        className='cool-btn'
                        onClick={handlePostJobClick}
                        disabled={!canPostJob}
                        style={{
                            borderRadius: '30px',
                            fontSize: '18px',
                            textTransform: 'uppercase',
                        }}
                    >
                        Post a Job
                    </button>

                    <br /><br />
                    <small className='job-posting-note'>
                        *Only <b>Signed In</b> users and those with the <b>Employee Seeker</b> account type are allowed to post a job, you can <b>sign in<span class="break-lin"></span></b> <a href="/login">here</a>
                    </small>
                    <br /><br />

                    {canPostJob === false && !isEmployeeSeeker && user && (
                        <small className='text-danger' style={{ color: 'red' }}>
                            You are not an employee seeker. If you wish to post a job, change your account type to Employee Seeker.
                        </small>
                    )}

                    <div className="text-center mb-4 mt-5">
                        <h2 style={{ color: '#5CA9F7' }} className="h2 mb-5">About Job Postings</h2>
                        <div className="row d-flex justify-content-evenly g-4">
                            <div className="col-md-4">
                                <div className="card bg-dark border border-secondary h-100">
                                    <div className="card-body p-4 mt-0 text-white">
                                        <FaCrown style={{ color: '#5CA9F7' }} className="fas fa-search fa-2x mb-3" />
                                        <h3 style={{ color: '#5CA9F7' }} className="h5">Bost Your Job</h3>
                                        <p className="card-text">
                                            if you want your jobs to be seen by more people, boost your jobs and get more applications. <a className="text-blue-400 text-decoration-underline" href="">learn more</a> about boosting your jobs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card bg-dark border border-secondary h-100">
                                    <div className="card-body p-4 mt-0 text-white">
                                        <i style={{ color: '#5CA9F7' }} className="fa-solid fa-question fa-2x mb-3"></i>
                                        <h3 style={{ color: '#5CA9F7' }} className="h5">you dont know how to post a job?</h3>
                                        <p className="card-text">
                                           you can contact us and we will help you with the process of posting a job more easily <a className="text-blue-400 text-decoration-underline" href="">learn more</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    );
};

export default Prepostjob;

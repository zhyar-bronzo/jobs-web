import React, { useEffect, useState } from 'react';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaFileAlt, FaFilter, FaPlusCircle, FaHome, FaInfoCircle } from 'react-icons/fa';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import styled from 'styled-components';
import './Prepostjob.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';

const Prepostjob = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isEmployeeSeeker, setIsEmployeeSeeker] = useState(false); // State for checking user role
    const [canPostJob, setCanPostJob] = useState(false); // State to enable/disable button
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

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
            if (userRole === 'EmployeeSeeker') {
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
            <header>
                <nav className="navbar">
                    <div className="hamburger-menu" onClick={toggleSidebar}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                    <div className="navbar-text" style={{ color: 'white' }}>
                        Job Finder
                    </div>
                    <div className="logo">
                        <img src="logo.png" alt="Logo" width="100" height="100" />
                    </div>
                </nav>

                <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
                    <div className="close-btn" onClick={closeSidebar}>
                        ×
                    </div>
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
                                <li><a href="/aboutposting"><FaFileAlt /> Create Your CV</a></li>
                                <li><a href="/addjob"><FaPlusCircle /> Post a Job</a></li>
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
            </header>
            <br /><br />
            <div
                className="d-flex align-items-center justify-content-center text-center text-white bg-dark pt-5">
                <div className="p-5 bg-dark bg-opacity-75 rounded shadow-lg">
                    <h1 className="display-4 fw-bold mb-4">Find Your Perfect Candidate</h1>
                    <p className="lead mb-4">
                        Post a job and connect with hundreds of talented professionals eager to contribute to your success. Let’s bring your team together with top-tier talent.
                    </p>

                    <button
                        className="btn btn-primary btn-lg mt-3 px-4 py-2 shadow-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
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

                    <div className="mt-4">
                        <h5 className="fw-bold mb-3">Why Post a Job with Us?</h5>
                        <ul className="list-unstyled text-start">
                            <li>🌟 Reach a large network of qualified professionals.</li>
                            <li>🚀 Post job openings in minutes with an easy-to-use interface.</li>
                            <li>💼 Connect with candidates who are actively seeking opportunities.</li>
                            <li>🤝 Enjoy seamless collaboration with candidates through our platform.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Prepostjob;

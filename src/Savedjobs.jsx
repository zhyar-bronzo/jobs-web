import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaFileAlt, FaPlusCircle, FaHome, FaInfoCircle } from 'react-icons/fa';
import styled from 'styled-components';
import axios from 'axios';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

const StyledWrapper = styled.div`
  button {
    --primary-color: #645bff;
    --secondary-color: #fff;
    --hover-color: #111;
    --arrow-width: 10px;
    --arrow-stroke: 2px;
    box-sizing: border-box;
    border: 0;
    border-radius: 20px;
    color: var(--secondary-color);
    padding: 9px 18px;
    background: var(--primary-color);
    display: flex;
    transition: 0.2s background;
    align-items: center;
    gap: 0.6em;
    font-weight: bold;
  }

  button .arrow-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button .arrow {
    margin-top: 1px;
    width: var(--arrow-width);
    background: var(--primary-color);
    height: var(--arrow-stroke);
    position: relative;
    transition: 0.2s;
  }

  button .arrow::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    border: solid var(--secondary-color);
    border-width: 0 var(--arrow-stroke) var(--arrow-stroke) 0;
    display: inline-block;
    top: -3px;
    right: 3px;
    transition: 0.2s;
    padding: 3px;
    transform: rotate(-45deg);
  }

  button:hover {
    background-color: var(--hover-color);
  }

  button:hover .arrow {
    background: var(--secondary-color);
  }

  button:hover .arrow:before {
    right: 0;
  }`;

const Savedjobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

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
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:3500/favoritejobs', { withCredentials: true });
                const data = response.data;
                console.log(data);
                setJobs(data.foundJobs);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.log(error);
            }
        };

        fetchJobs();
    }, []);


    const formatDescription = (description) => {
        if (!description) return '';
        const words = description.split(' ');
        return words.slice(0, 28).join(' ') + (words.length > 20 ? '...' : '');
    };

    const formatDate = (date) => {
        const postedDate = new Date(date);
        const now = new Date();
        const timeDifference = now - postedDate;
        const secondsAgo = Math.floor(timeDifference / 1000);
        const minutesAgo = Math.floor(secondsAgo / 60);
        const hoursAgo = Math.floor(minutesAgo / 60);
        const daysAgo = Math.floor(hoursAgo / 24);

        if (secondsAgo < 60) {
            return `${secondsAgo} second${secondsAgo !== 1 ? 's' : ''} ago`;
        } else if (minutesAgo < 60) {
            return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
        } else if (hoursAgo < 24) {
            return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
        } else {
            return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
        }
    };

    const viewJobDetails = (jobId) => {
        navigate(`/job?jobid=${jobId}`);
    };

    return (
        <div>
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
                        {user ? (
                            <>
                                <li><a href="/"><FaHome /> Home</a></li>
                                <li><a href="/jobs"><FaBriefcase /> Jobs</a></li>
                                <li><a href="#"><FaFileAlt /> Create Your CV</a></li>
                                <li><a href="/addjob"><FaPlusCircle /> Post a Job</a></li>
                                <li><a href="#"><FaInfoCircle /> About Us</a></li>
                                <li><a href="#"><FaInfoCircle /> Account Settings</a></li>
                                <li><a className="btn btn-danger" onClick={logout} href="#"><FaInfoCircle /> Logout</a></li>
                            </>
                        ) : (
                            <>
                                <li><a href="/"><FaHome /> Home</a></li>
                                <li><a href="/jobs"><FaBriefcase /> Jobs</a></li>
                                <li><a href="#"><FaFileAlt /> Create Your CV</a></li>
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
                {/* Overlay for closing sidebar when clicked outside */}
                {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
            </header>
            {/* Job Listings */}
            <br /><br /><br />
            <div style={{ marginTop: '300px' }} className="container mt-5">
                <h1 style={{ textAlign: 'center' }}>Favorite Jobs</h1>
                <h5 style={{ color: 'green', fontWeight: 'normal', marginBottom: '20px', marginTop: '20px' }}>Jobs Saved {jobs.length}</h5>
                <div className="row">
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div className="col-md-4 mb-4" key={job._id}>
                                <div style={{ backgroundColor: '#1e293b', color: 'white' }} className="card">
                                    <div className="card-body card-fade-border" style={{ height: '300px', overflowY: 'hidden' }}>
                                        <h5 className="card-title mb-4">
                                            <FaBriefcase /> <b>Title: </b> {job.title}
                                        </h5>
                                        <p className="card-text">
                                            <FaBuilding /> <b>Company: </b> {job.company}
                                        </p>
                                        <p className="card-text">
                                            <FaMapMarkerAlt /> <b>Location: </b> {job.location}
                                        </p>
                                        <p className="card-text mb-0">
                                            <FaFileAlt /> <b>Description: </b>
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: formatDescription(job.description),
                                                }}
                                                style={{
                                                    whiteSpace: 'pre-line',
                                                    fontSize: '14px',
                                                }}
                                            />
                                        </p>
                                    </div>

                                    <div className="card-footer d-flex justify-content-between">
                                        <StyledWrapper>
                                            <button onClick={() => viewJobDetails(job._id)}>
                                                View Job <div className="arrow-wrapper">
                                                    <div className="arrow" />
                                                </div>
                                            </button>
                                        </StyledWrapper>

                                        <p className="card-text">
                                            <FaCalendarAlt /> {formatDate(job.postedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No jobs found</p>
                    )}
                </div>
            </div>
        </div>
    );
};


export default Savedjobs;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { GiHamburgerMenu } from 'react-icons/gi';
import './Navbar.css';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
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
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
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

        const checkSavedStatus = async () => {
            try {
                const response = await axios.get("http://localhost:3500/favoritejobs", { withCredentials: true });
                const savedJobs = response.data.foundJobs.map((job) => job._id);
                setSavedJobs(savedJobs);
            } catch (err) {
                console.error("Error fetching saved jobs:", err);
            }
        };

        fetchJobs();
        checkSavedStatus();
    }, []);

    const isJobSaved = (jobId) => savedJobs.includes(jobId);

    const saveJobs = async (jobId) => {
        try {
            const response = await axios.post("http://localhost:3500/savedjobs", { jobId }, { withCredentials: true });
            if (response.status === 200) {
                setSavedJobs((prev) => [...prev, jobId]);
                toast.success("Job saved successfully", { transition: Slide });
            }
        } catch (error) {
            console.error("Error saving job:", error);
        }
    };

    const unSaveJobs = async (jobId) => {
        try {
            const response = await axios.post("http://localhost:3500/unsavejob", { jobId }, { withCredentials: true });
            if (response.status === 200) {
                setSavedJobs((prev) => prev.filter((id) => id !== jobId));
            }
        } catch (error) {
            console.error("Error unsaving job:", error);
        }
    };


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
            <nav style={{ padding: '20px' }} className="navbar">
                <a className='text-decoration-none' href="/jobs"><div className="navbar-logo">Job Finder</div></a>

                {/* For larger screens, navigation links */}
                <div className="navbar-links">
                    <a href="/">Home</a>
                    <a href="/jobs">Jobs</a>
                    <a href="/aboutposting">Post a Job</a>
                    <a href="#cv">VIP</a>
                    <a href="#VIP">Create a CV</a>
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
                    <a href="/aboutus">
                        <i className="fas fa-info-circle me-2"></i> About Us
                    </a>
                </div>
            </nav>

            <h2 className='text-center text-white mt-5'>your saved jobs</h2>
            <p className='text-center text-white mt-4'><b>{jobs.length}</b> saved jobs</p>

            <div className="container mt-4">
                <div className="row">
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div className="col-md-6 mb-4" key={job._id}>
                                <div style={{ backgroundColor: '#272c39', color: 'white' }} className="card">
                                    <div className="card-body mt-3 card-fade-border" style={{ height: '280px', overflowY: 'hidden' }}>
                                        <div className='d-flex justify-content-between'>
                                            <h2 style={{ marginBottom: '13px' }}>
                                                <span style={{ color: '#5CA9F7' }} className='me-2 font-size-md'><i class="fas fa-user-tie"></i></span> {job.title}
                                            </h2>
                                            <i
                                                onClick={() => isJobSaved(job._id) ? unSaveJobs(job._id) : saveJobs(job._id)}
                                                style={{ fontSize: '28px', cursor: 'pointer' }}
                                                className={`fa-${isJobSaved(job._id) ? 'solid' : 'regular'} fa-bookmark me-2`}
                                            />

                                        </div>
                                        <p style={{ fontSize: '17px' }} className="card-text">
                                            <i style={{ color: '#FFD700' }} class="fas fa-building me-2"></i> <b> Company  </b> : {job.company}
                                            <span className='ms-3'><i style={{ color: '#FF0000' }} class="fa-solid fa-location-dot me-2"></i> <b>Location </b> : {job.location}</span>
                                        </p>
                                        <p style={{ fontSize: '17px' }} className="card-text mt-2">
                                            <i style={{ color: '#4682B4' }} class="fa-solid fa-briefcase me-2"></i>
                                            <b>Experience</b> : {job.yearsOfExp}
                                            <span className='ms-2'><i style={{ color: '#228B22' }} class="fa-solid fa-phone me-2"></i>
                                                <b>Contact</b> : <span style={{ fontSize: '18px' }}>{job.companyNumber}</span> </span>
                                        </p>
                                        <p style={{ fontSize: '17px' }} className="card-text">

                                        </p>
                                        <p style={{ fontSize: '17px' }} className="card-text mb-0 mt-2">
                                            <b >Description : </b>
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

                                    <div className="card-footer d-flex justify-content-between mx-3 align-items-center">
                                        <StyledWrapper>
                                            <button onClick={() => viewJobDetails(job._id)}>
                                                View Job <div className="arrow-wrapper">
                                                    <div className="arrow" />
                                                </div>
                                            </button>
                                        </StyledWrapper>
                                        <p className="card-text">
                                            <i class="fa-solid fa-clock me-2"></i> {formatDate(job.postedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <h3 className='text-center mt-5 text-danger'>No jobs found</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default Savedjobs;

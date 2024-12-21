import React, { useEffect, useState } from "react";
import {
    FaUserAlt,
    FaSpinner,
    FaExclamationCircle,
    FaBriefcase,
    FaHome,
    FaInfoCircle,
    FaPlusCircle,
    FaBuilding,
    FaMapMarkerAlt,
    FaDollarSign,
    FaEnvelope,
    FaPhoneAlt,
    FaClock,
    FaHourglassHalf,
    FaIndustry,
    FaTools,
    FaHeart,
    FaFileAlt,
    FaGlobe,
    FaGraduationCap,
} from "react-icons/fa";
import axios from "axios";
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import "./jobdetail.css";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const JobDetails = () => {
    const { search } = useLocation();
    const jobId = new URLSearchParams(search).get("jobid");
    const [job, setJob] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [dislikes, setDisLikes] = useState(0);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

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


    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3500/job?jobid=${jobId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setJob(data);
                setLikes(data.likes);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const checkSavedStatus = async () => {
            try {
                const response = await axios.get("http://localhost:3500/favoritejobs", {
                    withCredentials: true,
                });
                const savedJobs = response.data.foundJobs.map((job) => job._id);
                if (savedJobs.includes(jobId)) {
                    setIsSaved(true);
                }
            } catch (err) {
                console.error("Error fetching saved jobs:", err);
            }
        };

        if (jobId) {
            fetchJobDetails();
            checkSavedStatus();
        }
    }, [jobId]);

    const saveJobs = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3500/savedjobs",
                { jobId },
                { withCredentials: true }
            );
            if (response.status === 200) {
                setIsSaved(true);
            } else if (response.status === 404) {
                alert("You must be logged in to save jobs.");
            } else if (response.status === 409) {
                alert("Job already saved.");
            }
        } catch (error) {
            console.error("Error saving job:", error);
            alert(error.response.data.message);
        }
    };

    const unSaveJobs = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3500/unsavejob",
                { jobId },
                { withCredentials: true }
            );
            if (response.status === 200) {
                setIsSaved(false);
            } else if (response.status === 404) {
                alert(response.data.message || "You must be logged in to unsave jobs.");
            }
        } catch (error) {
            console.error(error);
            alert(error.response.data.message);
        }
    };

    if (loading)
        return (
            <div className="text-center py-5">
                <FaSpinner className="fa-spin fa-3x" />
                <p>Loading job details...</p>
            </div>
        );
    if (error)
        return (
            <div className="text-center text-danger py-5">
                <FaExclamationCircle className="fa-3x" />
                <p>Error: {error}</p>
            </div>
        );

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

    const Like = async () => {
        try {
            const response = await axios.post("http://localhost:3500/like", { jobId }, { withCredentials: true });
            if (response.status === 200) {
                setHasLiked(true);
                setLikes(response.data.like);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const unlike = async () => {
      
        try {
            const response = await axios.post("http://localhost:3500/unlike", { jobId }, { withCredentials: true });
            if (response.status === 200) {
                setLikes(response.data.like);
                setHasLiked(false)
            } else {
                console.log('response.data.message');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const disLike = async () => {
        try {
            const response = await axios.post("http://localhost:3500/dislike", { jobId }, { withCredentials: true });
            if (response.status === 200) {
                setDisLikes(response.data.dislike);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="container py-5">
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
                                <li><a href="/aboutposting"><FaPlusCircle /> Post a Job</a></li>
                                <li><a href="#"><FaInfoCircle /> About Us</a></li>
                                <li><a href="#"><FaInfoCircle /> Account Settings</a></li>
                                <li><a className="btn btn-danger" onClick={logout} href="/"><FaInfoCircle /> Logout</a></li>
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
                {/* Overlay for closing sidebar when clicked outside */}
                {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
            </header>
            {job ? (
                <div style={{ marginTop: '80px' }} >
                    <div>
                        <h2 className="mb-0">
                            {job.title} <span style={{ fontSize: '14px' }} className="text-muted">({job.jobType})</span>
                        </h2>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <small>
                            <i className="fa-solid fa-clock-rotate-left me-1"></i> {formatDate(job.postedAt)}
                        </small>
                        <small><i class="fa-solid fa-eye"></i> {job.views} Views</small>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-start" style={{ marginLeft: '10px' }}>
                        <div>
                            <div >
                                <p>
                                    <span className="me-2"><i className="fa-solid fa-building me-1" style={{ color: '#4285F4' }}></i> {job.company} </span>
                                    <span className="me-2"><i className="fa-solid fa-location-dot me-1" style={{ color: '#EA4335' }}></i> {job.location}</span>
                                </p>
                            </div>
                            <p>
                                <span className="me-2"><i className="fa-solid fa-briefcase me-1" style={{ color: '#4682B4' }}></i> {job.yearsOfExp} </span>
                                <span className="me-2"><i className="fa-solid fa-dollar-sign me-1" style={{ color: '#34A853' }}></i> {job.salary} {job.currency}</span>
                                <span className="me-2"><i className="fa-solid fa-user me-1" style={{ color: '#FFC107' }}></i> {job.gender}</span>
                            </p>
                            <p>
                                <span className="me-2"> <i className="fa-solid fa-phone me-1" style={{ color: '#228B22' }}></i> {job.companyNumber}</span>
                                <span className="me-2">  <i className="fa-solid fa-envelope me-1" style={{ color: '#FF0000' }}></i> {job.companyEmail}</span>
                            </p>
                            <p>
                                <span className="me-2"><i className="fa-solid fa-globe me-1" style={{ color: '#4169E1' }}></i> {job.language.join(' - ')}</span>
                            </p>
                            <p>
                                <span className="me-2" >
                                    <i className="fa-solid fa-graduation-cap me-1" style={{ color: '#1E90FF' }}></i> {job.degree}
                                </span>
                                <span className="me-2" >
                                    <i className="fa-solid fa-university me-1" style={{ color: '#4682B4' }}></i> {job.degreeField}
                                </span>
                            </p>
                            <p>
                                <span className="me-2"> <i class="fa-solid fa-clock" style={{ color: '#FFD700' }}></i> {job.howManyHours} hours of work  </span>
                                <span className="me-2"> <i className="fa-solid fa-industry me-1" style={{ color: '#DAA520' }}></i> {job.industry}</span>
                            </p>
                        </div>

                        <div className="d-flex flex-column align-items-end">
                            <button
                                className={`btn save-btn mb-2 w-100 responsive-btn ${isSaved ? 'unsaved-bg' : 'saved-bg '}`}
                                onClick={isSaved ? unSaveJobs : saveJobs}
                            >
                                {isSaved ? (
                                    <>
                                        Unsave Job <i className="fa-solid fa-bookmark ms-2"></i>
                                    </>
                                ) : (
                                    <>
                                        Save Job <i className="fa-regular fa-bookmark ms-2"></i>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
                        <h4 style={{ color: '#5CA9F7' }} className="atj mx-3 mb-0 fw-bold">About the Job</h4>
                        <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
                    </div>
                    <div className="job-buttons">
                        {/* Like Button */}
                        <button onClick={hasLiked ? unlike : Like} className="like-button" >
                            <i className="fa-solid fa-thumbs-up"></i> {likes}
                        </button>

                        {/* Dislike Button */}
                        <button onClick={disLike} className="dislike-button">
                            <i className="fa-solid fa-thumbs-down"></i> {dislikes}
                        </button>
                    </div>
                    <div>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: job.description,
                            }}
                            style={{
                                whiteSpace: 'pre-line',
                                fontSize: '18px',
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center py-5">
                    <FaExclamationCircle className="fa-3x" />
                    <p>Job not found</p>
                </div>
            )}
        </div>
    );
};

export default JobDetails;

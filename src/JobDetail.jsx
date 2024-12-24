import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { FaSpinner, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import "./jobdetail.css";
import { GiHamburgerMenu } from 'react-icons/gi';
=======
import {
    FaSpinner,
    FaExclamationCircle,
    FaBriefcase,
    FaHome,
    FaInfoCircle,
    FaPlusCircle,
    FaFileAlt,
} from "react-icons/fa";
import axios from "axios";
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import "./jobdetail.css";
>>>>>>> 4f3cf07 (nav)
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

const JobDetails = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const jobId = new URLSearchParams(search).get("jobid");
    const [job, setJob] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
<<<<<<< HEAD
=======
    const [isSidebarOpen, setSidebarOpen] = useState(false);
>>>>>>> 4f3cf07 (nav)
    const [likes, setLikes] = useState(0);
    const [postedBy, setPostedBy] = useState('');
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);
    const [dislikes, setDisLikes] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
<<<<<<< HEAD
    const [showSidebar, setShowSidebar] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
=======

    const handleReportClick = () => {
        setIsOpen(true); // Open the popup
    };

    const handleClose = () => {
        setIsOpen(false); // Close the popup
    };

    const like = async () => {
        try {
            const res = await axios.post("http://localhost:3500/likedjobs", { jobId }, { withCredentials: true });
            const likedJobs = res.data.likedjobs;

            setHasLiked(likedJobs.includes(jobId)); // Update state based on response

            setHasLiked((prevHasLiked) => {
                if (!prevHasLiked) {
                    // Like the job
                    axios.post("http://localhost:3500/like", { jobId }, { withCredentials: true })
                        .then((response) => {
                            try {
                                console.log(`response.status: ${response.status}`);
                                if (response.status === 200) {
                                    toast.success('You liked the job', { transition: Slide });
                                    setLikes(response.data.like);
                                } else if (response.status === 404) {
                                    toast.error(response.data.message || 'You must log in to like a job', { transition: Slide });
                                }
                            } catch (error) {
                                console.error(error);
                                toast.error('An error occurred while liking the job', { transition: Slide });
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            toast.error('An error occurred while liking the job', { transition: Slide });
                        })
                    // Unselect dislike when liking a job
                    setHasDisliked(false);  // Unselect dislike
                    axios.post("http://localhost:3500/undislike", { jobId }, { withCredentials: true }) // Remove dislike
                        .then((response) => {
                            if (response.status === 200) {
                                setDisLikes(response.data.dislike);
                            } else if (response.status === 404) {
                                toast.error(response.data.message || 'You must log in to like a job', { transition: Slide });
                            }
                        })
                        .catch((error) => console.error(error));
                } else {
                    // Unlike the job
                    axios.post("http://localhost:3500/unlike", { jobId }, { withCredentials: true })
                        .then((response) => {
                            if (response.status === 200) {
                                setLikes(response.data.like);
                            }
                        })
                        .catch((error) => console.error(error));
                }
                return !prevHasLiked;
            });
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                toast.error('You must log in to like a job', { transition: Slide });
            }
        }
    };

    const disLike = async () => {
        try {
            const res = await axios.post("http://localhost:3500/dislikedjobs", { jobId }, { withCredentials: true });
            const disLikedJobs = res.data.dislikedjobs;

            setHasDisliked(disLikedJobs.includes(jobId)); // Update state based on response

            setHasDisliked((prevHasDisliked) => {
                if (!prevHasDisliked) {
                    // Dislike the job
                    axios.post("http://localhost:3500/dislike", { jobId }, { withCredentials: true })
                        .then((response) => {
                            if (response.status === 200) {
                                toast.success('You disliked the job', { transition: Slide });
                                setDisLikes(response.data.dislike);
                            } else if (response.status === 401) {
                                toast.error('You must log in to dislike a job', { transition: Slide });
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            toast.error('An error occurred while disliking the job', { transition: Slide });
                        })
                    // Unselect like when disliking a job
                    setHasLiked(false);  // Unselect like
                    axios.post("http://localhost:3500/unlike", { jobId }, { withCredentials: true }) // Remove like
                        .then((response) => {
                            if (response.status === 200) {
                                setLikes(response.data.like);
                            }
                        })
                        .catch((error) => console.error(error));
                } else {
                    // Remove dislike
                    axios.post("http://localhost:3500/undislike", { jobId }, { withCredentials: true })
                        .then((response) => {
                            if (response.status === 200) {
                                setDisLikes(response.data.dislike);
                            }
                        })
                        .catch((error) => console.error(error));
                }
                return !prevHasDisliked;
            });
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                toast.error('You must log in to dislike a job', { transition: Slide });
            }
        }
    };
>>>>>>> 4f3cf07 (nav)

    const handleReportClick = () => {
        setIsOpen(true); // Open the popup
    };

    const handleClose = () => {
        setIsOpen(false); // Close the popup
    };

    const like = async () => {
        try {
            const res = await axios.post("http://localhost:3500/likedjobs", { jobId }, { withCredentials: true });
            const likedJobs = res.data.likedjobs;

            setHasLiked(likedJobs.includes(jobId)); // Update state based on response

            setHasLiked((prevHasLiked) => {
                if (!prevHasLiked) {
                    // Like the job
                    axios.post("http://localhost:3500/like", { jobId }, { withCredentials: true })
                        .then((response) => {
                            try {
                                console.log(`response.status: ${response.status}`);
                                if (response.status === 200) {
                                    toast.success('You liked the job', { transition: Slide });
                                    setLikes(response.data.like);
                                } else if (response.status === 404) {
                                    toast.error(response.data.message || 'You must log in to like a job', { transition: Slide });
                                }
                            } catch (error) {
                                console.error(error);
                                toast.error('An error occurred while liking the job', { transition: Slide });
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            toast.error('An error occurred while liking the job', { transition: Slide });
                        })
                    // Unselect dislike when liking a job
                    setHasDisliked(false);  // Unselect dislike
                    axios.post("http://localhost:3500/undislike", { jobId }, { withCredentials: true }) // Remove dislike
                        .then((response) => {
                            if (response.status === 200) {
                                setDisLikes(response.data.dislike);
                            } else if (response.status === 404) {
                                toast.error(response.data.message || 'You must log in to like a job', { transition: Slide });
                            }
                        })
                        .catch((error) => console.error(error));
                } else {
                    // Unlike the job
                    axios.post("http://localhost:3500/unlike", { jobId }, { withCredentials: true })
                        .then((response) => {
                            if (response.status === 200) {
                                setLikes(response.data.like);
                            }
                        })
                        .catch((error) => console.error(error));
                }
                return !prevHasLiked;
            });
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                toast.error('You must log in to like a job', { transition: Slide });
            }
        }
    };

    const disLike = async () => {
        try {
            const res = await axios.post("http://localhost:3500/dislikedjobs", { jobId }, { withCredentials: true });
            const disLikedJobs = res.data.dislikedjobs;

            setHasDisliked(disLikedJobs.includes(jobId)); // Update state based on response

            setHasDisliked((prevHasDisliked) => {
                if (!prevHasDisliked) {
                    // Dislike the job
                    axios.post("http://localhost:3500/dislike", { jobId }, { withCredentials: true })
                        .then((response) => {
                            if (response.status === 200) {
                                toast.success('You disliked the job', { transition: Slide });
                                setDisLikes(response.data.dislike);
                            } else if (response.status === 401) {
                                toast.error('You must log in to dislike a job', { transition: Slide });
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            toast.error('An error occurred while disliking the job', { transition: Slide });
                        })
                    // Unselect like when disliking a job
                    setHasLiked(false);  // Unselect like
                    axios.post("http://localhost:3500/unlike", { jobId }, { withCredentials: true }) // Remove like
                        .then((response) => {
                            if (response.status === 200) {
                                setLikes(response.data.like);
                            }
                        })
                        .catch((error) => console.error(error));
                } else {
                    // Remove dislike
                    axios.post("http://localhost:3500/undislike", { jobId }, { withCredentials: true })
                        .then((response) => {
                            if (response.status === 200) {
                                setDisLikes(response.data.dislike);
                            }
                        })
                        .catch((error) => console.error(error));
                }
                return !prevHasDisliked;
            });
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                toast.error('You must log in to dislike a job', { transition: Slide });
            }
        }
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
                toast.error('An error occurred while signing out', { transition: Slide });
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
                setJob(data);
                setPostedBy(data.postedby);
                setLikes(data.likes);
                setDisLikes(data.dislikes);
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

        const checkLikedStatus = async () => {
            try {
                const response = await axios.post("http://localhost:3500/likedjobs", { jobId }, { withCredentials: true });
                const likes = response.data.likedjobs.map((like) => like);
                console.log(likes);
                if (likes.includes(jobId)) {
                    setHasLiked(true);
                } else {
                    setHasLiked(false);
                }
            } catch (error) {
                console.error("Error fetching liked jobs:", error);
            }
        }

        const checkdisLikedStatus = async () => {
            try {
                const response = await axios.post("http://localhost:3500/dislikedjobs", { jobId }, { withCredentials: true });
                const dislikes = response.data.dislikedjobs.map((dislike) => dislike);
                console.log(dislikes);
                if (dislikes.includes(jobId)) {
                    setHasDisliked(true);
                } else {
                    setHasDisliked(false);
                }
            } catch (error) {
                console.error("Error fetching liked jobs:", error);
            }
        }

        if (jobId) {
            fetchJobDetails();
            checkSavedStatus();
            checkLikedStatus();
            checkdisLikedStatus();
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
                toast.success("Job saved successfully", { transition: Slide });
            } else if (response.status === 404) {
                alert("You must be logged in to save jobs.");
                toast.error("You must be logged in to save jobs.", { transition: Slide });
            } else if (response.status === 409) {
                alert("Job already saved.");
                toast.error("Job already saved.", { transition: Slide });
            }
        } catch (error) {
            console.error("Error saving job:", error);
            toast.error('Error saving job' || error.response.data.message, { transition: Slide });
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
                toast.error(response.data.message || "You must be logged in to unsave jobs.", { transition: Slide });
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const reason = event.target.reason.value;
        const feedback = event.target.feedback.value;
        try {
            const response = await axios.post("http://localhost:3500/reportajob", {
                jobId, name, reason, feedback
            })
            if (response.status === 201) {
                toast.success('Job reported successfully', { transition: Slide });
                setIsOpen(false);
            } else if (response.status === 400) {
                toast.error('fill out the required fields', { transition: Slide });
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || 'An error occurred while reporting the job', { transition: Slide });
        }
        setIsOpen(false);
    };

    const copyurl = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('URL copied to clipboard', { transition: Slide });
    }

    const goback = () => {
        navigate(-1);
    }

    return (
        <div >
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
                                <a href="/Settings"><i class="fa-solid fa-gear me-2"></i> Settings</a>
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
<<<<<<< HEAD

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
            <div className="container">
                <div style={{ marginTop: '40px' }}>
                    <button onClick={goback} className="back-button">
                        <svg height="25" width="25" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button>
                </div>
                <div className="cardbg">
                    {job ? (
                        <div
                            style={{
                                marginTop: '30px',
                                padding: '20px',
                                borderRadius: '15px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            <div>
                                <h2 className="mb-2">
                                    <b>{job.title}</b> {job.jobType && <span style={{ fontSize: '16px' }}>({job.jobType})</span>}
                                </h2>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <small style={{ fontSize: '16px' }}>
                                    <i className="fa-solid fa-clock-rotate-left me-1"></i> {formatDate(job.postedAt)}  <span className="ms-3" style={{ fontSize: '13.3px' }}> <i className="fa-solid fa-eye"></i> {job.views}Views</span> <br />
                                    <p
                                        className="mt-2"
                                        style={{ color: 'white', background: '#191D21', border: '0px solid purple' }}
                                    >
                                        <b>posted by</b> : <i class="fa-solid fa-user me-1 ms-1"></i> {postedBy}
                                    </p>
                                </small>

                            </div>
                            <div className="d-flex align-items-center justify-content-center mb-4">
                                <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
                                <h3 style={{ color: '#5CA9F7', fontSize: '27px' }} className="atj mx-3 mb-0 fw-bold">Job details</h3>
                                <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered table-custom">
                                    <thead>
                                        <tr>
                                            <th>Attribute</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <i className="fa-solid fa-building me-3 ms-2" style={{ color: '#4285F4' }}></i>
                                                <strong>Company</strong>
                                            </td>
                                            <td>{job.company}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa-solid fa-location-dot me-3 ms-2" style={{ color: '#EA4335' }}></i>
                                                <strong>Location</strong>
                                            </td>
                                            <td>{job.location}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa-solid fa-briefcase me-3 ms-2" style={{ color: '#4682B4' }}></i>
                                                <strong>Experience</strong>
                                            </td>
                                            <td>{job.yearsOfExp}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa-solid fa-dollar-sign me-3 ms-2" style={{ color: '#34A853' }}></i>
                                                <strong>Salary</strong>
                                            </td>
                                            <td>{job.salary} {job.currency}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa-solid fa-user me-3 ms-2" style={{ color: '#FFC107' }}></i>
                                                <strong>Gender</strong>
                                            </td>
                                            <td>{job.gender}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa-solid fa-phone me-3 ms-2" style={{ color: '#228B22' }}></i>
                                                <strong>Contact</strong>
                                            </td>
                                            <td>
                                                {job.companyNumber}
                                                {job.companyEmail && <><br />{job.companyEmail}</>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa-solid fa-globe me-3 ms-2" style={{ color: '#4169E1' }}></i>
                                                <strong>Languages</strong>
                                            </td>
                                            <td>{job.language.join(' - ')}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa-solid fa-graduation-cap me-3 ms-2" style={{ color: '#1E90FF' }}></i>
                                                <strong>Degree</strong>
                                            </td>
                                            <td>{job.degree}</td>
                                        </tr>
                                        {job.degreeField && (
                                            <tr>
                                                <td>
                                                    <i className="fa-solid fa-university me-3 ms-2" style={{ color: '#008080' }}></i>
                                                    <strong>Degree Field</strong>
                                                </td>
                                                <td>{job.degreeField}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td>
                                                <i className="fa-solid fa-clock me-3 ms-2" style={{ color: '#FFD700' }}></i>
                                                <strong>Working Hours</strong>
                                            </td>
                                            <td>{job.howManyHours}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa-solid fa-industry me-3 ms-2" style={{ color: '#DAA520' }}></i>
                                                <strong>Industry</strong>
                                            </td>
                                            <td>{job.industry}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="theline container my-3">
                                <div className="row">
                                    <div className="flex flex-wrap items-center text-center justify-center gap-4 p-3 md:flex-row md:gap-8">
                                        <button
                                            style={{ color: 'white', fontSize: '18px', background: '#191D21', border: '0px solid blue' }}
                                            onClick={isSaved ? unSaveJobs : saveJobs}
                                            className="cursor-pointer relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] hover:text-[#FB923C] h-9 px-4 py-2 mx-4 my-2"
                                        >
                                            {isSaved ? (
                                                <>
                                                    <b> Unsave Job</b> <i className="fa-solid fa-bookmark ms-2"></i>
                                                </>
                                            ) : (
                                                <>
                                                    <b>Save Job</b> <i className="fa-regular fa-bookmark ms-2"></i>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            style={{ color: 'white', fontSize: '18px', background: '#191D21', border: '0px solid red' }}
                                            onClick={handleReportClick}
                                            className="cursor-pointer relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] hover:text-[#60A5FA] h-9 px-4 py-2 mx-4 my-2"
                                        >
                                            <b>Report</b> <i style={{ color: 'white' }} className="fa-solid fa-circle-info me-1 ms-1"></i>
                                        </button>
                                        <button
                                            style={{ color: 'white', fontSize: '18px', background: '#191D21', border: '0px solid green' }}
                                            onClick={copyurl}
                                            className="cursor-pointer relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] hover:text-[#06B6D4] h-9 px-4 py-2 mx-4 my-2"
                                        >
                                            <b>Share</b>
                                            <i style={{ color: 'white' }} className="fa-solid fa-share me-1 ms-2"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                                <div className="job-buttons mb-5">
                                    <button
                                        onClick={like}
                                        className={`like-button ${hasLiked ? "active" : ""}`}
                                    >
                                        <i className={`fa${hasLiked ? "-solid" : "-regular"} fa-thumbs-up`}></i> {likes}
                                    </button>

                                    <button
                                        onClick={disLike}
                                        className={`dislike-button ${hasDisliked ? "active" : ""}`}
                                    >
                                        <i className={`fa${hasDisliked ? "-solid" : "-regular"} fa-thumbs-down`}></i> {dislikes}
                                    </button>
                                </div>
                            </div>
                            {isOpen && (
                                <div className="popup-overlay">
                                    <div className="popup-content">
                                        <button className="close-btn" onClick={handleClose}>
                                        <i className="fa-solid fa-xmark text-black mt-1 me-3 mb-0"></i>
                                        </button>
                                        <form className="mt-3" onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label className="form-label text-black" htmlFor="name">Your Name</label>
                                                <input placeholder="Enter your name" type="text" id="name" className="form-control" required />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label text-black" htmlFor="reason">Reason for reporting:</label>
                                                <select id="reason" className="form-control" required>
                                                    <option value="">Select a reason</option>
                                                    <option value="Spam">Spam</option>
                                                    <option value="Expired Listing">Expired Listing</option>
                                                    <option value="Misleading Information">Misleading Information</option>
                                                    <option value="Fraudulent">Fraudulent</option>
                                                    <option value="Duplicate Listing">Duplicate Listing</option>
                                                    <option value="Fake Employer">Fake Employer</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label text-black" htmlFor="feedback">Additional Feedback:</label>
                                                <textarea
                                                    id="feedback"
                                                    className="form-control"
                                                    rows="5"
                                                    placeholder="Please let us know why you’re reporting this job (e.g., misleading, scam), Your feedback helps us improve job quality for everyone."
                                                    required
                                                    style={{ resize: 'none' }}
                                                ></textarea>
                                            </div>
                                            <div className="form-group">
                                                <button type="submit" className="btn btn-primary">
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                            <div className="d-flex align-items-center justify-content-center mb-4">
                                <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
                                <h4 style={{ color: '#5CA9F7', fontSize: '27px' }} className="atj mx-3 mb-0 fw-bold">About the Job</h4>
                                <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
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
                    ) :
                        <div className="text-center py-5">
                            <FaExclamationCircle className="fa-3x" />
                            <p>Job not found</p>
                        </div>
                    }
                    <ToastContainer position="top-right" />
                </div>
=======
                {/* Overlay for closing sidebar when clicked outside */}
                {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
            </header>






            
            <div style={{ marginTop: '60px' }}>
                <button onClick={goback} className="back-button">
                    <svg height="25" width="25" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                    <span>Back</span>
                </button>
            </div>
            <div className="cardbg">
                {job ? (
                    <div
                        style={{
                            marginTop: '30px',
                            padding: '20px',
                            borderRadius: '15px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <div>
                            <h2 className="mb-0">
                                <b>{job.title}</b> {job.jobType && <span style={{ fontSize: '16px' }}>({job.jobType})</span>}
                            </h2>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <small style={{ fontSize: '16px' }}>
                                <i className="fa-solid fa-clock-rotate-left me-1"></i> {formatDate(job.postedAt)} <br />
                                <span style={{ fontSize: '13.3px' }}> <i className="fa-solid fa-eye"></i> {job.views} Views</span>
                            </small>
                            <div style={{ marginTop: '10px' }} className="job-buttons">
                                <button
                                    onClick={like}
                                    className={`like-button ${hasLiked ? "active" : ""}`}
                                >
                                    <i className={`fa${hasLiked ? "-solid" : "-regular"} fa-thumbs-up`}></i> {likes}
                                </button>

                                <button
                                    onClick={disLike}
                                    className={`dislike-button ${hasDisliked ? "active" : ""}`}
                                >
                                    <i className={`fa${hasDisliked ? "-solid" : "-regular"} fa-thumbs-down`}></i> {dislikes}
                                </button>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center mb-4">
                            <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
                            <h3 style={{ color: '#5CA9F7' }} className="atj mx-3 mb-0 fw-bold">Job details</h3>
                            <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered table-custom">
                                <thead>
                                    <tr>
                                        <th>Attribute</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <i className="fa-solid fa-building me-3 ms-2" style={{ color: '#4285F4' }}></i>
                                            <strong>Company</strong>
                                        </td>
                                        <td>{job.company}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <i className="fa-solid fa-location-dot me-3 ms-2" style={{ color: '#EA4335' }}></i>
                                            <strong>Location</strong>
                                        </td>
                                        <td>{job.location}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <i className="fa-solid fa-briefcase me-3 ms-2" style={{ color: '#4682B4' }}></i>
                                            <strong>Experience</strong>
                                        </td>
                                        <td>{job.yearsOfExp}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <i className="fa-solid fa-dollar-sign me-3 ms-2" style={{ color: '#34A853' }}></i>
                                            <strong>Salary</strong>
                                        </td>
                                        <td>{job.salary} {job.currency}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <i className="fa-solid fa-user me-3 ms-2" style={{ color: '#FFC107' }}></i>
                                            <strong>Gender</strong>
                                        </td>
                                        <td>{job.gender}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <i className="fa-solid fa-phone me-3 ms-2" style={{ color: '#228B22' }}></i>
                                            <strong>Contact</strong>
                                        </td>
                                        <td>
                                            {job.companyNumber}
                                            {job.companyEmail && <><br />{job.companyEmail}</>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <i className="fa-solid fa-globe me-3 ms-2" style={{ color: '#4169E1' }}></i>
                                            <strong>Languages</strong>
                                        </td>
                                        <td>{job.language.join(' - ')}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <i className="fa-solid fa-graduation-cap me-3 ms-2" style={{ color: '#1E90FF' }}></i>
                                            <strong>Degree</strong>
                                        </td>
                                        <td>{job.degree}</td>
                                    </tr>
                                    {job.degreeField && (
                                        <tr>
                                            <td>
                                                <i className="fa-solid fa-university me-3 ms-2" style={{ color: '#008080' }}></i>
                                                <strong>Degree Field</strong>
                                            </td>
                                            <td>{job.degreeField}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td>
                                            <i className="fa-solid fa-clock me-3 ms-2" style={{ color: '#FFD700' }}></i>
                                            <strong>Working Hours</strong>
                                        </td>
                                        <td>{job.howManyHours}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <i className="fa-solid fa-industry me-3 ms-2" style={{ color: '#DAA520' }}></i>
                                            <strong>Industry</strong>
                                        </td>
                                        <td>{job.industry}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="theline container my-3">
                            <div className="row">
                                <div className="flex flex-wrap items-center text-center justify-center gap-4 p-3 md:flex-row md:gap-8">
                                    <button
                                        style={{ color: 'white', background: 'purple', border: '1px solid purple' }}
                                        className="cursor-pointer relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] hover:text-[#FACC14] h-9 px-4 py-2 mx-2 my-2"
                                    >
                                        posted by : {postedBy}
                                    </button>
                                    <button
                                        style={{ color: 'white', background: 'blue', border: '1px solid blue' }}
                                        onClick={isSaved ? unSaveJobs : saveJobs}
                                        className="cursor-pointer relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] hover:text-[#FB923C] h-9 px-4 py-2 mx-2 my-2"
                                    >
                                        {isSaved ? (
                                            <>
                                                <b> Unsave Job</b> <i className="fa-solid fa-bookmark ms-2"></i>
                                            </>
                                        ) : (
                                            <>
                                                <b>Save Job</b> <i className="fa-regular fa-bookmark ms-2"></i>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        style={{ color: 'white', background: 'red', border: '1px solid red' }}
                                        onClick={handleReportClick}
                                        className="cursor-pointer relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] hover:text-[#60A5FA] h-9 px-4 py-2 mx-2 my-2"
                                    >
                                        <i style={{ color: 'white' }} className="fa-solid fa-circle-info me-1"></i> Report
                                    </button>
                                    <button
                                        style={{ color: 'white', background: 'green', border: '1px solid green' }}
                                        onClick={copyurl}
                                        className="cursor-pointer relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] hover:text-[#06B6D4] h-9 px-4 py-2 mx-2 my-2"
                                    >
                                        <i style={{ color: 'white' }} className="fa-solid fa-share me-1"></i>
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-center mb-4">
                            <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
                            <h4 style={{ color: '#5CA9F7' }} className="atj mx-3 mb-0 fw-bold">About the Job</h4>
                            <div className="flex-grow-1 border-bottom border-2" style={{ height: '2px' }}></div>
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
                ) :
                    <div className="text-center py-5">
                        <FaExclamationCircle className="fa-3x" />
                        <p>Job not found</p>
                    </div>
                }
                <ToastContainer position="top-right" />
>>>>>>> 4f3cf07 (nav)
            </div>
        </div>
    );
};

export default JobDetails;

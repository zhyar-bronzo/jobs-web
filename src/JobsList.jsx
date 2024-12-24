import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import styled from 'styled-components';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import axios from 'axios';
import { GiHamburgerMenu } from 'react-icons/gi';
<<<<<<< HEAD
import './Navbar.css';
import './jobslist.css'
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
=======
import { FaCaretDown } from 'react-icons/fa';
import './Navbar.css';
>>>>>>> 4f3cf07 (nav)
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

const StyledWrapper = styled.div`
  button {
    --primary-color: #7269e3;
    --secondary-color: #fff;
    --hover-color: #5b54b8 ;
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

const JobsList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [collapsedSections, setCollapsedSections] = useState({});
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isFiltersApplied, setIsFiltersApplied] = useState(false);
    const [filters, setFilters] = useState({
        location: [],
        title: '',
        minSalary: '',
        maxSalary: '',
        industry: [],
        yearsOfExp: '',
        language: [],
        gender: ''
    });
<<<<<<< HEAD
    const [filteredJob, setFilteredJob] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [result, setResult] = useState(0);
    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
=======
    const [showSidebar, setShowSidebar] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const toggleDropdown = (event) => {
        event.stopPropagation();
        console.log('clicked');
        console.log('showDropdown:', showDropdown);
        setShowDropdown(!showDropdown);
    };
>>>>>>> 4f3cf07 (nav)

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

    const [savedJobs, setSavedJobs] = useState([]);

    const filterOptions = {
        location: [
            { value: 'Slemani', label: 'Slemani' },
            { value: 'Hawler', label: 'Hawler' },
            { value: 'Halabja', label: 'Halabja' },
            { value: 'Duhok', label: 'Duhok' },
            { value: 'Kirkuk', label: 'Kirkuk' },
            { value: 'Chamchamal', label: 'Chamchamal' },
            { value: 'Ranya', label: 'Ranya' },
            { value: 'Zaxo', label: 'Zaxo' },
            { value: 'Halabja', label: 'Halabja' },
            { value: 'Kalar', label: 'Kalar' },
            { value: 'Darbandixan', label: 'Darbandixan' },
            { value: 'Said Sadiq', label: 'Said Sadiq' },
            { value: 'Dokan', label: 'Dokan' },
            { value: 'Shaqlawa', label: 'Shaqlawa' },
            { value: 'Taq Taq', label: 'Taq Taq' }
        ],
        industry: [
            { value: 'Technology', label: 'Technology' },
            { value: 'Medicine', label: 'Healthcare & Medical' },
            { value: 'Law', label: 'Law' },
            { value: 'Education', label: 'Education' },
            { value: 'Finance', label: 'Finance' },
            { value: 'Retail', label: 'Retail' }
        ],
        yearsOfExp: [
            { value: 'No experience', label: 'No Experience' },
            { value: '3 months', label: '3 months' },
            { value: '6 months', label: '6 months' },
            { value: '9 months', label: '9 months' },
            { value: '1 year', label: '1 year' },
            { value: '2 years', label: '2 years' },
            { value: '3 years', label: '3 years' },
            { value: '4 years', label: '4 years' },
            { value: '5 or more years', label: '5 or more years' }
        ],
        language: [
            { value: 'Kurdish', label: 'Kurdish' },
            { value: 'English', label: 'English' },
            { value: 'Arabic', label: 'Arabic' },
        ],
        gender: [
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'no gender specified', label: 'No gender' }
        ],
    };

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                let url = 'http://localhost:3500/?';
                Object.keys(filters).forEach((key) => {
                    if (filters[key] && (filters[key].length > 0 || (key === 'minSalary' || key === 'maxSalary'))) {
                        if (Array.isArray(filters[key])) {
                            url += `${key}=${filters[key].join(',')}&`;
                        } else {
                            url += `${key}=${filters[key]}&`;
                        }
                    }
                });
                url = url.slice(0, -1);

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setJobs(data);
                setResult(data.length);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
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
    }, [filters]);

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

    const handleFilterChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'minSalary' || name === 'maxSalary') {
            const numericValue = value === '' ? '' : parseInt(value, 10);
            console.log(numericValue)
            setFilters((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        } else if (checked) {
            setFilters((prev) => ({
                ...prev,
                [name]: [...(prev[name] || []), value],
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                [name]: (prev[name] || []).filter(item => item !== value),
            }));
        }
    };
    useEffect(() => {
        const filtered = jobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredJob(filtered);
        setResult(filtered.length); // Update result based on filtered jobs
    }, [searchTerm, jobs]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterSubmit = () => {
        setIsFiltersApplied(true);
    };

    const resetFilters = () => {
        setFilters({
            location: [],
            title: '',
            minSalary: '',
            maxSalary: '',
            industry: [],
            yearsOfExp: '',
            language: [],
            gender: ''
        });
        setIsFiltersApplied(false);
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

    

    const toggleCollapse = (section) => {
        setCollapsedSections((prevState) => ({
            ...prevState,
            [section]: !prevState[section]
        }));
    };

    const FilterSection = ({ title, options, name, selectedValues, onChange, isCollapsed, toggleCollapse }) => {
        const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];
        return (
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button
                        className="accordion-button"
                        type="button"
                        onClick={() => toggleCollapse(name)}
                        aria-expanded={isCollapsed}
                    >
                        {title}
                    </button>
                </h2>
                <div
                    id={`${name}Collapse`}
                    className={`accordion-collapse collapse ${isCollapsed ? 'show' : ''}`}
                >
                    <div className="accordion-body">
                        <div
                            className="filter-options-scroll"
                            style={{
                                maxHeight: '220px',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                            }}
                        >
                            <div className="row g-2">
                                {options.map((option) => (
                                    <div className="col-6" key={option.value}>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name={name}
                                                value={option.value}
                                                id={`${name}-${option.value}`}
                                                checked={safeSelectedValues.includes(option.value)}
                                                onChange={onChange}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`${name}-${option.value}`}
                                            >
                                                {option.label}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <p>Loading jobs...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
<<<<<<< HEAD
        <div className='bgbody'>
            <nav style={{ padding: '20px' }} className="navbar">
                <a className='text-decoration-none' href="/jobs"><div className="navbar-logo">Job Finder</div></a>
=======
        <div>
            <nav className="navbar">
                <div className="navbar-logo">Job Finder</div>
>>>>>>> 4f3cf07 (nav)

                {/* For larger screens, navigation links */}
                <div className="navbar-links">
                    <a href="/">Home</a>
<<<<<<< HEAD
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

=======
                    <a href="#jobs">Jobs</a>
                    <a href="#post">Post a Job</a>
                    <a href="#cv">Create a CV</a>
                    <a href="#about">About Us</a>
                </div>

                {/* User section with dropdown */}
                <div className="user-section" onClick={toggleDropdown}>
                    <span>Zhyar</span>
                    <FaCaretDown className="dropdown-arrow" />
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <a href="#">
                                <i class="fa-solid fa-user me-2"></i> Your Profile
                            </a>
                            <a href="#">
                                <i class="fa-solid fa-bookmark me-2"></i> Your Favorites
                            </a>
                            <a href="#">
                                <i className="fas fa-sign-out-alt me-2"></i> Logout
                            </a>
                        </div>
                    )}
                </div>

>>>>>>> 4f3cf07 (nav)
                {/* Hamburger menu for smaller screens */}
                <GiHamburgerMenu
                    className="hamburger-icon"
                    onClick={toggleSidebar}
                    size={35}
                />

                {/* Sidebar for mobile */}
                <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
<<<<<<< HEAD
                    <div style={{ marginRight: '20px' }} className="sidebar-header">
=======
                    <div className="sidebar-header">
>>>>>>> 4f3cf07 (nav)
                        <span></span>
                        <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
                    </div>
                    <a href="#home">
<<<<<<< HEAD
                        <i className="fa-solid fa-house me-2"></i> Home
=======
                        <i class="fa-solid fa-house me-2"></i> Home
>>>>>>> 4f3cf07 (nav)
                    </a>
                    <a href="#jobs">
                        <i className="fas fa-briefcase me-2"></i> Jobs
                    </a>
                    <a href="#post">
<<<<<<< HEAD
                        <i className="fa-solid fa-plus me-2"></i> Post a Job
=======
                        <i class="fa-solid fa-plus me-2"></i> Post a Job
>>>>>>> 4f3cf07 (nav)
                    </a>
                    <a href="#cv">
                        <i className="fas fa-file-alt me-2"></i> Create a CV
                    </a>
<<<<<<< HEAD
                    <a href="/aboutus">
=======
                    <a href="#about">
>>>>>>> 4f3cf07 (nav)
                        <i className="fas fa-info-circle me-2"></i> About Us
                    </a>
                </div>
            </nav>
<<<<<<< HEAD
=======
            {/* Filter Offcanvas */}
>>>>>>> 4f3cf07 (nav)

            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="filterOffcanvas"
                aria-labelledby="filterOffcanvasLabel"
                style={{ width: '500px' }}
            >
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title" id="filterOffcanvasLabel">
                        All Filters {isFiltersApplied && `(${jobs.length} results)`}
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>

                <div className="offcanvas-body">
                    <div className="accordion" id="filterAccordion">

                        {Object.keys(filterOptions).map((key) => (
                            <FilterSection
                                title={key.charAt(0).toUpperCase() + key.slice(1)}
                                options={filterOptions[key]}
                                name={key}
                                selectedValues={filters[key]}
                                onChange={handleFilterChange}
                                isCollapsed={!collapsedSections[key]}
                                toggleCollapse={toggleCollapse}
                            />
                        ))}
                    </div>
                    <button
                        className="btn btn-secondary mt-3"
                        type="button"
                        onClick={resetFilters}
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

<<<<<<< HEAD
            <h2 className='text-center text-white mt-5'>begin the seach for your dream job</h2>
=======
            <div style={{ position: 'relative', top: '80px' }} className="d-flex align-items-center mb-3 mt-5">
                <input
                    type="text"
                    className="form-control py-2 border-2 shadow-sm me-3"
                    placeholder="Search by title"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ maxWidth: '400px', marginLeft: '380px' }}
                />
                <button
                    style={{ width: '50px' }}
                    className="btn btn-primary py-2 shadow-sm"
                    type="button"
                    onClick={handleFilterSubmit}
                    data-bs-toggle="offcanvas"
                    data-bs-target="#filterOffcanvas"
                >
                    <FaFilter />
                </button>
            </div>
>>>>>>> 4f3cf07 (nav)

            <div className='text-center'>
                <div className="d-flex align-items-center justify-content-center mb-3 mt-5">
                    <input
                        placeholder="Search for a job"
                        class="input"
                        name="text"
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        autoComplete='off'
                    />

                    <button
                        style={{ width: '50px', height: '45px', backgroundColor: '#7269e3' }}
                        className="filterbtn btn btn-primary py-2 shadow-sm"
                        type="button"
                        onClick={handleFilterSubmit}
                        data-bs-toggle="offcanvas"
                        data-bs-target="#filterOffcanvas"
                    >
                        <FaFilter />
                    </button>
                </div>
            </div>
            <div className='container mx-auto '>
                <p style={{ marginRight: '20px' }} className='text-white text-center'>{result} jobs found</p>
            </div>
            <div className="container mt-5">
                <div className="row">
<<<<<<< HEAD
                    {filteredJob.length > 0 ? (
                        filteredJob.map((job) => (
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
=======
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <div className="col-md-4 mb-4" key={job._id}>
                                <div style={{ backgroundColor: '#1e293b', color: 'white' }} className="card">
                                    <div className="card-body mt-3 card-fade-border" style={{ height: '300px', overflowY: 'hidden' }}>
                                        <h5 className="card-title mb-4">
                                            {job.title}
                                        </h5><br />
                                        <p className="card-text">
                                            <FaBuilding /> <b>Company : </b> {job.company}
>>>>>>> 4f3cf07 (nav)
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
            <ToastContainer position="top-right" />
        </div>
    );
};

export default JobsList;

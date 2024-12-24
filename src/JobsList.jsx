import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaFileAlt, FaFilter, FaPlusCircle, FaHome, FaInfoCircle } from 'react-icons/fa';
import styled from 'styled-components';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import axios from 'axios';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaCaretDown } from 'react-icons/fa';
import './Navbar.css';
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
    const [showSidebar, setShowSidebar] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const toggleDropdown = (event) => {
        event.stopPropagation();
        console.log('clicked');
        console.log('showDropdown:', showDropdown);
        setShowDropdown(!showDropdown);
    };

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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'minSalary' || name === 'maxSalary') {
            const numericValue = value === '' ? '' : parseInt(value, 10);
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <div className="filter-options-scroll" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {options.map((option) => (
                                <div className="form-check" key={option.value}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name={name}
                                        value={option.value}
                                        id={`${name}-${option.value}`}
                                        checked={safeSelectedValues.includes(option.value)}
                                        onChange={onChange}
                                    />
                                    <label className="form-check-label" htmlFor={`${name}-${option.value}`}>
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <p>Loading jobs...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-logo">Job Finder</div>

                {/* For larger screens, navigation links */}
                <div className="navbar-links">
                    <a href="/">Home</a>
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

                {/* Hamburger menu for smaller screens */}
                <GiHamburgerMenu
                    className="hamburger-icon"
                    onClick={toggleSidebar}
                    size={35}
                />

                {/* Sidebar for mobile */}
                <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
                    <div className="sidebar-header">
                        <span></span>
                        <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
                    </div>
                    <a href="#home">
                        <i class="fa-solid fa-house me-2"></i> Home
                    </a>
                    <a href="#jobs">
                        <i className="fas fa-briefcase me-2"></i> Jobs
                    </a>
                    <a href="#post">
                        <i class="fa-solid fa-plus me-2"></i> Post a Job
                    </a>
                    <a href="#cv">
                        <i className="fas fa-file-alt me-2"></i> Create a CV
                    </a>
                    <a href="#about">
                        <i className="fas fa-info-circle me-2"></i> About Us
                    </a>
                </div>
            </nav>
            {/* Filter Offcanvas */}

            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="filterOffcanvas"
                aria-labelledby="filterOffcanvasLabel"
                style={{ width: '400px' }}
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
                                key={key}
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

            <div style={{ position: 'relative', top: '80px' }} className="container mt-5">
                <div className="row">
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
                                        </p>
                                        <p className="card-text">
                                            <FaMapMarkerAlt /> <b>Location : </b> {job.location}
                                        </p>
                                        <p className="card-text mb-0">
                                            <FaFileAlt /> <b>Description : </b>
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

export default JobsList;

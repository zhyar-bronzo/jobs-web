import React, { useState, useEffect } from 'react';
import { FaHome, FaBriefcase, FaFileAlt, FaPlusCircle, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import useAuthRedirect from './ChekingAuth';
import { useSearchParams } from 'react-router-dom';
import './SignupForm.css';

const SignUpGoogle = () => {
    useAuthRedirect();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: email,
        location: '',
        role: '',
        gender: '',
        degree: '',
        industry: '',
    });

    useEffect(() => {
        const emailFromQuery = searchParams.get('email');
        if (emailFromQuery) {
            setEmail(emailFromQuery);
        }
    }, [searchParams]);

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const locations = [
        { value: 'Slemani', label: 'Slemani' },
        { value: 'Hawler', label: 'Hawler' },
        { value: 'Halabja', label: 'Halabja' },
        { value: 'Duhok', label: 'Duhok' },
        { value: 'Kirkuk', label: 'Kirkuk' },
        { value: 'Chamchamal', label: 'Chamchamal' },
        { value: 'Ranya', label: 'Ranya' },
        { value: 'Zaxo', label: 'Zaxo' },
        { value: 'Kalar', label: 'Kalar' },
        { value: 'Darbandixan', label: 'Darbandixan' },
        { value: 'Said Sadiq', label: 'Said Sadiq' },
        { value: 'Dokan', label: 'Dokan' },
        { value: 'Shaqlawa', label: 'Shaqlawa' },
        { value: 'Taq Taq', label: 'Taq Taq' },
    ];

    const industries = [
        { value: 'Technology', label: 'Technology' },
        { value: 'Medicine', label: 'Healthcare & Medical' },
        { value: 'Law', label: 'Law' },
        { value: 'Education', label: 'Education' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Retail', label: 'Retail' },
    ];

    const degrees = [
        'i have no Degree',
        'High School',
        'Bachelor’s Degree',
        'Master’s Degree',
        'PhD',
    ];

    const handleChange = (e) => {
        const { id, value, type, name } = e.target;

        if (type === 'radio') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [id]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('here');
            const response = await axios.post('http://localhost:3500/googleauthSingup', {
                displayName: formData.fullName,
                email: email,
                location: formData.location,
                gender: formData.gender,
                role: formData.role,
                degree: formData.degree,
                industry: formData.industry,
            }, {
                withCredentials: true
            })

            if (response.status === 201) {
                navigate('/jobs');
            } else if (response.status === 500) {
                toast.error(response.data.message || 'An error occurred. Please try again later.', { transition: Slide });
            }
        } catch (error) {
            console.error();
            toast.error(error.response.data.message || 'An error occurred. Please try again later.', { transition: Slide });
        }
    };

    return (
        <div className="container mt-5">
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
                        <li><a href="/"><FaHome /> Home</a></li>
                        <li><a href="/jobs"><FaBriefcase /> Jobs</a></li>
                        <li><a href="#"><FaFileAlt /> Create Your CV</a></li>
                        <li><a href="/addjob"><FaPlusCircle /> Post a Job</a></li>
                        <li><a href="#"><FaInfoCircle /> About Us</a></li>
                    </ul>
                    <div className="auth-buttons">
                        <button className="auth-btn signup-btn"><a style={{ textDecoration: 'none', color: 'white' }} href="/signup">Signup</a></button>
                        <button className="auth-btn signin-btn"><a style={{ textDecoration: 'none', color: 'white' }} href="/login">Sign In</a></button>
                    </div>
                </div>

                {/* Overlay for closing sidebar when clicked outside */}
                {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
            </header>
            <form style={{ marginTop: '120px' }} onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <h2 className="text-center mb-4">Signup</h2>
                {/* Row 1 */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="fullName" className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            placeholder="e.g Mohammed Ahmed Ali"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="location" className="form-label">Location</label>
                        <select
                            className="form-select"
                            id="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select your location</option>
                            {locations.map((loc) => (
                                <option key={loc.value} value={loc.value}>
                                    {loc.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            disabled
                            readOnly
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Gender</label>
                        <div className="d-flex align-items-center gap-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    id="male"
                                    value="Male"
                                    checked={formData.gender === 'Male'}
                                    onChange={handleChange}
                                    required
                                />
                                <label className="form-check-label" htmlFor="male">
                                    Male
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    id="female"
                                    value="Female"
                                    checked={formData.gender === 'Female'}
                                    onChange={handleChange}
                                    required
                                />
                                <label className="form-check-label" htmlFor="female">
                                    Female
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3 */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="degree" className="form-label">Degree (Optional)</label>
                        <select
                            className="form-select"
                            id="degree"
                            value={formData.degree}
                            onChange={handleChange}
                        >
                            <option value="">Select your degree</option>
                            {degrees.map((deg, index) => (
                                <option key={index} value={deg}>
                                    {deg}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="industry" className="form-label">Industry (Optional)</label>
                        <select
                            className="form-select"
                            id="industry"
                            value={formData.industry}
                            onChange={handleChange}
                        >
                            <option value="">Select your industry</option>
                            {industries.map((ind) => (
                                <option key={ind.value} value={ind.value}>
                                    {ind.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Row 4 */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="role" className="form-label">What are you looking for?</label>
                        <select
                            className="form-select"
                            id="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select an option</option>
                            <option value="employeeSeeker">Employee Seeker</option>
                            <option value="jobSeeker">Job Seeker</option>
                        </select>
                    </div>
                </div>
                <br />
                {statusMessage && <p className='alert alert-danger text-center'>{statusMessage}</p>}

                {/* Submit Button */}
                <div className='text-center'>
                    <button type="submit" className="btn-submit">
                        Continue
                    </button>
                </div>
                <ToastContainer position='top-right' />
            </form>
        </div>
    );
};

export default SignUpGoogle;

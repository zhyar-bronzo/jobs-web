import React, { useState, useEffect } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './addform.css'
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import { FaBriefcase, FaHome, FaPlusCircle, FaInfoCircle, FaFileAlt, FaTools, FaIndustry, FaEnvelope, FaBuilding, FaGlobe, FaUserAlt, FaGraduationCap, FaBookOpen, FaClock, FaDollarSign, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'; // Importing icons

const AddJobForm = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        location: '',
        salary: '',
        currency: 'usd',
        skils: '',
        companyEmail: '',
        companyNumber: '',
        industry: '',
        howManyHours: '',
        yearsOfExp: '',
        language: [],
        jobType: '',
        degree: 'no-degree-required',
        degreeField: '',
        gender: '',
    });

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
                    if (response.status !== 200) {
                        navigate('/login');
                    }
                } catch (error) {
                    console.error(`Error checking authentication: ${error.message}`);
                    navigate('/login');
                }
            } else {
                console.log("No user signed in");
                navigate('/login');
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const industries = [
        'Medicine',
        'Engineering',
        'Technology',
        'Law',
        'Education',
        'Waiter or Waitress',
        'labor',
        'Real Estate',
        'translator',
        'Plumber',
        'Chef',
        'Finance',
        'Marketing',
        'Retail',
        'Architecture',
        'Media',
    ];

    const languages = ['English', 'Kurdish', 'Arabic'];
    const genders = ['no gender specified', 'Male', 'Female'];
    const degrees = [
        'No Degree Required',
        'High School',
        'Bachelor’s Degree',
        'Master’s Degree',
        'PhD',
    ];

    const jobTypes = ['on site', 'remote', 'hybrid'];

    const degreeFields = [
        'Computer Science',
        'Medical',
        'Law',
        'Engineering',
        'Business',
        'Finance',
        'Arabic',
        'English',
        'Kurdish',
        'Linguistics',
        'Plumbing Technology',
        'Construction Management',
        'Marketing',
        'Communications',
        'Retail Management'
    ];

    const experienceOptions = [
        'No experience',
        '3 months',
        '6 months',
        '9 months',
        '1 year',
        '2 years',
        '3 years',
        '4 years',
        '5 or more years'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'language') {
            const updatedValues = formData[name].includes(value)
                ? formData[name].filter((val) => val !== value) // Remove if already selected
                : [...formData[name], value]; // Add if not selected
            setFormData({ ...formData, [name]: updatedValues });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleQuillChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            description: value, // Update description from ReactQuill
        }));
    };

    const modules = {
        toolbar: [
            ["bold", "italic"], // Bold and Italic
            [{ list: "ordered" }, { list: "bullet" }], // Numbered and Bullet Lists
        ],
    };

    const formats = [
        "bold",
        "italic",
        "list", // Includes both "ordered" and "bullet"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.description || formData.description.trim() === '') {
            setMessage('Job description is required!');
            return;
        }
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:3500/addjob', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    skils: formData.skils.split(',').map((skill) => skill.trim()),
                    companyNumber: Number(formData.companyNumber),
                    howManyHours: Number(formData.howManyHours),
                    salary: Number(formData.salary),
                    currency: formData.currency,
                }),
            });

            if (response.ok) {
                setMessage('Job added successfully!');
                setFormData({
                    title: '',
                    description: '',
                    company: '',
                    location: '',
                    salary: '',
                    currency: 'usd',
                    skils: '',
                    companyEmail: '',
                    companyNumber: '',
                    industry: '',
                    howManyHours: '',
                    jobType: '',
                    yearsOfExp: '',
                    language: [],
                    degree: 'no-degree-required',
                    degreeField: '',
                    gender: 'no-gender-specified',
                });
            } else {
                setMessage('Failed to add job. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while adding the job.');
        } finally {
            setLoading(false);
        }
    };

    const renderInputField = (name, type, placeholder, label, attributes, icon) => (
        <div className="mb-3">
            <label className="form-label">
                {icon && <span className="me-2">{icon}</span>}{label}
            </label>
            <input
                type={type}
                className="form-control"
                name={name}
                id={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                {...attributes}
            />
        </div>
    );

    return (
        <>
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
                        <li><a href="/aboutposting"><FaPlusCircle /> Post a Job</a></li>
                        <li><a href="#"><FaInfoCircle /> About Us</a></li>
                        <li><a href="#"><FaInfoCircle /> Account Settings</a></li>
                        <li><a className="btn btn-danger" onClick={logout} href="#"><FaInfoCircle /> Logout</a></li>
                    </ul>
                </div>

                {/* Overlay for closing sidebar when clicked outside */}
                {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
            </header>

            <div style={{ marginTop: '120px' }} className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="col-md-12 col-lg-10" style={{ padding: '35px 15px' }}>
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-header bg-dark text-white text-center py-4">
                            <h2 className="mb-0">Job Application</h2>
                        </div>
                        <div className="card-body p-4">
                            <form style={{ marginTop: '180px' }} onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Job Title */}
                                    <div className="col-md-6 mb-3">
                                        {renderInputField('title', 'text', 'e.g, Teacher', 'Job Title', { maxLength: 50, required: true }, <FaBuilding />)}
                                    </div>

                                    {/* Company */}
                                    <div className="col-md-6 mb-3">
                                        {renderInputField('company', 'text', 'e.g, Google', 'Company', { maxLength: 50, required: true }, <FaBuilding />)}
                                    </div>

                                    {/* Job Description */}
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label" htmlFor="Job Description">
                                            <FaFileAlt className="me-2" />Job Description
                                        </label>
                                        <ReactQuill
                                            value={formData.description}
                                            onChange={handleQuillChange}
                                            placeholder="Enter job description..."
                                            theme="snow"
                                            maxLength={4000}
                                            modules={modules}
                                            formats={formats}
                                            style={{ height: '150px' }}
                                        />
                                    </div>

                                    {/* Location */}
                                    <div className="col-md-6 mb-3 mt-5">
                                        <label className="form-label" htmlFor="location">
                                            <FaMapMarkerAlt className="me-2" />Job Location
                                        </label>
                                        <select
                                            className="form-control"
                                            name="location"
                                            id="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select a Location</option>
                                            {['Slemani', 'Karkuk', 'Hawler', 'Duhok', 'Chamchamal', 'Ranya', 'Zaxo', 'Halabja', 'Kalar', 'Darbandixan', 'Said Sadiq', 'Dokan', 'Shaqlawa', 'Taq Taq'].map((loc) => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Gender */}
                                    <div className="col-md-6 mb-3 mt-5">
                                        <label className="form-label">
                                            <FaUserAlt className="me-2" />Gender
                                        </label>
                                        <select
                                            className="form-control"
                                            name="gender"
                                            id="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            {genders.map((deg) => (
                                                <option key={deg} value={deg}>{deg}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Salary */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="salary">
                                            <FaDollarSign className="me-2" />Salary
                                        </label>
                                        <div className="d-flex">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="salary"
                                                id="salary"
                                                placeholder="e.g, 1000 USD"
                                                value={formData.salary}
                                                onChange={handleChange}
                                                required
                                            />
                                            <select
                                                className="form-control ms-2"
                                                name="currency"
                                                id="currency"
                                                value={formData.currency}
                                                onChange={handleChange}
                                            >
                                                <option value="usd">USD</option>
                                                <option value="iqd">IQD</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="col-md-6 mb-3">
                                        {renderInputField('skils', 'text', 'e.g, HTML,CSS,JavaScript', 'Skills (optional)', { maxLength: 100, required: false }, <FaTools />)}
                                    </div>

                                    {/* Company Email */}
                                    <div className="col-md-6 mb-3">
                                        {renderInputField('companyEmail', 'email', 'e.g, example@gmail.com', 'Company Email (optional)', {
                                            pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
                                        }, <FaEnvelope />)}
                                    </div>

                                    {/* Company Phone Number */}
                                    <div className="col-md-6 mb-3">
                                        {renderInputField('companyNumber', 'number', 'e.g, 07701234567', 'Company Phone Number', { min: 1000000000, max: 99999999999, required: true }, <FaPhoneAlt />)}
                                    </div>

                                    {/* Industry */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            <FaIndustry className="me-2" />Industry
                                        </label>
                                        <select
                                            className="form-control"
                                            name="industry"
                                            id="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select an Industry</option>
                                            {industries.map((ind) => (
                                                <option key={ind} value={ind}>{ind}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            <FaIndustry className="me-2" />Job Types (optional)
                                        </label>
                                        <select
                                            className="form-control"
                                            name="jobType"
                                            id="jobType"
                                            value={formData.jobType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select a type</option>
                                            {jobTypes.map((ind) => (
                                                <option key={ind} value={ind}>{ind}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Languages */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            <FaGlobe className="me-2" />Required Languages
                                        </label>
                                        <div>
                                            {languages.map((lang) => (
                                                <div key={lang} className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="language"
                                                        value={lang}
                                                        id={`language-${lang}`}
                                                        checked={formData.language.includes(lang)}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor={`language-${lang}`}>
                                                        {lang}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Degree */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            <FaGraduationCap className="me-2" />Degree
                                        </label>
                                        <select
                                            className="form-control"
                                            name="degree"
                                            id="degree"
                                            value={formData.degree}
                                            onChange={handleChange}
                                        >
                                            {degrees.map((deg) => (
                                                <option key={deg} value={deg.replace(/\s+/g, '-')}>{deg}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Degree Field */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            <FaBookOpen className="me-2" />Degree Field (Optional)
                                        </label>
                                        <select
                                            className="form-control"
                                            name="degreeField"
                                            id="degreeField"
                                            value={formData.degreeField}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Degree Field (Optional)</option>
                                            {degreeFields.map((field) => (
                                                <option key={field} value={field}>{field}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Years of Experience */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            <FaBriefcase className="me-2" />Years of Experience
                                        </label>
                                        <select
                                            className="form-control"
                                            name="yearsOfExp"
                                            id="yearsOfExp"
                                            value={formData.yearsOfExp}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Experience Level</option>
                                            {experienceOptions.map((exp) => (
                                                <option key={exp} value={exp}>{exp}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* How Many Hours */}
                                    <div className="col-md-6 mb-3">
                                        {renderInputField('howManyHours', 'number', 'e.g, 10', 'How Many Hours', { min: 1, max: 24, required: true }, <FaClock />)}
                                    </div>
                                </div>

                                {message && <p className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>{message}</p>}
                                <p className='alert alert-warning text-center'>jobs should take anywhere from 1 hour to 24 hours to be approved</p>
                                {/* Submit Button */}
                                <div className='bgg'>
                                    <button type="submit" className='btn-submit' disabled={loading}>
                                        {loading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );

};

export default AddJobForm;

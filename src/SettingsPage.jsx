import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaKey, FaTrash, FaEye, FaEyeSlash,FaUserTag } from "react-icons/fa";
import axios from 'axios';
import { auth, onAuthStateChanged, updatePassword, signOut, EmailAuthProvider, reauthenticateWithCredential } from './FirebaseService';
import { useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import './Navbar.css';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("displayName");
  const [useremail, setUserEmail] = useState(null);
  const [userdisplayname, setUserDisplayName] = useState(null);
  const [formData, setFormData] = useState({
    displayName: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [user, setUser] = useState(null);
  const [userrole, setUserRole] = useState(null);
  const [creationdate, setCreationDate] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const [showSidebar, setShowSidebar] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleInputChange = (e) => {
    const { value, type } = e.target;
    if (type === 'radio') {
      setUserRole(value);
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setHasChanged(true);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
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

          const roles = await axios.get('http://localhost:3500/checkroles', { withCredentials: true });
          setUserRole(roles.data.roles);
          console.log(`User role: ${roles.data.roles}`);

          console.log(`Firebase user response status: ${response.status}`);
          if (response.status === 200) {
            console.log("Authenticated user");
            setUserEmail(firebaseUser.email);
            setUserDisplayName(firebaseUser.displayName);
            const creationTime = firebaseUser.metadata.creationTime;
            const date = new Date(creationTime);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            setCreationDate(formattedDate);
          } else if (response.status === 404) {
            console.log("User not authenticated or profile not complete");
            setUserEmail(false);
          } else {
            console.log(`Unexpected status code: ${response.status}`);
            setUserEmail(false);
          }
        } catch (error) {
          console.error(`Error checking authentication: ${error.message}`);
          setUserEmail(false);
        }
      } else {
        console.log("No user signed in");
        setUserEmail(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

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

  const roleChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3500/changerole", { role: userrole }, { withCredentials: true });
      console.log(response.data);
      if (response.status === 200) {
        toast.success(response.data.message || "Role updated successfully", { transition: Slide });
      } else if (response.status === 400) {
        toast.error(response.data.message || "Invalid role", { transition: Slide });
      } else if (response.status === 404) {
        toast.error(response.data.message || "User not found", { transition: Slide });
      } else {
        toast.error(response.data.message || "An error occurred", { transition: Slide });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const updateName = async () => {
    try {
      const response = await axios.post("http://localhost:3500/changename", { displayName: formData.displayName }, { withCredentials: true });
      console.log(response.data);
      if (response.status === 200) {
        toast.success(response.data.message || "Name updated successfully", { transition: Slide });
      } else if (response.status === 400) {
        toast.error(response.data.message || "Invalid name", { transition: Slide });
      } else if (response.status === 404) {
        toast.error(response.data.message || "User not found", { transition: Slide });
      } else {
        toast.error(response.data.message || "An error occurred", { transition: Slide });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const updaterePassword = async (e) => {
    e.preventDefault();
    try {
      const credential = EmailAuthProvider.credential(useremail, formData.oldPassword);
      console.log('auth.currentUser');
      console.log(auth.currentUser);
      await reauthenticateWithCredential(auth.currentUser, credential);
      if (formData.newPassword !== formData.confirmNewPassword) {
        toast.error("Passwords do not match", { transition: Slide });
        return;
      } else if (formData.oldPassword === formData.confirmNewPassword || formData.newPassword === formData.oldPassword) {
        toast.error("New password cannot be the same as the old password", { transition: Slide });
        return;
      }
      await updatePassword(auth.currentUser, formData.newPassword);
      toast.success("Password updated successfully", { transition: Slide });
      setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "An error occurred", { transition: Slide });
    }
  }

  const deleteAccount = async () => {
    try {
      const response = await axios.post("http://localhost:3500/deleteaccounts", {}, { withCredentials: true });
      if (response.status === 200) {
        console.log('response.status === 200');
        navigate("/jobs");
        toast.success(response.data.message || "Account deleted successfully", { transition: Slide });
      } else if (response.status === 404) {
        console.log('response.status === 404');
        toast.error(response.data.message || "User not found", { transition: Slide });
      } else if (response.status === 400) {
        console.log('response.status === 400');
        toast.error(response.data.message || "Invalid request", { transition: Slide });
      } else {
        console.log('the else')
        toast.error(response.data.message || "An error occurred", { transition: Slide });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "An error occurred", { transition: Slide });
    }
  }

  const sections = {
    displayName: (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-white">
          <FaUser className="inline-block mr-2" />
          Change Your Display Name
        </h2>
        <p className="text-white mb-3">people will see your display name on job postings and can be used to identify you</p>
        <form>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Display Name
          </label>
          <input
            type="text"
            name="displayName"
            className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring focus:ring-indigo-500"
            placeholder="Enter new display name"
            value={formData.displayName}
            onChange={handleInputChange}
          />
          <p className="mt-3 text-gray-400">your current display name is: {userdisplayname}</p><br />
          <button
            type="submit"
            onClick={updateName}
            disabled={!hasChanged}
            className={` px-4 py-2 rounded-md ${hasChanged
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
          >
            Save Changes
          </button>
        </form>
      </div>
    ),
    usertype: (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-white">
          <FaUserTag className="inline-block mr-2" />
          Change Your role type
        </h2>
        <p className="text-white mb-3">you can change your role type here based on what you are looking for</p>
        <form>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Role Types
          </label>
          <label className="mr-2 text-white" htmlFor="employeeSeeker">employee Seeker</label>
          <input
            type="radio"
            className="form-check-input"
            value={'employeeSeeker'}
            onChange={handleInputChange}
            name="roles"
            checked={userrole === 'employeeSeeker'}
          />
          <label className="mr-2 ml-4 text-white" htmlFor="jobSeeker">job Seeker</label>
          <input
            type="radio"
            value={'jobSeeker'}
            className="form-check-input mb-5"
            onChange={handleInputChange}
            name="roles"
            checked={userrole === 'jobSeeker'}
          />
          <br />
          <div className="alert alert-warning text-center w-100 w-md-75 mx-auto">
            <i className="fas fa-exclamation-triangle me-2"></i>
            if you wish to post a job you must be an <b>employee seeker</b>
          </div>
          <button
            type="submit"
            onClick={roleChange}
            disabled={!hasChanged}
            className={` mt-4 px-4 py-2 rounded-md ${hasChanged
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
          >
            Save Changes
          </button>
        </form>
      </div>
    ),
    changeEmail: (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-white">
          <FaEnvelope className="inline-block mr-2" />
          Email Address
        </h2>
        <form>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full mb-5 p-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring focus:ring-indigo-500"
            value={useremail}
            readOnly
          />
        </form>
        <small className="alert alert-warning text-center" style={{ fontSize: '1rem', padding: '10px 20px', borderRadius: '5px' }}>
          <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
          You cannot change your email address
        </small>
      </div>
    ),
    changePassword: (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-white">
          <FaKey className="inline-block mr-2" />
          Change Your Password
        </h2>
        <p className="text-white mb-3">your password should be at least 6 characters long and contain at least one upper case character, a number, and a special character (!@#$%^&*)</p>
        <form>
          {["oldPassword", "newPassword", "confirmNewPassword"].map((field, idx) => (
            <div key={field} className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                {idx === 0 ? "Old Password" : idx === 1 ? "New Password" : "Confirm New Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword[field] ? "text" : "password"}
                  name={field}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring focus:ring-indigo-500"
                  placeholder={
                    idx === 0
                      ? "Enter old password"
                      : idx === 1
                        ? "Enter new password"
                        : "Confirm new password"
                  }
                  value={formData[field]}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-200"
                  onClick={() => togglePasswordVisibility(field)}
                >
                  {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          ))}
          <p className="text-blue-400 text-decoration-underline"><a href="/passwordreset">forgot your password?</a></p>
          <button
            type="submit"
            onClick={updaterePassword}
            disabled={!hasChanged}
            className={`mt-4 px-4 py-2 rounded-md ${hasChanged
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
          >
            Save Changes
          </button>
        </form>
      </div>
    ),
    deleteAccount: (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-white">
          <FaTrash className="inline-block mr-2" />
          Delete Account
        </h2>
        <p className="mb-3 text-white">
          This action cannot be undone. Proceed with caution and ensure you have saved any important data before deleting your account.
        </p>
        <p className="text-gray-400">you have been member since {creationdate}</p> <br />
        <button onClick={deleteAccount} className="bg-red-500 mt-2 text-white px-4 py-2 rounded-md hover:bg-red-600">
          Delete Account
        </button>
      </div>
    ),
  };

  const goback = () => {
    navigate(-1);
  }

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
          <a href="#about">
            <i className="fas fa-info-circle me-2"></i> About Us
          </a>
        </div>
      </nav>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#242832]">
        {/* Sidebar */}
        <ul className="w-full md:w-1/4 bg-gray-900 shadow-md p-4">
          <li>
            <div style={{ marginBottom: '20px' }}>
              <button style={{backgroundColor: 'transparent', border: 'none'}} onClick={goback} className="back-button text-white">
                <svg style={{ fill: 'white' }} height="25" width="25" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                <span>Back</span>
              </button>
            </div>
          </li>
          <li
            onClick={() => setActiveSection("displayName")}
            className={`p-3 cursor-pointer rounded-md text-white ${activeSection === "displayName"
              ? "bg-indigo-500"
              : "hover:bg-gray-700"
              }`}
          >
            <FaUser className="inline-block mr-2" />
            Display Name
          </li>
          <li
            onClick={() => setActiveSection("usertype")}
            className={`p-3 cursor-pointer rounded-md text-white ${activeSection === "usertype"
              ? "bg-indigo-500"
              : "hover:bg-gray-700"
              }`}
          >
            <FaUserTag className="inline-block mr-2" />
            user type
          </li>
          <li
            onClick={() => setActiveSection("changeEmail")}
            className={`p-3 cursor-pointer rounded-md text-white ${activeSection === "changeEmail"
              ? "bg-indigo-500"
              : "hover:bg-gray-700"
              }`}
          >
            <FaEnvelope className="inline-block mr-2" />
            Emai Address
          </li>
          <li
            onClick={() => setActiveSection("changePassword")}
            className={`p-3 cursor-pointer rounded-md text-white ${activeSection === "changePassword"
              ? "bg-indigo-500"
              : "hover:bg-gray-700"
              }`}
          >
            <FaKey className="inline-block mr-2" />
            Password
          </li>
          <li
            onClick={() => setActiveSection("deleteAccount")}
            className={`p-3 cursor-pointer rounded-md text-red-500 ${activeSection === "deleteAccount"
              ? "bg-red-600 text-white"
              : "hover:bg-red-700 hover:text-white"
              }`}
          >
            <FaTrash className="inline-block mr-2" />
            Delete Account
          </li>
        </ul>

        {/* Content Section */}
        <div className="w-full md:w-3/4 bg-gray-800 shadow-md p-4">
          {sections[activeSection]}
        </div>
        <ToastContainer position="top-right" />
      </div>
    </div>
  );
};

export default SettingsPage;

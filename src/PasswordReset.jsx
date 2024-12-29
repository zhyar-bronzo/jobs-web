import React, { useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import './passwordreset.css';

const PasswordReset = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3500/resetpassword', { email });
            if (response.status === 200) {
                toast.success(response.data.message || 'Password reset link sent , please check your Email', { transition: Slide });
            } else if (response.status === 400) {
                toast.error(response.data.message || 'Invalid email', { transition: Slide });
            }
            else if (response.status === 404) {
                toast.error(response.data.message || 'User not found', { transition: Slide });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred', { transition: Slide });
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ width: "500px" }}>
                <div className="text-center">
                    <img
                        src="passforget.jpg"
                        alt="Illustration"
                        className="img-fluid mb-3"
                        style={{ maxHeight: "180px" }}
                    />
                    <h3 className="mb-3">Forgot your password?</h3>
                    <p className="text-muted mb-4">
                        Enter your Email address and we’ll help you reset your password
                    </p>
                </div>
                <form>
                    <div className="mb-3 w-75 ms-auto me-auto">
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Your Email Address"
                            required
                        />
                    </div>
                    <div className="text-center">
                        <button onClick={handleSubmit} type="submit" className=" cool-btn">
                            Continue
                        </button>
                    </div>

                    <div className='backtologin'>
                        <p  className="text-center mt-3 ">
                            <a style={{ textDecoration: "none"}} href="/login"><i class="fa-solid fa-arrow-left"></i> Back to Login</a>
                        </p>
                    </div>
                    <ToastContainer position='top-right' />
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;
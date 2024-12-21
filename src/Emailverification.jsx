import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthRedirect from './ChekingAuth';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import './passwordreset.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Emailverification.css';

const EmailVerification = () => {
    useAuthRedirect();
    const location = useLocation();
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const { email } = location.state || {};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            toast.error('No email provided.', { transition: Slide });
        }
    }, [email]);

    const handleVerifyEmail = async () => {
        if (!email) return;

        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:3500/emailverify',
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                toast.success('Email verified successfully', { transition: Slide });
                navigate('/login');
            } else if (response.status === 401) {
                toast.error('Your Email has not been verified.Please try again', { transition: Slide });
            } else {
                toast.warn('Something went wrong. Please try again', { transition: Slide });
            }
        } catch (error) {
            console.error('Error verifying email:', error);
            toast.error('Error verifying email. Please try again.', { transition: Slide });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(countdown); // Cleanup interval on component unmount
        } else {
            setCanResend(true); // Enable link after timer reaches 0
        }
    }, [timer]);

    const handleResendClick = () => {
        setTimer(30); // Reset timer to 30 seconds
        setCanResend(false); // Disable link again
        // Add logic to resend the email here
        console.log("Resending verification email...");
    };

    const resendEmailVerification = async () => {
        try {
            const response = await axios.post('http://localhost:3500/resendemailverify', { email }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            })
            if (response.status === 200) {
                toast.success('Email verification link has been resent.', { transition: Slide });
            }
        } catch (error) {
            toast.error('Error resending email verification. Please try again.', { transition: Slide });
        }
    }

    return (
        <div className="verify-email-container">
            <div className="card">
                {/* Wave Background */}
                <div className="wave-container">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                    >
                        <path
                            fill="#fff"
                            fillOpacity="1"
                            d="M0,256L60,224C120,192,240,128,360,112C480,96,600,128,720,144C840,160,960,160,1080,144C1200,128,1320,96,1380,80L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                        ></path>
                    </svg>
                </div>

                <div className="card-body text-center">
                    <img
                        src="jemail.webp"
                        alt="Email Icon"
                        className="mb-4"
                        style={{ height: "200px", zIndex: 2 }}
                    />
                    <h3 className="card-title">Verify your email address</h3>
                    <p className="card-text">
                        A verification email has been sent to your email:{" "}
                        <strong>{email}</strong>. Please check your inbox and click the link provided to complete your account registration.
                    </p>
                    <div className="actions">
                        <button onClick={handleVerifyEmail} className="cool-btn">Verified</button>
                        <br />
                        <br />
                        <p className='spanemail'>didnt get your email? <a
                            href="#resend"
                            className={`btn-link ${!canResend ? "disabled-link" : ""}`}
                            onClick={(e) => {
                                if (!canResend) e.preventDefault();
                                else resendEmailVerification();
                            }}
                        >
                            Resend Verification Email
                        </a></p>

                        <p>{timer > 0 && `${timer}s`}</p>
                        <a className="btnlink" href="login" onClick={() => navigate('/login')}>
                            <i class="fa-solid fa-arrow-left"></i> Do it later
                        </a>
                        <ToastContainer position='top-right' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
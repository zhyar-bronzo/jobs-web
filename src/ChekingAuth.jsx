import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './FirebaseService';
const useAuthRedirect = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigate('/jobs');
            }
        });
        return () => unsubscribe();
    }, [navigate]);
};

export default useAuthRedirect;

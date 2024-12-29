import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobsList from './JobsList';
import AddJobForm from './AddJobForm';
import JobDetails from './JobDetail';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Emailverification from './Emailverification';
import PasswordReset from './PasswordReset';
import Home from './Home';
import Aboutus from './Aboutus';
import SettingsPage from './SettingsPage';
import NavigationBar from './NavigationBar';
import Savedjobs from './Savedjobs';
import Prepostjob from './Prepostjob';
import SignUpGoogle from './SignUpGoogle';
import NotFound from './NotFound';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/addjob" element={<AddJobForm />} />
          <Route path="/job" element={<JobDetails />} /> {/* Route expects query params */}
          <Route path='/login' element={<LoginForm />} />
          <Route path='/signup' element={<SignupForm />} />
          <Route path='/emailVerification' element={<Emailverification />} />
          <Route path='/passwordreset' element={<PasswordReset />} />
          <Route path="/savedjobs" element={<Savedjobs />} />
          <Route path="/signupgoogle" element={<SignUpGoogle />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/aboutposting" element={<Prepostjob />} />
          <Route path="/test" element={<NavigationBar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

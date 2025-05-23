import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../src/components/LoginPage';
// import { AuthProvider } from '../src/components/LoginPage'; // Import from same file
import Home from './components/Home';
import SignUp from '../src/components/SignUp'; // Your existing signup page
// import { AuthContext } from '../src/components/LoginPage';
import Profile from './components/Profile';
import { AuthProvider } from './components/AuthContext';
import { Toaster } from 'react-hot-toast';



function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false}  />
      <Router>
        {/* <AuthProvider> */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={
            <Home />
          } />
          <Route path='/profile' element={<Profile />} />
        </Routes>
        {/* </AuthProvider> */}
      </Router>

    </AuthProvider>
  );
}

export default App;

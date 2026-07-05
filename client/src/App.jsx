import { Outlet } from "react-router-dom";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import Header from "./components/header/Header";


const App = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');

    if (userIdFromStorage && !user) {
      setUser(userIdFromStorage);
    }

    if (!userIdFromStorage &&
      !window.location.pathname.includes('/auth') &&
      !window.location.pathname.includes('/signup')) {
      navigate('/auth');
    }

    if (userIdFromStorage &&
      window.location.pathname.includes('/auth')) {
      navigate('/');
    }

  }, [user, navigate, setUser]);


  return (
    <div className="flex flex-col min-h-screen relative">


      <Header />

      <div className='flex-1'>
        <Outlet />
      </div>

      {/* <Footer /> */}
    </div>);
};

export default App;
import { Outlet } from "react-router-dom";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';


const App = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
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

  }, [currentUser, navigate, setCurrentUser]);


  return <Outlet />;
};

export default App;
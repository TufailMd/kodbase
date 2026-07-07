import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './authContext.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import App from './App.jsx'
import Dashboard from './components/dashboard/Dashboard.jsx';
import Login from './components/auth/Login.jsx';
import Signup from './components/auth/SignUp.jsx';
import Profile from './components/user/Profile.jsx';
import ProfileOverview from './components/user/ProfileOverview.jsx';
import ProfileRepositories from './components/user/ProfileRepositories.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Dashboard />} />
      <Route path='/auth' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path="/profile" element={<Profile />}>
        <Route index element={<ProfileOverview />} />
        <Route path="repositories" element={<ProfileRepositories />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </AuthProvider>
)
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import { PiFileCodeFill } from "react-icons/pi";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
} from "@mui/material";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { setUser } = useAuth();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setUser(null);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await axios.post("http://localhost:3000/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);

            setUser(res.data.userId);
            setLoading(false);

            window.location.href = "/";
        } catch (err) {
            console.error(err);
            alert("Login Failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex justify-center items-center px-4">
            <Box className="w-full max-w-sm flex flex-col items-center">

                <PiFileCodeFill className="text-6xl text-primary-500" />

                <Typography
                    variant="h4"
                    className="!text-white !font-semibold !my-4 text-center"
                >
                    Log in
                </Typography>

                <Paper
                    elevation={3}
                    className="w-full !bg-[#161b22] !rounded-xl !p-8"
                >
                    <form
                        onSubmit={handleLogin}
                        className="flex flex-col gap-5"
                    >

                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                        />

                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            size="large"
                        >
                            {loading ? "loading..." : "Login"}
                        </Button>
                    </form>
                </Paper>

                <Paper
                    elevation={0}
                    className="w-full mt-5 !bg-transparent border border-gray-700 rounded-xl p-4 text-center"
                >
                    <Typography className="!text-gray-300">
                        Create a new account?{" "}
                        <Link
                            to="/signup"
                            className="text-blue-500 hover:underline"
                        >
                            Signup
                        </Link>
                    </Typography>
                </Paper>
            </Box>
        </div>
    );
};

export default Login;
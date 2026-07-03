import { useState } from "react";
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


const Signup = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { setCurrentUser } = useAuth();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await axios.post("http://localhost:3000/signup", {
                email,
                username,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);

            setCurrentUser(res.data.userId);

            window.location.href = "/";
        } catch (err) {
            console.error(err);
            alert("Signup Failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex justify-center items-center px-4">
            <Box className="w-full max-w-sm flex flex-col items-center">

                <PiFileCodeFill className="text-6xl text-primary-500" />

                {/* <div className="flex items-center gap-3"> */}
                {/* <PiFileCodeFill className="text-6xl text-primary-500" /> */}

                {/* <p className="text-2xl font-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
                        Kod<span className="text-primary-500">Base</span>
                    </p> */}
                {/* </div> */}

                <Typography
                    variant="h4"
                    className="!text-white !font-semibold !my-4 text-center"
                >
                    Sign up
                </Typography>

                <Paper
                    elevation={3}
                    className="w-full !bg-[#161b22] !rounded-xl !p-8"
                >
                    <form
                        onSubmit={handleSignup}
                        className="flex flex-col gap-5"
                    >
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="off"
                        />

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
                            {loading ? "Signing up..." : "Sign up"}
                        </Button>
                    </form>
                </Paper>

                <Paper
                    elevation={0}
                    className="w-full mt-5 !bg-transparent border border-gray-700 rounded-xl p-4 text-center"
                >
                    <Typography className="!text-gray-300">
                        Already have an account?{" "}
                        <Link
                            to="/auth"
                            className="text-blue-500 hover:underline"
                        >
                            Login
                        </Link>
                    </Typography>
                </Paper>
            </Box>
        </div>
    );
};

export default Signup;
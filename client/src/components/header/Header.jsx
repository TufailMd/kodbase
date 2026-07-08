import { Link, useNavigate, useParams } from "react-router-dom";
import {
    FiMenu,
    FiSearch,
    FiPlus,
    FiBell,
    FiLogOut
} from "react-icons/fi";
import { PiFileCodeFill } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import {
    GoRepo,
    GoGitBranch,
} from "react-icons/go";
import { useEffect, useRef, useState } from "react";

const Header = () => {
    const navigate = useNavigate();
    const pageName = window.location.pathname.split("/")[1] || "Dashboard";
    const [openProfile, setOpenProfile] = useState(false);
    const profileRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        navigate("/auth");
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setOpenProfile(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 h-16 w-full bg-[#0d1117] border-b border-[#30363d]">
            <div className="flex h-full items-center justify-between px-6">
                {/* Left */}
                <div className="flex items-center gap-5">
                    {/* Menu */}
                    <button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#30363d] hover:bg-[#161b22] transition">
                        <Link to="/" >
                            <FiMenu size={20} className="text-white" />
                        </Link>
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <Link to="/" >
                            <PiFileCodeFill className="text-white text-4xl" />
                        </Link>
                        <Link to={pageName} >
                            <h1 className="text-white text-2xl font-bold">
                                {pageName.charAt(0).toUpperCase()}
                                {pageName.slice(1)}
                            </h1>
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="hidden lg:flex flex-1 max-w-xl mx-10">
                    <div className="flex items-center w-full rounded-md border border-[#30363d] bg-[#0d1117] px-4 py-2">
                        <FiSearch className="text-gray-400 mr-3" />

                        <input
                            type="text"
                            placeholder="Type / to search"
                            className="w-full bg-transparent outline-none text-white placeholder:text-gray-400"
                        />

                        <kbd className="rounded border border-[#30363d] px-2 py-0.5 text-xs text-gray-400">
                            /
                        </kbd>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/create')} className="flex h-10 w-10 items-center justify-center rounded-md border border-[#30363d] hover:bg-[#161b22] cursor-pointer">
                        <FiPlus className="text-white" />
                    </button>

                    {/* <button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#30363d] hover:bg-[#161b22] cursor-pointer">
                        <FiBell className="text-white" />
                    </button> */}

                    {/* <button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#30363d] hover:bg-[#161b22] cursor-pointer">
                        <GoGitBranch className="text-white" />
                    </button> */}

                    <button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#30363d] hover:bg-[#161b22] cursor-pointer">
                        <Link to="/repo" >
                            <GoRepo className="text-white" /></Link>
                    </button>
                    <div className="relative ml-2" ref={profileRef}>
                        <button
                            onClick={() => setOpenProfile(!openProfile)}
                            className="h-11 w-11 rounded-full border-2 border-[#8b5cf6] flex items-center justify-center hover:bg-[#161b22]"
                        >
                            <CgProfile className="text-white text-4xl" />
                        </button>

                        {openProfile && (
                            <div className="absolute right-0 mt-2 w-64 rounded-lg border border-[#30363d] bg-[#161b22] shadow-xl overflow-hidden">

                                <div className="px-4 py-3 border-b border-[#30363d]">
                                    <p className="text-white font-semibold">
                                        {localStorage.getItem("username") || "Developer"}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {localStorage.getItem("email")}
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate("/profile")}
                                    className="w-full text-left px-4 py-3 hover:bg-[#21262d] text-white"
                                >
                                    My Profile
                                </button>

                                <button
                                    onClick={() => navigate("/profile/repositories")}
                                    className="w-full text-left px-4 py-3 hover:bg-[#21262d] text-white"
                                >
                                    Repository
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#21262d] text-red-400"
                                >
                                    <FiLogOut />
                                    Logout
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
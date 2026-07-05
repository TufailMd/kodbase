import { Link, useNavigate, useParams } from "react-router-dom";
import {
    FiMenu,
    FiSearch,
    FiPlus,
    FiBell,
} from "react-icons/fi";
import { PiFileCodeFill } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import {
    GoRepo,
    GoGitBranch,
} from "react-icons/go";



const Header = () => {
    const navigate = useNavigate();
    const pageName = window.location.pathname.split("/")[1] || "Dashboard";

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
                    <div className="h-11 w-11 rounded-full border-2 border-[#8b5cf6] flex items-center justify-center ml-2">
                        <Link to="/profile">
                            <CgProfile className="text-white text-4xl" />
                        </Link>

                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
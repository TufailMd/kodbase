import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Book,
    Calendar,
    FolderGit2,
    Bell,
    ChevronUp
} from "lucide-react";

const Dashboard = () => {
    const [isActive, setIsActive] = useState(false);
    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQueryForAllRepo, setSearchQueryForAllRepo] = useState("");
    const [searchResultsForAllRepo, setSearchResultsForAllRepo] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        const fetchRepositories = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3000/repo/user/${userId}`
                );
                setRepositories(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchSuggestedRepositories = async () => {
            try {
                const res = await axios.get("http://localhost:3000/repo/all");
                setSuggestedRepositories(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchRepositories();
        fetchSuggestedRepositories();
    }, []);

    useEffect(() => {
        if (searchQuery === "") {
            setSearchResults(repositories);
        } else {
            const filtered = repositories.filter((repo) =>
                repo.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered);
        }
    }, [searchQuery, repositories]);

    useEffect(() => {
        if (searchQueryForAllRepo === "") {
            setSearchResultsForAllRepo(suggestedRepositories);
        } else {
            const filtered = suggestedRepositories.filter((repo) =>
                repo.name.toLowerCase().includes(searchQueryForAllRepo.toLowerCase())
            );
            console.log("Filtered: ", filtered);

            setSearchResultsForAllRepo(filtered);
        }
    }, [searchQueryForAllRepo, suggestedRepositories]);



    return (
        <section className="min-h-screen flex bg-[#0d1117] text-white">

            {/* LEFT SIDEBAR */}

            <aside className="w-72 bg-[#161b22] border-r border-[#30363d] p-6 flex flex-col">

                <h2 className="text-xl font-bold mb-8">
                    KodBase
                </h2>

                <nav className="space-y-2">

                    <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 bg-[#21262d]">
                        <Book size={18} />
                        Home
                    </button>

                    <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-[#21262d] transition">
                        <FolderGit2 size={18} />
                        Feed
                    </button>

                </nav>

                <hr className="border-[#30363d] my-8" />

                <div className="flex justify-between items-center mb-5">
                    <h3 className="font-semibold text-sm text-gray-300">
                        Suggested Repositories
                    </h3>

                    {isActive ? <ChevronUp onClick={() => setIsActive(!isActive)}
                        size={18}
                        className="text-gray-400 cursor-pointer"
                    /> : <Search onClick={() => setIsActive(!isActive)}
                        size={18}
                        className="text-gray-400 cursor-pointer"
                    />}
                </div>
                <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchQueryForAllRepo}
                    onChange={(e) => setSearchQueryForAllRepo(e.target.value)}
                    className={`${!isActive ? "hidden" : ""}   w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-4 outline-none focus:border-blue-500 placeholder:text-gray-500`}
                />

                <div className="space-y-2 overflow-y-auto">

                    {searchResultsForAllRepo.length === 0 ? (
                        <p className="text-gray-400 text-sm">No repositories found.</p>
                    ) : (
                        searchResultsForAllRepo.map((repo) => (
                            <div
                                key={repo._id}
                                className="rounded-md px-3 py-3 hover:bg-[#21262d] cursor-pointer transition border border-transparent hover:border-[#30363d]"
                            >
                                <p className="font-medium text-sm">
                                    {repo.name}
                                </p>
                            </div>
                        ))
                    )}

                </div>
            </aside>

            {/* MAIN */}

            <main className="flex-1 p-10 overflow-y-auto">

                <div className="flex justify-between items-center">

                    <h1 className="text-4xl font-bold">
                        Good Evening 👋
                    </h1>

                    <Bell className="cursor-pointer" />

                </div>

                {/* Search Box */}

                <div className="mt-8">

                    <input
                        type="text"
                        placeholder="Search repositories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-4 outline-none focus:border-blue-500 placeholder:text-gray-500"
                    />

                </div>

                {/* Buttons */}

                <div className="flex gap-4 mt-8">

                    <button className="bg-[#238636] px-5 py-2 rounded-md hover:bg-[#2ea043] transition">
                        New Repository
                    </button>

                    <button className="bg-[#21262d] border border-[#30363d] px-5 py-2 rounded-md hover:bg-[#30363d] transition">
                        Explore
                    </button>

                </div>

                {/* Repository Cards */}

                <div className="mt-10 space-y-5">

                    {searchResults.length === 0 ? (
                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 text-center text-gray-400">
                            No repositories found.
                        </div>
                    ) : (
                        searchResults.map((repo) => (
                            <div onClick={() => (navigate(`/repo/${repo.name}`))}
                                key={repo._id}
                                className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 hover:border-[#58a6ff] transition-all hover:-translate-y-1 cursor-pointer"
                            >
                                <div className="flex justify-between">

                                    <div>

                                        <h3 className="text-xl font-semibold text-[#58a6ff]">
                                            {repo.name}
                                        </h3>

                                        <p className="text-gray-400 mt-2">
                                            {repo.description ||
                                                "No description available"}
                                        </p>

                                    </div>

                                    <button className="border border-[#30363d] rounded-full px-4 py-1 text-sm hover:bg-[#21262d]">
                                        Public
                                    </button>

                                </div>

                                <div className="flex gap-6 mt-6 text-sm text-gray-400">

                                    <span>⭐ 0 Stars</span>

                                    <span>🍴 0 Forks</span>

                                    <span>Updated recently</span>

                                </div>

                            </div>
                        ))
                    )}

                </div>

            </main>

            {/* RIGHT SIDEBAR */}

            <aside className="w-80 border-l border-[#30363d] bg-[#0d1117] p-6">

                <h2 className="text-xl font-semibold mb-6">
                    Upcoming Events
                </h2>

                <div className="space-y-5">

                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">

                        <div className="flex items-center gap-2 text-[#58a6ff]">

                            <Calendar size={18} />

                            <span>July 6</span>

                        </div>

                        <h3 className="mt-3 font-semibold">
                            Tech Conference
                        </h3>

                        <p className="text-gray-400 text-sm mt-2">
                            Join developers from around the world.
                        </p>

                    </div>

                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">

                        <div className="flex items-center gap-2 text-[#58a6ff]">

                            <Calendar size={18} />

                            <span>July 18</span>

                        </div>

                        <h3 className="mt-3 font-semibold">
                            Developer Meetup
                        </h3>

                        <p className="text-gray-400 text-sm mt-2">
                            Meet local developers and network.
                        </p>

                    </div>

                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">

                        <div className="flex items-center gap-2 text-[#58a6ff]">

                            <Calendar size={18} />

                            <span>July 25</span>

                        </div>

                        <h3 className="mt-3 font-semibold">
                            React Summit
                        </h3>

                        <p className="text-gray-400 text-sm mt-2">
                            Latest updates from the React ecosystem.
                        </p>

                    </div>

                </div>

            </aside>

        </section>
    );
};

export default Dashboard;
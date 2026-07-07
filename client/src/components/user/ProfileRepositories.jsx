import { useEffect, useState } from "react";
import axios from "axios";
import {
    Search,
    Star,
    ChevronDown,
    BookOpen,
} from "lucide-react";

const ProfileRepositories = () => {
    const [repositories, setRepositories] = useState([]);
    const [filteredRepositories, setFilteredRepositories] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const userId = localStorage.getItem("userId");

                const res = await axios.get(
                    `http://localhost:3000/repo/user/${userId}`
                );

                setRepositories(res.data);
                setFilteredRepositories(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchRepositories();
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredRepositories(repositories);
        } else {
            setFilteredRepositories(
                repositories.filter((repo) =>
                    repo.name.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, repositories]);

    return (
        <main className="flex-1">

            {/* Top Controls */}

            <div className="flex flex-wrap gap-3 justify-between items-center border-b border-[#30363d] pb-4">

                <div className="relative flex-1 min-w-[250px]">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Find a repository..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-2 pl-10 pr-4 outline-none focus:border-blue-500"
                    />

                </div>

                <div className="flex gap-2 flex-wrap">

                    <button className="px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-md flex items-center gap-2 hover:bg-[#30363d]">
                        Type
                        <ChevronDown size={16} />
                    </button>

                    <button className="px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-md flex items-center gap-2 hover:bg-[#30363d]">
                        Language
                        <ChevronDown size={16} />
                    </button>

                    <button className="px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-md flex items-center gap-2 hover:bg-[#30363d]">
                        Sort
                        <ChevronDown size={16} />
                    </button>

                    <button className="px-5 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] font-medium">
                        New
                    </button>

                </div>

            </div>

            {/* Repository List */}

            <div className="divide-y divide-[#30363d]">

                {filteredRepositories.length === 0 ? (

                    <div className="text-center py-12 text-gray-400">
                        No repositories found.
                    </div>

                ) : (

                    filteredRepositories.map((repo) => (

                        <div
                            key={repo._id}
                            className="py-8 flex justify-between gap-8"
                        >

                            <div className="flex-1">

                                <div className="flex items-center gap-3">

                                    <h2 className="text-3xl font-semibold text-[#58a6ff] hover:underline cursor-pointer">
                                        {repo.name}
                                    </h2>

                                    <span className="px-2 py-1 text-xs border border-[#30363d] rounded-full text-gray-300">
                                        {repo.visibility || "Public"}
                                    </span>

                                </div>

                                <p className="text-gray-400 mt-3 max-w-3xl">
                                    {repo.description || "No description available"}
                                </p>

                                <div className="flex gap-6 mt-5 text-sm text-gray-400">

                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                                        JavaScript
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <BookOpen size={15} />
                                        MIT
                                    </span>

                                    <span>
                                        Updated recently
                                    </span>

                                </div>

                            </div>

                            {/* Right */}

                            <div className="flex flex-col items-end justify-between">

                                <button className="flex items-center gap-2 border border-[#30363d] rounded-md px-5 py-2 hover:bg-[#21262d]">

                                    <Star size={18} />

                                    Star

                                    <ChevronDown size={15} />

                                </button>

                                {/* Contribution Graph */}

                                <div className="w-44 h-10 flex items-end">

                                    <div className="w-full h-[2px] bg-green-700 rounded-full relative">

                                        <div className="absolute right-4 -top-1 w-2 h-2 rounded-full bg-green-500"></div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </main>
    );
};

export default ProfileRepositories;
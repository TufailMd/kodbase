import {
    ChevronDown,
    GitBranch,
    Search,
    Plus,
    Code2,
    Tag,
} from "lucide-react";
import { useState } from "react";
import CodeDropdown from "./CodeDropdown";

const RepositoryToolbar = ({
    branch = "main",
    branchCount = 1,
    tagCount = 0,
    repo

}) => {
    const [openCode, setOpenCode] = useState(false);
    return (
        <div className="flex items-center justify-between py-5">

            {/* Left */}

            <div className="flex items-center gap-3">

                {/* Branch */}

                <button className="github-btn">
                    <GitBranch size={16} />
                    {branch}
                    <ChevronDown size={16} />
                </button>

                <div className="flex items-center gap-2 text-gray-300">

                    <GitBranch size={16} />

                    <span>{branchCount} Branch</span>

                </div>

                <div className="flex items-center gap-2 text-gray-300">

                    <Tag size={16} />

                    <span>{tagCount} Tags</span>

                </div>

            </div>

            {/* Right */}

            <div className="flex items-center gap-3">

                {/* Search */}

                <div className="relative">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        placeholder="Go to file"
                        className="
                        w-72
                        bg-[#0d1117]
                        border
                        border-[#30363d]
                        rounded-md
                        py-2
                        pl-10
                        outline-none
                        focus:border-[#58a6ff]"
                    />

                </div>

                {/* Add file */}

                <button className="github-btn">
                    <Plus size={16} />
                    Add file
                    <ChevronDown size={16} />
                </button>

                {/* Code */}

                <div className="relative">

                    <button
                        onClick={() => setOpenCode(!openCode)}
                        className="bg-[#238636] hover:bg-[#2ea043] rounded-md px-5 py-2 flex items-center gap-2"
                    >

                        <Code2 size={17} />

                        Code

                        <ChevronDown size={16} />

                    </button>

                    {openCode && (
                        <CodeDropdown repo={repo} />
                    )}

                </div>

            </div>

        </div>
    );
};

export default RepositoryToolbar;
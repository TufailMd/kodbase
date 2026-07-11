import {
    Eye,
    Star,
    GitFork,
    Pin,
} from "lucide-react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RepositoryHeader = ({ repo }) => {
    const navigate = useNavigate();
    return (
        <div className="border-b border-[#30363d] bg-[#0d1117]">

            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <div className="flex items-center gap-3">

                    <img
                        src={repo.owner?.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full"
                    />

                    <h1 className="text-3xl font-semibold text-[#58a6ff]">
                        {repo.name}
                    </h1>

                    <span className="border border-[#30363d] rounded-full px-3 py-1 text-sm">
                        {repo.visibility ? "Public" : "Private"}
                    </span>

                </div>

                <div className="flex gap-3">

                    <button className="github-btn">
                        <Pin size={17} />
                        Pin
                    </button>

                    <button className="github-btn">
                        <Eye size={17} />
                        Watch
                        <span>0</span>
                    </button>

                    <button className="github-btn">
                        <GitFork size={17} />
                        Fork
                        <span>0</span>
                    </button>

                    <button className="github-btn">
                        <Star size={17} />
                        Star
                        <span>0</span>
                    </button>

                    <button
                        onClick={() =>
                            navigate(`/repo/${repo.name}/settings`)
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-md border border-[#30363d] hover:bg-[#21262d]"
                    >
                        <Settings size={18} />

                        Settings
                    </button>

                </div>

            </div>

        </div>
    );
};

export default RepositoryHeader;
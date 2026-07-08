import { GitCommit } from "lucide-react";

const CommitBar = ({
    latestCommit,
    totalCommits = 0,
}) => {

    if (!latestCommit) return null;

    return (
        <div className="border border-[#30363d] rounded-t-lg bg-[#161b22]">

            <div className="flex justify-between items-center px-5 py-3">

                {/* Left */}

                <div className="flex items-center gap-3">

                    <img
                        src="https://avatars.githubusercontent.com/u/9919?s=200&v=4"
                        alt=""
                        className="w-8 h-8 rounded-full"
                    />

                    <span className="font-semibold">
                        {latestCommit.author || "Unknown"}
                    </span>

                    <span className="text-gray-400">
                        {latestCommit.message || "Initial commit"}
                    </span>

                </div>

                {/* Right */}

                <div className="flex items-center gap-5">

                    <span className="text-[#58a6ff] font-mono">
                        {latestCommit.id?.slice(0, 7)}
                    </span>

                    <div className="flex items-center gap-2">

                        <GitCommit size={16} />

                        <span>
                            {totalCommits} commits
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default CommitBar;
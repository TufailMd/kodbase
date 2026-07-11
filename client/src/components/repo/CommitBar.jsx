import { GitCommit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const CommitBar = ({
    latestCommit,
    totalCommits,
    commitMessage,
    commitDate,
}) => {

    if (!latestCommit) return null;

    return (

        <div className="border border-[#30363d] rounded-t-lg bg-[#161b22]">

            <div className="flex items-center justify-between px-5 py-3">

                {/* Left */}

                <div className="flex items-center gap-3">

                    <img
                        src="https://avatars.githubusercontent.com/u/9919?s=200&v=4"
                        alt=""
                        className="w-8 h-8 rounded-full"
                    />

                    <span className="font-semibold">
                        codex
                    </span>

                    <span className="text-gray-400">

                        {commitMessage}

                    </span>

                </div>

                {/* Right */}

                <div className="flex items-center gap-6 text-sm">

                    <span className="font-mono text-[#58a6ff]">

                        {latestCommit.slice(0, 7)}

                    </span>

                    <span className="text-gray-400">

                        {formatDistanceToNow(new Date(commitDate), {
                            addSuffix: true,
                        })}

                    </span>

                    <div className="flex items-center gap-2">

                        <GitCommit size={16} />

                        {totalCommits} commit{totalCommits > 1 && "s"}

                    </div>

                </div>

            </div>

        </div>

    );

};

export default CommitBar;
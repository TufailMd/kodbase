import { useState } from "react";
import {
    Copy,
    Check,
    Download,
    Monitor,
} from "lucide-react";

const CodeDropdown = ({ repo }) => {
    const [copied, setCopied] = useState(false);

    const cloneUrl = `http://localhost:3000/${repo.name}.git`;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(cloneUrl);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <div className="absolute right-0 top-12 w-96 rounded-lg border border-[#30363d] bg-[#161b22] shadow-xl z-50">

            <div className="border-b border-[#30363d] px-4 py-3 font-semibold">
                Clone Repository
            </div>

            <div className="p-4">

                <div className="flex gap-5 text-sm mb-4">

                    <button className="border-b-2 border-green-500 pb-1">
                        HTTPS
                    </button>

                    <button className="text-gray-400">
                        SSH
                    </button>

                    <button className="text-gray-400">
                        CLI
                    </button>

                </div>

                <div className="flex">

                    <input
                        readOnly
                        value={cloneUrl}
                        className="
                        flex-1
                        bg-[#0d1117]
                        border
                        border-[#30363d]
                        rounded-l-md
                        px-3
                        py-2
                        text-sm
                        outline-none"
                    />

                    <button
                        onClick={handleCopy}
                        className="
                        border
                        border-l-0
                        border-[#30363d]
                        rounded-r-md
                        px-4"
                    >
                        {copied
                            ? <Check size={18} />
                            : <Copy size={18} />
                        }
                    </button>

                </div>

                <div className="mt-6 space-y-3">

                    <button className="flex items-center gap-3 hover:text-[#58a6ff]">

                        <Monitor size={18} />

                        Open with Desktop

                    </button>

                    <button className="flex items-center gap-3 hover:text-[#58a6ff]">

                        <Download size={18} />

                        Download ZIP

                    </button>

                </div>

            </div>

        </div>
    );
};

export default CodeDropdown;
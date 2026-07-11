import { useParams } from "react-router-dom";
import { FiCopy } from "react-icons/fi";

const QuickSetup = () => {
    const { name } = useParams();

    const repoUrl = `http://localhost:3000/${name}.git`;

    const commands = [
        "node index.js init",
        `node index.js remote add origin ${repoUrl}`,
        "node index.js add .",
        'node index.js commit "Initial commit"',
        "node index.js push",
    ];

    const copyCommand = async (command) => {
        await navigator.clipboard.writeText(command);
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-white flex justify-center py-12 px-6">
            <div className="w-full max-w-5xl">

                <h1 className="text-3xl font-bold">
                    Quick setup
                </h1>

                <p className="text-gray-400 mt-2">
                    Get started by pushing your project from the command line.
                </p>

                <div className="mt-8 rounded-lg border border-[#30363d] bg-[#161b22]">

                    <div className="border-b border-[#30363d] px-5 py-4">
                        <h2 className="font-semibold text-lg">
                            Push an existing repository
                        </h2>
                    </div>

                    <div className="p-5 space-y-4">

                        {commands.map((command) => (
                            <div
                                key={command}
                                className="flex items-center justify-between rounded-md bg-[#0d1117] px-4 py-3 border border-[#30363d]"
                            >
                                <code>{command}</code>

                                <button
                                    onClick={() => copyCommand(command)}
                                    className="hover:text-blue-400"
                                >
                                    <FiCopy size={18} />
                                </button>
                            </div>
                        ))}

                    </div>

                </div>

            </div>
        </div>
    );
};

export default QuickSetup;
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const FileViewer = ({
    loading,
    selectedFile,
    fileContent,
}) => {

    if (!selectedFile) {
        return (
            <div className="mt-6 border border-[#30363d] rounded-lg h-96 flex items-center justify-center text-gray-400">
                Select a file to view its content.
            </div>
        );
    }

    return (
        <div className="mt-6 border border-[#30363d] rounded-lg overflow-hidden">

            {/* Header */}

            <div className="bg-[#161b22] border-b border-[#30363d] px-5 py-3 flex justify-between">

                <span className="font-semibold">
                    {selectedFile}
                </span>

                <div className="flex gap-4 text-sm text-gray-400">

                    <button className="hover:text-white">
                        Raw
                    </button>

                    <button className="hover:text-white">
                        Blame
                    </button>

                    <button className="hover:text-white">
                        History
                    </button>

                </div>

            </div>

            {/* Code */}

            {loading ? (

                <div className="h-96 flex items-center justify-center">

                    Loading...

                </div>

            ) : (

                <SyntaxHighlighter
                    language="javascript"
                    style={vscDarkPlus}
                    showLineNumbers
                    customStyle={{
                        margin: 0,
                        background: "#0d1117",
                        minHeight: "500px",
                    }}
                >
                    {fileContent}
                </SyntaxHighlighter>

            )}

        </div>
    );
};

export default FileViewer;
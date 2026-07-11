import Editor from "@monaco-editor/react";

const getLanguage = (fileName = "") => {
    const ext = fileName.split(".").pop()?.toLowerCase();

    switch (ext) {
        case "js":
        case "jsx":
            return "javascript";

        case "ts":
        case "tsx":
            return "typescript";

        case "json":
            return "json";

        case "html":
            return "html";

        case "css":
            return "css";

        case "md":
            return "markdown";

        case "py":
            return "python";

        case "java":
            return "java";

        case "cpp":
        case "cc":
        case "cxx":
            return "cpp";

        case "c":
            return "c";

        case "xml":
            return "xml";

        case "yml":
        case "yaml":
            return "yaml";

        case "sh":
            return "shell";

        default:
            return "plaintext";
    }
};

const FileViewer = ({
    loading,
    selectedFile,
    fileContent,
}) => {

    if (loading) {
        console.log(fileContent);
        return (
            <div className="flex items-center justify-center h-[600px] border border-[#30363d] rounded-lg bg-[#0d1117]">
                Loading...
            </div>
        );
    }

    if (!selectedFile) {
        console.log(selectedFile);
        return (
            <div className="flex items-center justify-center h-[600px] border border-[#30363d] rounded-lg bg-[#0d1117] text-gray-500">
                Select a file to view.
            </div>
        );
    }

    return (
        <div className="rounded-lg overflow-hidden border border-[#30363d]">

            <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex justify-between items-center">

                <span className="font-medium">

                    {selectedFile}

                </span>

                <span className="text-xs text-gray-400">

                    {getLanguage(selectedFile)}

                </span>

            </div>

            <Editor
                height="70vh"
                theme="vs-dark"
                language={getLanguage(selectedFile)}
                value={fileContent}
                options={{
                    readOnly: true,
                    minimap: {
                        enabled: false,
                    },
                    scrollBeyondLastLine: false,
                    wordWrap: "off",
                    fontSize: 14,
                    tabSize: 4,
                    renderWhitespace: "selection",
                    automaticLayout: true,
                    padding: {
                        top: 20,
                    },
                }}
            />

        </div>
    );
};

export default FileViewer;
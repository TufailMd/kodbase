import {
    FileText,
    Folder,
} from "lucide-react";

const FileExplorer = ({
    files,
    selectedFile,
    onFileClick,
}) => {

    return (

        <div className="border border-[#30363d] rounded-lg overflow-hidden">

            {/* Header */}

            <div className="bg-[#161b22] border-b border-[#30363d] px-5 py-3 grid grid-cols-12 text-sm font-semibold text-gray-300">

                <div className="col-span-5">
                    Name
                </div>

                <div className="col-span-5">
                    Last Commit
                </div>

                <div className="col-span-2 text-right">
                    Updated
                </div>

            </div>

            {/* Files */}

            {files.length === 0 ? (

                <div className="py-20 text-center text-gray-400">

                    No files pushed yet.

                </div>

            ) : (

                files.map((file, index) => {

                    const isFolder = file.includes("/");

                    return (

                        <button
                            key={index}
                            onClick={() => onFileClick(file)}
                            className={`

                                w-full

                                grid

                                grid-cols-12

                                items-center

                                px-5

                                py-3

                                border-b

                                border-[#30363d]

                                hover:bg-[#161b22]

                                ${selectedFile === file
                                    ? "bg-[#161b22]"
                                    : ""
                                }

                            `}
                        >

                            {/* Name */}

                            <div className="col-span-5 flex items-center gap-3">

                                {isFolder ? (

                                    <Folder
                                        size={18}
                                        className="text-[#58a6ff]"
                                    />

                                ) : (

                                    <FileText
                                        size={18}
                                        className="text-gray-300"
                                    />

                                )}

                                <span className="hover:text-[#58a6ff]">

                                    {file}

                                </span>

                            </div>

                            {/* Commit */}

                            <div className="col-span-5 text-left text-gray-400">

                                Initial commit

                            </div>

                            {/* Updated */}

                            <div className="col-span-2 text-right text-gray-500 text-sm">

                                just now

                            </div>

                        </button>

                    );

                })

            )}

        </div>

    );

};

export default FileExplorer;
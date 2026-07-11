import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    ChevronDown,
    Folder,
    FolderOpen,
    FileCode2,
    FileJson,
    FileText,
    Image,
} from "lucide-react";

const getFileIcon = (name) => {

    const ext = name.split(".").pop();

    switch (ext) {

        case "js":
        case "jsx":
        case "ts":
        case "tsx":
            return <FileCode2 size={17} className="text-[#58a6ff]" />;

        case "json":
            return <FileJson size={17} className="text-yellow-400" />;

        case "md":
            return <FileText size={17} className="text-green-400" />;

        case "png":
        case "jpg":
        case "jpeg":
        case "svg":
            return <Image size={17} className="text-purple-400" />;

        default:
            return <FileText size={17} className="text-gray-400" />;
    }
};

const TreeNode = ({
    node,
    selectedFile,
    onFileClick,
    level = 0,
}) => {

    const [expanded, setExpanded] = useState(true);

    const isFolder = node.type === "folder";

    return (

        <div>

            <button
                onClick={() => {

                    if (isFolder) {

                        setExpanded(!expanded);

                    } else {

                        onFileClick(node.path);

                    }

                }}
                className={`
                    group
                    w-full
                    flex
                    items-center
                    gap-2
                    py-1.5
                    rounded-md
                    hover:bg-[#161b22]
                    transition
                    ${selectedFile === node.path
                        ? "bg-[#1f2937]"
                        : ""}
                `}
                style={{
                    paddingLeft: `${level * 18 + 12}px`,
                    paddingRight: "12px",
                }}
            >

                {isFolder ? (

                    expanded ?

                        <ChevronDown
                            size={14}
                            className="text-gray-500"
                        />

                        :

                        <ChevronRight
                            size={14}
                            className="text-gray-500"
                        />

                ) : (

                    <div className="w-[14px]" />

                )}

                {isFolder ?

                    expanded ?

                        <FolderOpen
                            size={17}
                            className="text-[#58a6ff]"
                        />

                        :

                        <Folder
                            size={17}
                            className="text-[#58a6ff]"
                        />

                    :

                    getFileIcon(node.name)
                }

                <span className="flex-1 text-left text-sm">

                    {node.name}

                </span>

                {isFolder && (

                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition">

                        {node.children.length}

                    </span>

                )}

            </button>

            <AnimatePresence>

                {isFolder && expanded && (

                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: .2,
                        }}
                    >

                        {node.children.map(child => (

                            <TreeNode
                                key={child.path}
                                node={child}
                                level={level + 1}
                                selectedFile={selectedFile}
                                onFileClick={onFileClick}
                            />

                        ))}

                    </motion.div>

                )}

            </AnimatePresence>

        </div>

    );

};

export default TreeNode;
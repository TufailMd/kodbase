import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const TreeNode = ({ node }) => {
    const [open, setOpen] = useState(true);

    const navigate = useNavigate();
    const { name: repoName } = useParams();

    if (node.type === "folder") {
        return (
            <div>

                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#161b22] rounded"
                >
                    {open ? (
                        <ChevronDown size={14} />
                    ) : (
                        <ChevronRight size={14} />
                    )}

                    <Folder
                        size={16}
                        className="text-[#58a6ff]"
                    />

                    <span>{node.name}</span>
                </button>

                {open && (
                    <div className="ml-5">

                        {node.children.map((child) => (

                            <TreeNode
                                key={child.path}
                                node={child}
                            />

                        ))}

                    </div>
                )}

            </div>
        );
    }

    return (
        <button
            onClick={() =>
                navigate(
                    `/repo/${repoName}/blob/main/${node.path}`
                )
            }
            className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#161b22] rounded"
        >

            <FileText size={16} />

            {node.name}

        </button>
    );
};

export default TreeNode;
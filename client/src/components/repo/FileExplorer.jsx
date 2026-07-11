import buildTree from "../../utils/buildTree";
import TreeNode from "../repository/TreeNode";

const FileExplorer = ({
    files,
    selectedFile,
    onFileClick,
}) => {

    const tree = buildTree(files);

    if (!files.length) {
        return (
            <div className="rounded-lg border border-[#30363d] bg-[#0d1117]">

                <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22] font-semibold">
                    Files
                </div>

                <div className="py-20 text-center text-gray-500">

                    No files found.

                </div>

            </div>
        );
    }

    return (

        <div className="rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden">

            {/* Header */}

            <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#161b22]">

                <h2 className="font-semibold">

                    Files

                </h2>

                <span className="text-sm text-gray-400">

                    {files.length} file{files.length !== 1 ? "s" : ""}

                </span>

            </div>

            {/* Tree */}

            <div className="py-2">

                {tree.map(node => (

                    <TreeNode
                        key={node.path}
                        node={node}
                        selectedFile={selectedFile}
                        onFileClick={onFileClick}
                    />

                ))}

            </div>

        </div>

    );

};

export default FileExplorer;
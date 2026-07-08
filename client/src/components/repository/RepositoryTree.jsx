import TreeNode from "./TreeNode";

const RepositoryTree = ({ tree }) => {

    return (

        <div className="space-y-1">

            {tree.map(node => (

                <TreeNode
                    key={node.path}
                    node={node}
                />

            ))}

        </div>

    );

};

export default RepositoryTree;
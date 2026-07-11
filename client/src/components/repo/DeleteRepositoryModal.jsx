import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

const DeleteRepositoryModal = ({
    isOpen,
    onClose,
    repository,
    onDelete,
    loading,
}) => {

    const [repoName, setRepoName] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setRepoName("");
        }
    }, [isOpen]);

    if (!isOpen || !repository) return null;

    const handleDelete = () => {

        if (repoName !== repository.name) {
            return;
        }

        onDelete();

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="w-full max-w-xl rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-[#30363d] px-6 py-4">

                    <div className="flex items-center gap-3">

                        <AlertTriangle
                            size={22}
                            className="text-red-500"
                        />

                        <h2 className="text-xl font-semibold text-red-500">

                            Delete Repository

                        </h2>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-md p-1 hover:bg-[#21262d]"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Body */}

                <div className="space-y-5 p-6">

                    <p className="text-gray-300">

                        This action{" "}

                        <span className="font-semibold text-red-500">

                            cannot be undone.

                        </span>

                    </p>

                    <p className="text-gray-400">

                        This will permanently delete the repository{" "}

                        <span className="font-semibold text-white">

                            {repository.name}

                        </span>

                        , including all commits and associated data.

                    </p>

                    <div>

                        <label className="mb-2 block text-sm text-gray-400">

                            Type{" "}

                            <span className="rounded bg-[#0d1117] px-2 py-1 font-mono text-white">

                                {repository.name}

                            </span>{" "}

                            to confirm.

                        </label>

                        <input
                            value={repoName}
                            onChange={(e) => setRepoName(e.target.value)}
                            placeholder={repository.name}
                            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-4 py-2 outline-none transition focus:border-red-500"
                        />

                    </div>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 border-t border-[#30363d] px-6 py-4">

                    <button
                        onClick={onClose}
                        className="rounded-md border border-[#30363d] px-4 py-2 hover:bg-[#21262d]"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={
                            repoName !== repository.name ||
                            loading
                        }
                        onClick={handleDelete}
                        className="rounded-md bg-red-600 px-5 py-2 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete Repository"}
                    </button>

                </div>

            </div>

        </div>

    );

};

export default DeleteRepositoryModal;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteRepositoryModal from "./DeleteRepositoryModal";

const RepositorySettings = () => {
    const { name } = useParams();
    const navigate = useNavigate();

    const [repo, setRepo] = useState(null);

    const [repoName, setRepoName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchRepository();
    }, []);

    const fetchRepository = async () => {
        try {
            const { data } = await axios.get(
                `http://localhost:3000/repo/name/${name}`
            );

            setRepo(data);
            setRepoName(data.name);
            setDescription(data.description || "");
        } catch (err) {
            console.error(err);
        }
    };

    const updateRepository = async () => {
        try {
            setLoading(true);

            const { data } = await axios.put(
                `http://localhost:3000/repo/update/${repo._id}`,
                {
                    name: repoName,
                    description,
                }
            );

            toast.success("Repository updated successfully");

            navigate(`/repo/${data.repository.name}`);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Unable to update repository"
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteRepository = async () => {
        try {

            setLoading(true);

            await axios.delete(
                `http://localhost:3000/repo/delete/${repo._id}`
            );

            toast.success("Repository deleted successfully");

            navigate("/");

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Unable to delete repository"
            );

        } finally {

            setLoading(false);

        }
    };

    const toggleVisibility = async () => {

        try {

            const { data } = await axios.patch(
                `http://localhost:3000/repo/toggle/${repo._id}`
            );

            setRepo(data.repository);

            toast.success(
                `Repository is now ${data.repository.visibility ? "Public" : "Private"
                }`
            );

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Unable to update visibility"
            );

        }

    };

    if (!repo) return null;

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">

            <div className="max-w-4xl mx-auto py-10 px-4">

                <h1 className="text-3xl font-bold mb-8">
                    Repository Settings
                </h1>

                {/* ---------------- General ---------------- */}

                <div className="rounded-lg border border-[#30363d] bg-[#161b22]">

                    <div className="border-b border-[#30363d] px-6 py-4">

                        <h2 className="text-xl font-semibold">

                            General

                        </h2>

                    </div>

                    <div className="p-6">

                        <label className="block mb-2 text-sm font-medium">
                            Repository Name
                        </label>

                        <input
                            value={repoName}
                            onChange={(e) => setRepoName(e.target.value)}
                            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-4 py-2"
                        />

                        <label className="block mt-6 mb-2 text-sm font-medium">
                            Description
                        </label>

                        <textarea
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-4 py-2"
                        />

                        <button
                            onClick={updateRepository}
                            disabled={loading}
                            className="mt-6 rounded-md bg-green-600 px-5 py-2 hover:bg-green-700"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>

                    </div>

                </div>

                {/* ---------------- Visibility ---------------- */}

                <div className="mt-8 rounded-lg border border-[#30363d] bg-[#161b22]">

                    <div className="border-b border-[#30363d] px-6 py-4">

                        <h2 className="text-xl font-semibold">

                            Visibility

                        </h2>

                    </div>

                    <div className="flex items-center justify-between p-6">

                        <div>

                            <h3 className="font-semibold">

                                {repo.visibility
                                    ? "🌍 Public Repository"
                                    : "🔒 Private Repository"}

                            </h3>

                            <p className="mt-2 text-sm text-gray-400">

                                {repo.visibility
                                    ? "Anyone can view this repository."
                                    : "Only you and collaborators can access this repository."}

                            </p>

                        </div>

                        <button
                            onClick={toggleVisibility}
                            className="rounded-md border border-[#30363d] px-4 py-2 hover:bg-[#21262d]"
                        >
                            Make {repo.visibility ? "Private" : "Public"}
                        </button>

                    </div>

                </div>

                {/* ---------------- Danger Zone ---------------- */}

                <div className="mt-8 rounded-lg border border-red-700 bg-[#161b22]">

                    <div className="border-b border-red-700 px-6 py-4">

                        <h2 className="text-xl font-semibold text-red-500">

                            Danger Zone

                        </h2>

                    </div>

                    <div className="flex items-center justify-between p-6">

                        <div>

                            <h3 className="font-semibold">

                                Delete this repository

                            </h3>

                            <p className="mt-2 text-sm text-gray-400">

                                Once deleted, this repository and all of its commits will be permanently removed.

                            </p>

                        </div>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="rounded-md bg-red-600 px-4 py-2 hover:bg-red-700"
                        >
                            Delete Repository
                        </button>

                    </div>

                </div>

                <DeleteRepositoryModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    repository={repo}
                    onDelete={deleteRepository}
                    loading={loading}
                />

            </div>

        </div>
    );
};

export default RepositorySettings;
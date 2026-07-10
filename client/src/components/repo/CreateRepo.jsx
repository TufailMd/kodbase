import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Globe } from "lucide-react";

const CreateRepo = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState(true);
    const [loading, setLoading] = useState(false);

    const username = localStorage.getItem("username");

    const handleCreate = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

            const owner = localStorage.getItem("userId");

            const res = await axios.post(
                "http://localhost:3000/repo/create",
                {
                    name,
                    description,
                    visibility,
                    owner,
                    content: [],
                    issues: [],
                }
            );

            navigate(
                `/repo/${res.data.repository.name}/quick-setup`
            );

        } catch (err) {

            console.log(err);

            alert("Failed to create repository");

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc]">

            <div className="max-w-3xl mx-auto py-12 px-6">

                <h1 className="text-4xl font-bold">
                    Create a new repository
                </h1>

                <p className="text-gray-400 mt-2">
                    A repository contains all your project's files,
                    revision history, and collaboration settings.
                </p>

                <form
                    onSubmit={handleCreate}
                    className="mt-10 space-y-8"
                >

                    {/* Owner / Repo */}

                    <div>

                        <label className="block mb-2 font-semibold">
                            Owner / Repository name
                        </label>

                        <div className="flex gap-3">

                            <input
                                disabled
                                value={username}
                                className="w-48 bg-[#161b22] border border-[#30363d] rounded-md px-4 py-2"
                            />

                            <span className="text-2xl mt-1">/</span>

                            <input
                                required
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="repository-name"
                                className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-2 outline-none focus:border-[#58a6ff]"
                            />

                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                            Great repository names are short and memorable.
                        </p>

                    </div>

                    {/* Description */}

                    <div>

                        <label className="block mb-2 font-semibold">
                            Description
                        </label>

                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Tell everyone what this repository is about."
                            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md p-3 outline-none focus:border-[#58a6ff]"
                        />

                    </div>

                    {/* Visibility */}

                    <div className="space-y-4">

                        <label className="font-semibold">
                            Visibility
                        </label>

                        <div
                            onClick={() => setVisibility(true)}
                            className={`cursor-pointer rounded-lg border p-4 ${visibility
                                ? "border-[#238636]"
                                : "border-[#30363d]"
                                }`}
                        >

                            <div className="flex items-center gap-3">

                                <Globe />

                                <div>

                                    <h3 className="font-semibold">
                                        Public
                                    </h3>

                                    <p className="text-gray-400 text-sm">
                                        Anyone on the internet can see this repository.
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div
                            onClick={() => setVisibility(false)}
                            className={`cursor-pointer rounded-lg border p-4 ${!visibility
                                ? "border-[#238636]"
                                : "border-[#30363d]"
                                }`}
                        >

                            <div className="flex items-center gap-3">

                                <Lock />

                                <div>

                                    <h3 className="font-semibold">
                                        Private
                                    </h3>

                                    <p className="text-gray-400 text-sm">
                                        You choose who can see this repository.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Footer */}

                    <div className="flex justify-end gap-4">

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-5 py-2 border border-[#30363d] rounded-md hover:bg-[#161b22]"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={loading || !name.trim()}
                            className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 px-6 py-2 rounded-md"
                        >
                            {loading
                                ? "Creating..."
                                : "Create repository"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CreateRepo;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditRepo = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadRepo = async () => {
            try {
                const { data } = await axios.put(`http://localhost:3000/repo/update/${id}`, {
                    description,
                    content,
                });

                setDescription(data.description || "");

                if (Array.isArray(data.content)) {
                    setContent(data.content.join("\n"));
                } else {
                    setContent(data.content || "");
                }
            } catch (err) {
                console.error("Error loading repository:", err);
            } finally {
                setLoading(false);
            }
        };

        loadRepo();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            await axios.put(`http://localhost:3000/repo/update/${id}`, {
                description,
                content,
            });

            navigate(`/repo/${id}`);
        } catch (err) {
            console.error("Error updating repository:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="edit-repo">
            <h2>Edit Repository</h2>

            <form onSubmit={handleUpdate}>
                <textarea
                    placeholder="Repository description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <textarea
                    placeholder="Repository content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                />

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default EditRepo;
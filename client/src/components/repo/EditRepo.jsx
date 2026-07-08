import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditRepo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');  // one file at a time

    // Load current repo data on mount
    useEffect(() => {
        const loadRepo = async () => {
            const res = await axios.get(`http://localhost:3000/repo/${id}`);
            setDescription(res.data.description);
        };
        loadRepo();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/repo/update/${id}`, {
                description,
                content
            });
            navigate(`/repo/${id}`);   // Back to detail page

        } catch (err) {
            console.error('Error updating repo', err);
        }
    };

    return (
        <div className="edit-repo">
            <h2>Edit Repository</h2>

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <input
                type="text"
                placeholder="Add a file name"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <button onClick={handleUpdate}>Save Changes</button>
        </div>
    );
};

export default EditRepo;
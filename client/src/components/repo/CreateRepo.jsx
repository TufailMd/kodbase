import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateRepo = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState(true);  // true = public
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const owner = localStorage.getItem('userId');  // Logged-in user's ID

        try {
            await axios.post('http://localhost:3000/repo/create', {
                name,
                description,
                visibility,
                owner,
                content: [],
                issues: []
            });

            navigate('/');   // Back to dashboard after creation

        } catch (err) {
            console.error('Error creating repo', err);
            alert('Failed to create repository');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-repo">
            <h2>Create New Repository</h2>

            <input
                type="text"
                placeholder="Repository name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* Visibility toggle */}
            <div>
                <label>
                    <input
                        type="radio"
                        value="true"
                        checked={visibility === true}
                        onChange={() => setVisibility(true)}
                    />
                    🌍 Public
                </label>
                <label>
                    <input
                        type="radio"
                        value="false"
                        checked={visibility === false}
                        onChange={() => setVisibility(false)}
                    />
                    🔒 Private
                </label>
            </div>

            <button onClick={handleCreate} disabled={loading}>
                {loading ? 'Creating...' : 'Create Repository'}
            </button>
        </div>
    );
};

export default CreateRepo;
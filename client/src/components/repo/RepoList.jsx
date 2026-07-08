// Delete repo
const handleDelete = async (repoId) => {
    const confirmed = window.confirm('Delete this repository?');
    if (!confirmed) return;

    try {
        await axios.delete(`http://localhost:3000/repo/delete/${repoId}`);
        navigate('/');   // Back to dashboard

    } catch (err) {
        console.error('Error deleting repo', err);
    }
};

// Toggle public ↔ private
const handleToggle = async (repoId) => {
    try {
        await axios.patch(`http://localhost:3000/repo/toggle/${repoId}`);

        // Update local state to reflect change immediately (no page reload)
        setRepo(prev => ({ ...prev, visibility: !prev.visibility }));

    } catch (err) {
        console.error('Error toggling visibility', err);
    }
};
import { useRef, useState } from "react";
import axios from "axios";

const EditProfile = ({ userDetails, setUserDetails, setIsEditing, }) => {
    const [name, setName] = useState(userDetails.name || "");
    const [bio, setBio] = useState(userDetails.bio || "");
    const [avatar, setAvatar] = useState(userDetails.avatar || "");
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);


    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setSelectedFile(file);

        const preview = URL.createObjectURL(file);
        setAvatar(preview);
    };

    const handleSave = async () => {
        try {
            const userId = localStorage.getItem("userId");

            const formData = new FormData();

            formData.append("name", name);
            formData.append("bio", bio);

            if (selectedFile) {
                formData.append("avatar", selectedFile);
            }

            const res = await axios.put(
                `http://localhost:3000/updateUserProfileDetails/${userId}`,
                formData
            );

            setUserDetails(res.data.user);

            setIsEditing(false);

            alert(res.data.message);

        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                "Failed to update profile."
            );
        }
    };

    return (
        <div>

            <div className="relative w-fit">

                <img
                    src={avatar}
                    className="w-72 h-72 rounded-full border border-[#30363d]"
                    alt="avatar"
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-3 right-3 bg-[#21262d] rounded p-2.5 hover:bg-[#30363d]"
                >
                    ✏️ Edit
                </button>

            </div>

            <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
            />


            <label className="block mt-6 mb-2 font-semibold">
                Name
            </label>

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md p-2"
            />

            <label className="block mt-4 mb-2 font-semibold">
                Bio
            </label>

            <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md p-2"
            />

            <div className="flex gap-3 mt-6">

                <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-md"
                >
                    Save
                </button>

                <button
                    onClick={() => setIsEditing(false)}
                    className="bg-[#21262d] hover:bg-[#30363d] px-5 py-2 rounded-md"
                >
                    Cancel
                </button>

            </div>

        </div>
    );
};

export default EditProfile;
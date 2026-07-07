import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, Outlet } from "react-router-dom";
import EditProfile from "./EditProfile";

const Profile = () => {
    const [userDetails, setUserDetails] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const userId = localStorage.getItem("userId");

            if (!userId) return;

            try {
                const res = await axios.get(
                    `http://localhost:3000/userProfile/${userId}`
                );

                setUserDetails(res.data);
            } catch (err) {
                console.log("Cannot fetch user details", err);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc]">

            {/* Tabs */}

            <div className="border-b border-[#30363d]">
                <div className="max-w-7xl mx-auto flex gap-8 px-8">

                    <NavLink
                        to="/profile"
                        end
                        className={({ isActive }) =>
                            `py-4 border-b-2 transition ${isActive
                                ? "border-orange-500 text-white"
                                : "border-transparent text-gray-400 hover:text-white"
                            }`
                        }
                    >
                        Overview
                    </NavLink>

                    <NavLink
                        to="/profile/repositories"
                        className={({ isActive }) =>
                            `py-4 border-b-2 transition ${isActive
                                ? "border-orange-500 text-white"
                                : "border-transparent text-gray-400 hover:text-white"
                            }`
                        }
                    >
                        Repositories
                    </NavLink>

                </div>
            </div>

            {/* Main */}

            <div className="max-w-7xl mx-auto px-8 py-8 flex gap-10">

                {/* Left Sidebar */}

                <aside className="w-[320px]">

                    {isEditing ? (
                        <EditProfile
                            userDetails={userDetails}
                            setUserDetails={setUserDetails}
                            setIsEditing={setIsEditing}
                        />
                    ) : (
                        <>
                            <img
                                src={userDetails.avatar}
                                alt={userDetails.name}
                                className="w-72 h-72 rounded-full object-cover border border-[#30363d]"
                            />

                            {userDetails.name && (
                                <h1 className="text-4xl font-bold mt-6">
                                    {userDetails.name}
                                </h1>)}

                            <p className="text-2xl text-gray-400">
                                {userDetails.username}
                            </p>

                            {userDetails.bio && (
                                <p className="mt-5 whitespace-pre-line text-lg">
                                    {userDetails.bio}
                                </p>
                            )}

                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-6 w-full bg-[#21262d] border border-[#30363d] rounded-md py-2 hover:bg-[#30363d] transition"
                            >
                                Edit profile
                            </button>

                            <div className="flex items-center gap-2 mt-6 text-gray-400">

                                <span>
                                    👥{" "}
                                    <span className="font-semibold text-white">
                                        {userDetails.followers?.length || 0}
                                    </span>{" "}
                                    followers
                                </span>

                                <span>·</span>

                                <span>
                                    <span className="font-semibold text-white">
                                        {userDetails.following?.length || 0}
                                    </span>{" "}
                                    following
                                </span>

                            </div>

                            <div className="mt-6 text-gray-500 text-sm">
                                Joined{" "}
                                {userDetails.createdAt
                                    ? new Date(
                                        userDetails.createdAt
                                    ).toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })
                                    : ""}
                            </div>
                        </>
                    )}
                </aside>

                {/* Right Side */}

                <main className="flex-1">
                    <Outlet
                        context={{
                            userDetails,
                            setUserDetails,
                        }}
                    />
                </main>

            </div>

        </div>
    );
};

export default Profile;
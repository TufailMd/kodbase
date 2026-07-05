import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";



const Profile = () => {

    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState("");

    useEffect(() => {

        const fetchUserDetails = async () => {
            const userid = localStorage.getItem("userId");

            if (userid) {
                try {
                    const response = await axios.get(`http://localhost:3000/userProfile/${userid}`);

                    console.log(response.data);
                    
                    setUserDetails(response.data);
                } catch (error) {
                    console.log("Cannot fetch user details", error);

                }
            }
        }
        fetchUserDetails();
    }, []);

    return (
        <div className="min-h-screen bg-[#24292f] text-white flex flex-col items-center">
            <div className="mt-8 w-full max-w-md border-b border-gray-600">
                <div className="flex gap-8 justify-center">
                    <button className="pb-3 text-sm border-b-2 border-orange-500 font-medium">
                        Overview
                    </button>

                    <button className="pb-3 text-sm text-gray-400 hover:text-white">
                        Starred Repositories
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center mt-12">
                <div className="w-32 h-32 rounded-full bg-gray-500"></div>

                <h2 className="mt-5 text-2xl font-semibold">{userDetails.username}</h2>

                <button className="mt-6 w-64 bg-[#30363d] hover:bg-[#3b434b] border border-gray-700 py-2 rounded-md transition">
                    Follow
                </button>

                <div className="flex gap-6 mt-8 text-gray-300">
                    <span>
                        <span className="font-semibold text-white">{userDetails.followers}</span> Followers
                    </span>

                    <span>
                        <span className="font-semibold text-white">3</span> Following
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Profile;
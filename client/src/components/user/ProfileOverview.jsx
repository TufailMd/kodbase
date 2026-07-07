const ProfileOverview = () => {
    return (
        <main className="flex-1">

            {/* Popular repositories */}

            <div className="flex justify-between mb-5">

                <h2 className="text-xl font-semibold">
                    Popular repositories
                </h2>

                <button className="text-blue-400">
                    Customize your pins
                </button>

            </div>

            <div className="border border-[#30363d] rounded-lg h-48 flex items-center justify-center text-gray-500">

                You don't have any public repositories yet.

            </div>

            {/* Contribution */}

            <div className="mt-10">

                <h2 className="text-xl font-semibold mb-5">
                    1 contribution in the last year
                </h2>

                <div className="border border-[#30363d] rounded-lg p-6">

                    {/* fake github graph */}

                    <div className="grid grid-cols-53 gap-1">

                        {Array.from({ length: 371 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-sm ${i === 280
                                    ? "bg-green-500"
                                    : "bg-[#161b22]"
                                    }`}
                            />
                        ))}

                    </div>

                    <p className="text-gray-400 mt-6">
                        This is your contribution graph.
                    </p>

                </div>

            </div>

            {/* Activity */}

            <div className="mt-10">

                <h2 className="text-xl font-semibold">
                    Contribution activity
                </h2>

                <div className="mt-6 border-t border-[#30363d] pt-6">

                    <h3 className="text-lg">
                        🚀 Joined KodBase
                    </h3>

                </div>

            </div>

        </main>
    )
}

export default ProfileOverview
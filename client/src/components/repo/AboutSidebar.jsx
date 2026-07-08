import {
    Globe,
    Star,
    GitFork,
    Eye,
    BookOpen,
    Package,
    Tag,
} from "lucide-react";

const AboutSidebar = ({ repo }) => {
    return (
        <aside className="w-[320px]">

            <div className="sticky top-24">

                <h2 className="text-xl font-semibold mb-5">
                    About
                </h2>

                <p className="text-gray-300">
                    {repo.description || "No description available."}
                </p>

                <div className="mt-6 space-y-4">

                    {repo.website && (
                        <div className="flex items-center gap-3">
                            <Globe size={18} />
                            <a
                                href={repo.website}
                                target="_blank"
                                className="text-[#58a6ff]"
                            >
                                {repo.website}
                            </a>
                        </div>
                    )}

                    <div className="flex items-center gap-3">

                        <Star size={18} />

                        <span>
                            {repo.stars || 0} stars
                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <GitFork size={18} />

                        <span>
                            {repo.forks || 0} forks
                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <Eye size={18} />

                        <span>
                            {repo.watchers || 0} watching
                        </span>

                    </div>

                </div>

                <hr className="my-6 border-[#30363d]" />

                {/* Languages */}

                <h3 className="font-semibold mb-3">
                    Languages
                </h3>

                <div className="space-y-3">

                    <div className="flex justify-between">

                        <div className="flex items-center gap-2">

                            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>

                            JavaScript

                        </div>

                        <span>
                            100%
                        </span>

                    </div>

                </div>

                <hr className="my-6 border-[#30363d]" />

                {/* Releases */}

                <div className="flex items-center gap-3 mb-4">

                    <Tag size={18} />

                    <span>
                        Releases
                    </span>

                </div>

                <div className="text-gray-400 mb-6">

                    No releases published

                </div>

                {/* Packages */}

                <div className="flex items-center gap-3 mb-4">

                    <Package size={18} />

                    <span>
                        Packages
                    </span>

                </div>

                <div className="text-gray-400">

                    No packages published

                </div>

                <hr className="my-6 border-[#30363d]" />

                {/* Readme */}

                <div className="flex items-center gap-3">

                    <BookOpen size={18} />

                    README

                </div>

            </div>

        </aside>
    );
};

export default AboutSidebar;
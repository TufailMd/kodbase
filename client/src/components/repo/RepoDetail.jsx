import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import RepositoryHeader from "./RepositoryHeader";
import RepositoryToolbar from "./RepositoryToolbar";
import CommitBar from "./CommitBar";
import FileExplorer from "./FileExplorer";
import FileViewer from "./FileViewer";
import AboutSidebar from "./AboutSidebar";
import RepositoryTree from "../repository/RepositoryTree";
import buildTree from "../../utils/buildTree";

const RepoDetail = () => {
    const { name } = useParams();
    const navigate = useNavigate();

    const [repo, setRepo] = useState(null);
    const [commits, setCommits] = useState({});
    const [files, setFiles] = useState([]);
    const [selectedCommit, setSelectedCommit] = useState("");
    const [selectedFile, setSelectedFile] = useState("");
    const [fileContent, setFileContent] = useState("");
    const [loading, setLoading] = useState(false);

    const tree = buildTree(files);

    useEffect(() => {
        const fetchRepo = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3000/repo/name/${name}`
                );

                setRepo(res.data);

                fetchS3Contents(res.data.name);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRepo();
    }, [name]);

    const fetchS3Contents = async (repoName) => {
        try {
            const res = await axios.get(
                `http://localhost:3000/repo/s3/${repoName}`
            );

            if (res.data.isEmpty) {
                navigate(`/repo/${repoName}/quick-setup`);
                return;
            }

            setCommits(res.data.commits);
            setFiles(res.data.files);
            setSelectedCommit(res.data.latestCommit);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCommitChange = (commitId) => {
        setSelectedCommit(commitId);
        setFiles(commits[commitId] || []);
        setSelectedFile("");
        setFileContent("");
    };

    const handleFileClick = async (file) => {
        try {
            setSelectedFile(file);
            setLoading(true);

            const res = await axios.get(
                `http://localhost:3000/repo/s3/file/${selectedCommit}/${file}`
            );

            setFileContent(res.data.content);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!repo) return null;

    const latestCommit = selectedCommit
        ? {
            id: selectedCommit,
            author: "codex",
            message: "Latest Commit",
        }
        : null;

    const totalCommits = Object.keys(commits).length;

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">

            <RepositoryHeader repo={repo} />

            <div className="max-w-7xl mx-auto px-6 py-5">

                <RepositoryToolbar
                    repo={repo}
                    selectedCommit={selectedCommit}
                    commits={commits}
                    onCommitChange={handleCommitChange}
                />

                {/* Main Layout */}
                <div className="grid grid-cols-12 gap-6 mt-6">

                    {/* Left Sidebar */}
                    <aside className="col-span-3">

                        <div className="border border-[#30363d] rounded-lg overflow-hidden">

                            <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] font-semibold">
                                Files
                            </div>

                            <div className="p-3">
                                <RepositoryTree tree={tree} />
                            </div>

                        </div>

                    </aside>

                    {/* Center */}
                    <main className="col-span-6">

                        <CommitBar
                            latestCommit={latestCommit}
                            totalCommits={totalCommits}
                        />

                        <div className="mt-4">

                            <FileExplorer
                                files={files}
                                selectedFile={selectedFile}
                                onFileClick={handleFileClick}
                            />

                        </div>

                        <FileViewer
                            loading={loading}
                            selectedFile={selectedFile}
                            fileContent={fileContent}
                        />

                    </main>

                    {/* Right Sidebar */}
                    <aside className="col-span-3">

                        <AboutSidebar repo={repo} />

                    </aside>

                </div>

            </div>

        </div>
    );
};

export default RepoDetail;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import RepositoryHeader from "./RepositoryHeader";
import RepositoryToolbar from "./RepositoryToolbar";
import CommitBar from "./CommitBar";
import FileExplorer from "./FileExplorer";
import FileViewer from "./FileViewer";
import AboutSidebar from "./AboutSidebar";

const RepoDetail = () => {
    const { name } = useParams();
    const navigate = useNavigate();

    /* ---------------- Repository ---------------- */

    const [repo, setRepo] = useState(null);

    /* ---------------- Commits ---------------- */

    const [commits, setCommits] = useState({});
    const [selectedCommit, setSelectedCommit] = useState("");

    const [commitMessage, setCommitMessage] = useState("");
    const [commitDate, setCommitDate] = useState("");
    const [totalCommits, setTotalCommits] = useState(0);

    /* ---------------- Files ---------------- */

    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState("");
    const [fileContent, setFileContent] = useState("");

    /* ---------------- UI ---------------- */

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRepository();
    }, [name]);

    /* -------------------------------------------------- */
    /* Fetch Repository                                  */
    /* -------------------------------------------------- */

    const fetchRepository = async () => {
        try {

            const { data } = await axios.get(
                `http://localhost:3000/repo/name/${name}`
            );

            setRepo(data);

            fetchS3Contents(data.name);

        } catch (err) {
            console.error(err);
        }
    };

    /* -------------------------------------------------- */
    /* Fetch Repository Files From S3                     */
    /* -------------------------------------------------- */

    const fetchS3Contents = async (repoName) => {

        try {

            const { data } = await axios.get(
                `http://localhost:3000/repo/s3/${repoName}`
            );

            if (data.isEmpty) {

                navigate(`/repo/${repoName}/quick-setup`);

                return;

            }

            setCommits(data.commits);

            setFiles(data.files);

            setSelectedCommit(data.latestCommit);

            setCommitMessage(data.commitMessage);

            setCommitDate(data.commitDate);

            setTotalCommits(data.totalCommits);

        } catch (err) {

            console.error(err);

        }

    };

    /* -------------------------------------------------- */
    /* Change Commit                                      */
    /* -------------------------------------------------- */

    const handleCommitChange = (commitId) => {

        setSelectedCommit(commitId);

        setFiles(commits[commitId] || []);

        setSelectedFile("");

        setFileContent("");

    };

    /* -------------------------------------------------- */
    /* Open File                                          */
    /* -------------------------------------------------- */

    const handleFileClick = async (filePath) => {

        try {

            setLoading(true);

            setSelectedFile(filePath);

            const { data } = await axios.get(

                `http://localhost:3000/repo/file/${name}/${selectedCommit}/${filePath}`

            );

            setFileContent(data.content);

        }

        catch (err) {

            console.error("Unable to load file", err);

        }

        finally {

            setLoading(false);

        }

    };

    /* -------------------------------------------------- */
    /* Loading State                                      */
    /* -------------------------------------------------- */

    if (!repo) {

        return (

            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">

                <div className="text-gray-400 animate-pulse">

                    Loading repository...

                </div>

            </div>

        );

    }

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">

            {/* Repository Header */}

            <RepositoryHeader repo={repo} />

            <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-5">

                {/* Toolbar */}

                <RepositoryToolbar
                    repo={repo}
                    selectedCommit={selectedCommit}
                    commits={commits}
                    onCommitChange={handleCommitChange}
                />

                {/* Main Layout */}

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">

                    {/* Main Content */}

                    <main className="xl:col-span-9 space-y-5">

                        {/* Commit Bar */}

                        <CommitBar
                            latestCommit={selectedCommit}
                            totalCommits={totalCommits}
                            commitMessage={commitMessage}
                            commitDate={commitDate}
                        />

                        {/* File Explorer */}

                        <section className="rounded-lg overflow-hidden border border-[#30363d]">

                            <FileExplorer
                                files={files}
                                selectedFile={selectedFile}
                                onFileClick={handleFileClick}
                                commitMessage={commitMessage}
                                commitDate={commitDate}
                            />

                        </section>

                        {/* File Viewer */}

                        <section className="rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117]">

                            <FileViewer
                                loading={loading}
                                selectedFile={selectedFile}
                                fileContent={fileContent}
                            />

                        </section>

                    </main>

                    {/* Right Sidebar */}

                    <aside className="xl:col-span-3">

                        <div className="sticky top-6">

                            <AboutSidebar repo={repo} />

                        </div>

                    </aside>

                </div>

            </div>

        </div>
    );

};

export default RepoDetail;
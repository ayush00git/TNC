import { useState, useEffect } from 'react';
import { ArrowUpRight, Search, Github, ExternalLink, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

interface Project {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    githubLink: string;
    liveLink: string;
    createdAt?: string;
    user?: any;
    color?: string;
}

const ProjectPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const getRandomColor = () => {
        const colors = ['#00ffff', '#00ff00', '#ff0080', '#ffff00', '#ff00ff', '#FFA500'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/project');
                const data = await response.json();

                if (Array.isArray(data)) {
                    setProjects(data.map(proj => ({
                        ...proj,
                        color: getRandomColor()
                    })));
                } else if (data && Array.isArray(data.projects)) {
                    setProjects(data.projects.map((proj: any) => ({
                        ...proj,
                        color: getRandomColor()
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(project => {
        const query = searchQuery.toLowerCase();
        return (
            project.title.toLowerCase().includes(query) ||
            project.tags.some(tag => tag.toLowerCase().includes(query)) ||
            project.description.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-[#060010] text-[#c9d1d9] font-sans selection:bg-white selection:text-black">
            <Navbar />

            <div className="pt-24 pb-32">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

                    {/* Header Section */}
                    <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 pb-8 border-b border-[#30363d]">
                        <div className="flex-1">
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-tight">
                                BUILD<br />SHOW.
                            </h1>
                        </div>

                        <div className="flex flex-col gap-6 w-full md:w-auto">
                            <div className="w-full md:w-80 relative group">
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    className="w-full bg-transparent border-b border-[#30363d] text-xl text-white px-0 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-[#30363d]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search size={20} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#30363d] group-focus-within:text-white transition-colors" />
                            </div>

                            <button
                                onClick={() => navigate('/post-project')}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#161b22] border border-[#30363d] text-white hover:bg-[#30363d] transition-colors rounded font-mono uppercase text-sm tracking-wider"
                            >
                                <Rocket size={16} />
                                <span>Share Project</span>
                            </button>
                        </div>
                    </div>

                    {/* Projects Listing */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                            <span className="font-mono text-xs uppercase tracking-widest text-[#30363d]">Initializing Manifest...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-px bg-[#30363d]">
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map((project, index) => (
                                    <div
                                        key={project._id}
                                        className="group relative bg-[#060010] py-16 md:py-24 transition-colors duration-500 hover:bg-[#161b22]/30 overflow-hidden"
                                    >
                                        {/* Accent Bar */}
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-1 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"
                                            style={{ backgroundColor: project.color }}
                                        />

                                        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start px-6 lg:px-12">
                                            {/* Column 1: Index */}
                                            <div className="shrink-0">
                                                <span className="font-mono text-4xl md:text-7xl font-bold text-[#30363d] group-hover:text-white transition-colors duration-300">
                                                    {(index + 1).toString().padStart(2, '0')}
                                                </span>
                                            </div>

                                            {/* Column 2: Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {project.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] font-mono text-[#8b949e] uppercase tracking-wider border border-[#30363d] px-2 py-1 rounded group-hover:border-white/20 group-hover:text-white transition-colors">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight uppercase group-hover:translate-x-2 transition-transform duration-300 tracking-tighter">
                                                    {project.title}
                                                </h2>

                                                <p className="text-[#8b949e] text-lg md:text-xl font-light max-w-4xl leading-relaxed mb-10">
                                                    {project.description}
                                                </p>

                                                <div className="flex flex-wrap gap-6 pt-4">
                                                    <a
                                                        href={project.githubLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-widest hover:text-[#00ffff] transition-colors"
                                                    >
                                                        <Github size={16} /> Repository <ArrowUpRight size={14} />
                                                    </a>
                                                    {project.liveLink && (
                                                        <a
                                                            href={project.liveLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-widest hover:text-[#00ff00] transition-colors"
                                                        >
                                                            <ExternalLink size={16} /> Live Demo <ArrowUpRight size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-[#060010] py-32 text-center">
                                    <p className="font-mono text-[#30363d] uppercase tracking-[0.3em]">No Projects Found in Current Sector</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProjectPage;

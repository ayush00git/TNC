import { useState, useEffect } from 'react';
import { ArrowUpRight, Search, X, PenTool, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

interface BlogPost {
    _id: string;
    id?: string;
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    readTime: string;
    createdAt: string;
    color?: string;
    user?: {
        name: string;
        email: string;
    };
}

const BlogPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        document.body.style.overflow = showAuthModal ? 'hidden' : 'unset';
    }, [showAuthModal]);

    const [posts, setPosts] = useState<BlogPost[]>([]);

    const formatDate = (isoString: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRandomColor = () => {
        const colors = ['#ff0080', '#00ff00', '#00ffff', '#ffff00', '#ff00ff', '#FFA500'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/blog');
                const data = await response.json();

                const processPosts = (rawPosts: any[]): BlogPost[] => {
                    return rawPosts.map(post => ({
                        ...post,
                        readTime: post.readTime || '3 min read',
                        color: post.color || getRandomColor()
                    })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                };

                if (Array.isArray(data)) {
                    setPosts(processPosts(data));
                } else if (data && Array.isArray(data.blogs)) {
                    setPosts(processPosts(data.blogs));
                } else {
                    setPosts([]);
                }
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
                setPosts([]);
            }
        };

        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post => {
        const query = searchQuery.toLowerCase();
        return (
            post.title.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query)) ||
            (post.user?.name || "").toLowerCase().includes(query) ||
            (post.user?.email || "").toLowerCase().includes(query)
        );
    });

    return (
        <>
            <div className="min-h-screen bg-[#060010] text-[#c9d1d9] font-sans selection:bg-white selection:text-black relative">

                {/* MAIN LIST */}
                <Navbar />
                <div className="pt-24 pb-32">

                    {/* Full width container but constrained max-width for readability */}
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

                        {/* HEADER */}
                        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 pb-8 border-b border-[#30363d]">
                            <div className="flex-1">
                                {/* Fixed line-height here to prevent header overlap */}
                                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-tight">
                                    TECH<br />LOGS.
                                </h1>
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-auto">
                                <div className="w-full md:w-auto relative group shrink-0">
                                    <input
                                        type="text"
                                        placeholder="Search entries..."
                                        className="w-full md:w-80 bg-transparent border-b border-[#30363d] text-xl text-white px-0 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-[#30363d]"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Search size={20} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#30363d] group-focus-within:text-white transition-colors" />
                                </div>
                                <div className="flex gap-3">
                                    {localStorage.getItem("authUser") && (
                                        <button
                                            onClick={() => navigate('/my-blogs')}
                                            className="flex items-center justify-center cursor-pointer gap-2 px-6 py-3 bg-transparent border border-[#30363d] text-white hover:bg-[#161b22] transition-colors rounded font-mono uppercase text-sm tracking-wider"
                                        >
                                            <User size={16} />
                                            <span>My Blogs</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            const authUser = localStorage.getItem("authUser");
                                            if (!authUser) {
                                                setShowAuthModal(true);
                                                return;
                                            }
                                            navigate('/write-blog');
                                        }}
                                        className="flex items-center justify-center cursor-pointer gap-2 px-6 py-3 bg-[#161b22] border border-[#30363d] text-white hover:bg-[#30363d] transition-colors rounded font-mono uppercase text-sm tracking-wider"
                                    >
                                        <PenTool size={16} />
                                        <span>Write Blog</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* NO-IMAGE POST LIST */}
                        <div className="flex flex-col">
                            {Array.isArray(filteredPosts) && filteredPosts.map((post, index) => (
                                <div
                                    key={post._id || post.id || index}
                                    className="group relative border-t border-[#30363d] py-16 md:py-24 cursor-pointer transition-colors duration-500 hover:bg-[#161b22]/30"
                                    onClick={() => navigate(`/blogs/${post._id}`)}
                                >
                                    {/* Left Accent Bar on Hover */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-current transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" style={{ color: post.color }} />

                                    <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-start pl-6">

                                        {/* Column 1: Index & Meta */}
                                        <div className="w-full md:w-32 flex flex-row md:flex-col justify-between md:justify-start gap-4 shrink-0">
                                            <span className="font-mono text-4xl md:text-6xl font-bold text-[#30363d] group-hover:text-white transition-colors duration-300 select-none">
                                                {(index + 1).toString().padStart(2, '0')}
                                            </span>
                                            <div className="flex flex-col text-xs font-mono text-[#8b949e] uppercase tracking-widest">
                                                <span>{formatDate(post.createdAt)}</span>
                                                <span className="mt-1">{post.readTime}</span>
                                            </div>
                                        </div>

                                        {/* Column 2: Main Content */}
                                        <div className="flex-1 min-w-0"> {/* min-w-0 ensures flex child shrinks properly */}
                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {post.tags.map(tag => (
                                                    <span key={tag} className="text-xs font-mono text-[#8b949e] uppercase tracking-wider border border-[#30363d] px-2 py-1 rounded group-hover:border-white/20 group-hover:text-white transition-colors">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Title - Fixed Line Height */}
                                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight uppercase group-hover:translate-x-2 transition-transform duration-300">
                                                {post.title}
                                            </h2>

                                            {/* Excerpt */}
                                            <p className="text-[#8b949e] text-lg md:text-2xl font-light max-w-3xl leading-relaxed mb-8">
                                                {post.excerpt}
                                            </p>

                                            {/* User Info */}
                                            {post.user && (
                                                <div className="flex flex-col gap-1 mt-4 mb-8 text-sm font-mono text-[#8b949e]">
                                                    <span className="text-white font-bold">{post.user.name}</span>
                                                    <span>{post.user.email}</span>
                                                </div>
                                            )}

                                            {/* Action */}
                                            <div className="flex items-center gap-3 text-white font-bold uppercase tracking-wider text-sm opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                Read Entry <ArrowUpRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Auth Modal */}
                {showAuthModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
                        <div className="relative bg-[#0d1117] border border-[#30363d] p-8 max-w-md w-full shadow-2xl rounded-lg animate-in fade-in zoom-in duration-200">
                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="absolute top-4 right-4 text-[#8b949e] hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-12 h-12 bg-[#1f2937] rounded-full flex items-center justify-center text-white mb-2">
                                    <PenTool size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    Login to Write
                                </h3>
                                <p className="text-[#8b949e] text-sm leading-relaxed">
                                    Join the community to share your thoughts and ideas.
                                </p>

                                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full py-2.5 px-4 bg-white hover:bg-gray-200 cursor-pointer text-black font-semibold text-sm rounded transition-colors"
                                    >
                                        Log In
                                    </button>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="w-full py-2.5 px-4 bg-transparent cursor-pointer border border-[#30363d] text-white hover:border-white font-semibold text-sm rounded transition-colors"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default BlogPage;
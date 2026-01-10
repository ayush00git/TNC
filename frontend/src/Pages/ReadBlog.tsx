import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Terminal as TerminalIcon, X } from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';

interface BlogPost {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    readTime: string;
    createdAt: string;
    user?: {
        name: string;
        email: string;
    };
}

const ReadBlog = () => {
    const { blogId } = useParams<{ blogId: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (isoString: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/blog/${blogId}`);

                if (!response.ok) {
                    throw new Error('Blog post not found');
                }

                const data = await response.json();
                // Ensure tags is always an array and readTime has a default value
                setPost({
                    ...data,
                    tags: data.tags || [],
                    readTime: data.readTime || '3 min read'
                });
                setError(null);
            } catch (err) {
                console.error('Failed to fetch blog:', err);
                setError(err instanceof Error ? err.message : 'Failed to load blog post');
            } finally {
                setLoading(false);
            }
        };

        if (blogId) {
            fetchBlog();
        }
    }, [blogId]);

    if (loading) {
        return (
            <>
                <div className="min-h-screen bg-[#060010] text-[#c9d1d9] font-sans">
                    <Navbar />
                    <div className="pt-24 pb-32 flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-[#30363d] border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-[#8b949e] font-mono text-sm uppercase tracking-wider">Loading entry...</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !post) {
        return (
            <>
                <div className="min-h-screen bg-[#060010] text-[#c9d1d9] font-sans">
                    <Navbar />
                    <div className="pt-24 pb-32 flex items-center justify-center min-h-screen">
                        <div className="text-center max-w-md">
                            <X size={64} className="text-red-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-white mb-4">Entry Not Found</h2>
                            <p className="text-[#8b949e] mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
                            <button
                                onClick={() => navigate('/blogs')}
                                className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-gray-200 transition-colors rounded"
                            >
                                Return to Index
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-[#060010] text-[#c9d1d9] font-sans selection:bg-white selection:text-black">
                <Navbar />

                <div className="pt-24 pb-32">
                    <div className="max-w-8xl mx-auto px-6 lg:px-12">
                        {/* Reader Header */}
                        <div className="flex justify-between items-center mb-12 pb-6 border-b border-[#30363d]">
                            <div className="flex items-center gap-2 text-[#8b949e] font-mono text-xs">
                                <TerminalIcon size={14} />
                                <span>~/logs/{post._id}</span>
                            </div>
                            <button
                                onClick={() => navigate('/blogs')}
                                className="p-2 hover:bg-[#161b22] rounded-full transition-colors text-white group"
                            >
                                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Title Block */}
                        <div className="mb-16 border-b border-[#30363d] pb-10">
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {post.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-xs font-mono uppercase tracking-wider rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight uppercase">
                                {post.title}
                            </h1>
                            <div className="flex flex-col md:flex-row md:items-center gap-6 text-[#8b949e] font-mono text-sm uppercase tracking-widest border-l-2 border-[#30363d] pl-4">
                                <span>{formatDate(post.createdAt)}</span>
                                <span className="hidden md:inline">/</span>
                                <span>{post.readTime}</span>
                            </div>
                            {/* User Info */}
                            {post.user && (
                                <div className="flex flex-col gap-1 mt-8 text-sm font-mono text-[#8b949e]">
                                    <span className="text-white font-bold">Author: {post.user.name}</span>
                                    <span>{post.user.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="prose prose-invert prose-lg max-w-none text-[#c9d1d9] font-light leading-loose selection:bg-white selection:text-black">
                            <ReactMarkdown
                                rehypePlugins={[rehypeRaw]}
                                remarkPlugins={[remarkBreaks]}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>

                        {/* Footer Navigation */}
                        <div className="mt-32 pt-10 border-t border-[#30363d] flex justify-between items-center">
                            <button
                                onClick={() => navigate('/blogs')}
                                className="flex items-center gap-2 text-[#8b949e] hover:text-white transition-colors group"
                            >
                                <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
                                <span className="font-mono uppercase text-sm tracking-wider">Return to Index</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReadBlog;

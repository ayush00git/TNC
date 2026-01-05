import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, Save, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import Navbar from '../components/NavBar';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';

const EditBlog = () => {
    const navigate = useNavigate();
    const { blogId } = useParams<{ blogId: string }>();
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [viewMode, setViewMode] = useState<'write' | 'preview'>('write');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch existing blog data
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/blog/${blogId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch blog');
                }

                const data = await response.json();

                // Pre-populate form fields
                setTitle(data.title || '');
                setExcerpt(data.excerpt || '');
                setContent(data.content || '');
                setTags(data.tags || []);
            } catch (err: any) {
                setError(err.message || 'Failed to load blog');
                console.error('Error fetching blog:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (blogId) {
            fetchBlog();
        }
    }, [blogId]);

    // Handle body overflow when fullscreen
    useEffect(() => {
        document.body.style.overflow = isFullscreen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFullscreen]);

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentTag.trim() && tags.length < 4 && !tags.includes(currentTag.trim())) {
                setTags([...tags, currentTag.trim()]);
                setCurrentTag('');
            }
        } else if (e.key === 'Backspace' && !currentTag && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title || !excerpt || !content) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/blog/edit/${blogId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    excerpt,
                    tags,
                    content,
                    isDraft: false,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update blog');
            }

            navigate(`/blogs/${blogId}`);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        setError('');

        if (!title || !excerpt || !content) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/blog/edit/${blogId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    excerpt,
                    tags,
                    content,
                    isDraft: true,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to save draft');
            }

            navigate('/my-blogs');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#060010] text-[#c9d1d9] font-sans">
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[#30363d] border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[#8b949e] font-mono text-sm uppercase tracking-wider">Loading blog...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060010] text-[#c9d1d9] font-sans selection:bg-white selection:text-black">
            <Navbar />
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-20">
                {/* Header */}
                <div className="flex items-center justify-between mb-24 border-b border-[#30363d] pb-8">
                    <button
                        onClick={() => navigate('/my-blogs')}
                        className="flex items-center gap-2 text-[#8b949e] hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-mono uppercase text-sm tracking-wider">Abort & Return</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#00ffff] rounded-full"></div>
                        <span className="font-mono text-xs text-[#00ffff] uppercase tracking-widest">Edit Mode</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-16">
                    {error && (
                        <div className="bg-red-500/5 border border-red-500/20 text-red-400 p-4 font-mono text-sm flex items-center gap-3">
                            <AlertCircle size={16} />
                            <span>ERROR: {error}</span>
                        </div>
                    )}

                    {/* Title */}
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="ENTRY TITLE_01"
                            className="w-full bg-transparent border-b border-[#30363d] text-white text-5xl md:text-7xl font-black uppercase tracking-tight py-4 focus:outline-none focus:border-[#00ffff] transition-colors placeholder:text-[#30363d]"
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-4">
                        <label className="text-xs font-mono text-[#8b949e] uppercase tracking-widest block pl-4 border-l-2 border-[#00ffff]">Abstract / Description</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Briefly describe this log entry..."
                            className="w-full bg-transparent text-[#c9d1d9] text-xl md:text-2xl font-light p-4 h-32 resize-none focus:outline-none placeholder:text-[#30363d] leading-relaxed border-l-2 border-[#30363d] focus:border-[#c9d1d9] transition-colors ml-1 scrollbar-hide"
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-4">
                        <label className="text-xs font-mono text-[#8b949e] uppercase tracking-widest block pl-4 border-l-2 border-[#00ffff]">Metadata Tags [{tags.length}/4]</label>
                        <div className="w-full p-4 flex flex-wrap gap-3 items-center ml-1">
                            {tags.map(tag => (
                                <span key={tag} className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] text-[#00ffff] px-3 py-1 text-xs font-mono uppercase tracking-wider">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-white transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                            {tags.length < 4 && (
                                <div className="flex items-center gap-2 text-[#8b949e] border-b border-[#30363d] focus-within:border-[#00ffff] focus-within:text-[#00ffff] transition-colors">
                                    <span className="font-mono text-xs"></span>
                                    <input
                                        type="text"
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        placeholder="ADD_TAG"
                                        className="bg-transparent border-none text-sm font-mono uppercase focus:outline-none w-[100px] py-1 placeholder:text-[#30363d]"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-l-2 border-[#00ff00] pl-4">
                            <label className="text-xs font-mono text-[#8b949e] uppercase tracking-widest">Main Content</label>

                            {/* Write / Preview Toggles */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('write')}
                                    className={`text-xs font-mono uppercase tracking-widest transition-colors ${viewMode === 'write' ? 'text-[#00ff00] underline underline-offset-4' : 'text-[#30363d] hover:text-[#8b949e]'}`}
                                >
                                    [ Write ]
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('preview')}
                                    className={`text-xs font-mono uppercase tracking-widest transition-colors ${viewMode === 'preview' ? 'text-[#00ff00] underline underline-offset-4' : 'text-[#30363d] hover:text-[#8b949e]'}`}
                                >
                                    [ Preview ]
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            {viewMode === 'write' ? (
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Begin log entry... (Markdown & HTML supported)"
                                    className="w-full bg-transparent text-[#c9d1d9] text-lg leading-loose p-4 h-[600px] resize-y focus:outline-none placeholder:text-[#30363d] border-l-2 border-[#30363d] focus:border-[#c9d1d9] transition-colors ml-1 scrollbar-hide"
                                />
                            ) : (
                                <div className="w-full bg-[#0d1117]/50 p-8 h-[600px] overflow-y-auto border-l-2 border-[#30363d] ml-1">
                                    {content ? (
                                        <div className="prose prose-invert prose-lg max-w-none">
                                            <ReactMarkdown
                                                rehypePlugins={[rehypeRaw]}
                                                remarkPlugins={[remarkBreaks]}
                                            >
                                                {content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-[#30363d] font-mono text-sm uppercase tracking-widest">
                                            No Data To Render
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Fullscreen Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setIsFullscreen(true)}
                                className="absolute bottom-3 right-3 p-2 bg-[#161b22] border border-[#30363d] hover:border-[#00ff00] hover:text-[#00ff00] text-[#8b949e] rounded transition-colors"
                                aria-label="Maximize editor"
                            >
                                <Maximize2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-between pt-12 border-t border-[#30363d]">
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={isSubmitting}
                            className={`group relative cursor-pointer px-8 py-4 bg-transparent border border-[#30363d] text-white font-mono uppercase tracking-widest text-sm hover:border-[#ffff00] hover:text-[#ffff00] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <span className="absolute inset-0 bg-[#ffff00]/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            <span className="relative flex items-center gap-3">
                                <Save size={16} />
                                {isSubmitting ? 'SAVING...' : 'SAVE TO DRAFTS'}
                            </span>
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group relative cursor-pointer px-8 py-4 bg-transparent border border-[#30363d] text-white font-mono uppercase tracking-widest text-sm hover:border-[#00ffff] hover:text-[#00ffff] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <span className="absolute inset-0 bg-[#00ffff]/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            <span className="relative flex items-center gap-3">
                                <Save size={16} />
                                {isSubmitting ? 'PUBLISHING...' : 'PUBLISH ENTRY'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Fullscreen Content Editor */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-[#060010] flex flex-col animate-in fade-in duration-300">
                    <div className="flex-1 flex flex-col p-8">
                        {/* Header with Write/Preview toggles */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#30363d]">
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('write')}
                                    className={`text-sm font-mono uppercase tracking-widest transition-colors ${viewMode === 'write' ? 'text-[#00ff00] underline underline-offset-4' : 'text-[#30363d] hover:text-[#8b949e]'}`}
                                >
                                    [ Write ]
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('preview')}
                                    className={`text-sm font-mono uppercase tracking-widest transition-colors ${viewMode === 'preview' ? 'text-[#00ff00] underline underline-offset-4' : 'text-[#30363d] hover:text-[#8b949e]'}`}
                                >
                                    [ Preview ]
                                </button>
                            </div>
                            <button
                                onClick={() => setIsFullscreen(false)}
                                className="p-2 hover:bg-[#161b22] rounded transition-colors text-[#8b949e] hover:text-white"
                                aria-label="Exit fullscreen"
                            >
                                <Minimize2 size={20} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-hidden">
                            {viewMode === 'write' ? (
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Begin log entry... (Markdown & HTML supported)"
                                    className="w-full h-full bg-transparent text-[#c9d1d9] text-lg leading-loose p-6 resize-none focus:outline-none placeholder:text-[#30363d] scrollbar-hide"
                                    autoFocus
                                />
                            ) : (
                                <div className="w-full h-full overflow-y-auto p-6 scrollbar-hide">
                                    {content ? (
                                        <div className="prose prose-invert prose-lg max-w-none">
                                            <ReactMarkdown
                                                rehypePlugins={[rehypeRaw]}
                                                remarkPlugins={[remarkBreaks]}
                                            >
                                                {content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-[#30363d] font-mono text-sm uppercase tracking-widest">
                                            No Data To Render
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditBlog;

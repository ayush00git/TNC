import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, AlertCircle, Github, ExternalLink } from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const PostFeature = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentTag.trim() && tags.length < 6 && !tags.includes(currentTag.trim())) {
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

        if (!title || !description || !githubLink) {
            setError('Please fill in all required fields (Title, Description, Github Link)');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/project/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    tags,
                    githubLink,
                    liveLink,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to post project');
            }

            navigate('/'); // Navigate to home or projects page
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#060010] text-[#c9d1d9] selection:bg-white selection:text-black">
            <Navbar />

            <div className="pt-32 pb-32">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-12">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-[#8b949e] hover:text-white transition-colors group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-mono uppercase text-xs tracking-wider">Back</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        {error && (
                            <div className="bg-red-500/5 border border-red-500/20 text-red-400 p-4 font-mono text-xs flex items-center gap-3">
                                <AlertCircle size={14} />
                                <span>ERROR: {error}</span>
                            </div>
                        )}

                        <div className="space-y-8">
                            {/* Title Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-[#8b949e] uppercase tracking-[0.2em] block ml-1">Project Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="MY_AWESOME_PROJECT"
                                    className="w-full bg-transparent border-b border-[#30363d] text-white text-4xl md:text-6xl font-extrabold pb-4 focus:outline-none focus:border-[#00ffff] transition-colors placeholder:text-[#30363d]"
                                />
                            </div>

                            {/* Description Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-[#8b949e] uppercase tracking-[0.2em] block ml-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Explain your project scope, tech stack, and features..."
                                    className="w-full bg-transparent text-[#c9d1d9] text-xl md:text-2xl font-light p-4 h-40 resize-none focus:outline-none placeholder:text-[#30363d] leading-relaxed border-l-2 border-[#30363d] focus:border-[#00ffff] transition-colors scrollbar-hide"
                                />
                            </div>

                            {/* Links Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono text-[#8b949e] uppercase tracking-[0.2em] block ml-1 flex items-center gap-2">
                                        <Github size={12} /> Github Repository
                                    </label>
                                    <input
                                        type="url"
                                        value={githubLink}
                                        onChange={(e) => setGithubLink(e.target.value)}
                                        placeholder="https://github.com/user/repo"
                                        className="w-full bg-[#080212] border border-[#30363d] text-white p-4 font-mono text-base focus:outline-none focus:border-[#00ffff] transition-colors placeholder:text-[#30363d] rounded"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono text-[#8b949e] uppercase tracking-[0.2em] block ml-1 flex items-center gap-2">
                                        <ExternalLink size={12} /> Live Demo (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={liveLink}
                                        onChange={(e) => setLiveLink(e.target.value)}
                                        placeholder="https://project.vercel.app"
                                        className="w-full bg-[#080212] border border-[#30363d] text-white p-4 font-mono text-base focus:outline-none focus:border-[#00ffff] transition-colors placeholder:text-[#30363d] rounded"
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-[#8b949e] uppercase tracking-[0.2em] block ml-1">Tags [{tags.length}/6]</label>
                                <div className="flex flex-wrap gap-2 p-3 bg-[#080212] border border-[#30363d] rounded min-h-[50px]">
                                    {tags.map(tag => (
                                        <span key={tag} className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] text-[#00ffff] px-3 py-1 text-[10px] font-mono uppercase tracking-wider">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X size={10} /></button>
                                        </span>
                                    ))}
                                    {tags.length < 6 && (
                                        <input
                                            type="text"
                                            value={currentTag}
                                            onChange={(e) => setCurrentTag(e.target.value)}
                                            onKeyDown={handleTagKeyDown}
                                            placeholder="Press Enter to add tags..."
                                            className="bg-transparent border-none text-xs font-mono uppercase focus:outline-none flex-grow py-2 placeholder:text-[#30363d]"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-4 bg-transparent border border-[#00ffff] text-[#00ffff] font-mono uppercase tracking-widest text-xs hover:bg-[#00ffff] hover:text-[#060010] transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-[#060010] border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Publish Project
                                        <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PostFeature;

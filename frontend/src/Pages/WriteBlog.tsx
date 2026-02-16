import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, AlertCircle, Maximize2, Minimize2, Terminal as TerminalIcon } from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';

const WriteBlog = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [viewMode, setViewMode] = useState<'write' | 'preview'>('write');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
    const editorRef = useRef<HTMLTextAreaElement>(null);

    // Capture cursor position before switching views
    const captureSelection = () => {
        if (editorRef.current) {
            setSelection({
                start: editorRef.current.selectionStart,
                end: editorRef.current.selectionEnd
            });
        }
    };

    const toggleViewMode = () => {
        if (viewMode === 'write') {
            captureSelection();
        }
        setViewMode(prev => prev === 'write' ? 'preview' : 'write');
    };

    // Handle body overflow when fullscreen
    useEffect(() => {
        document.body.style.overflow = isFullscreen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFullscreen]);

    // Handle Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl + Esc: Toggle Write/Preview
            if (e.ctrlKey && e.key === 'Escape') {
                e.preventDefault();
                toggleViewMode();
            }
            // Esc (without Ctrl): Toggle Fullscreen
            else if (e.key === 'Escape' && !e.ctrlKey) {
                e.preventDefault();
                setIsFullscreen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [viewMode]);

    // Restore focus and cursor position when returning to write mode
    useEffect(() => {
        if (viewMode === 'write' && selection && editorRef.current) {
            const editor = editorRef.current;
            editor.focus();
            // Wrap in requestAnimationFrame to ensure the DOM has updated and focus is applied
            requestAnimationFrame(() => {
                editor.setSelectionRange(selection.start, selection.end);
            });
        }
    }, [viewMode, selection]);

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
            const response = await fetch('/api/blog', {
                method: 'POST',
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
                throw new Error(data.message || 'Failed to publish blog');
            }

            navigate('/blogs');
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
            const response = await fetch('/api/blog', {
                method: 'POST',
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

    return (
        <div className="min-h-screen bg-[#060010] text-[#c9d1d9] selection:bg-white selection:text-black">
            <Navbar />
            
            <div className="pt-32 pb-32">
                <div className="max-w-6xl mx-auto px-6 lg:px-12">
                    {/* Mode Toggle & Status */}
                    <div className="flex justify-between items-center mb-12">
                        <button
                            onClick={() => navigate('/blogs')}
                            className="flex items-center gap-2 text-[#8b949e] hover:text-white transition-colors group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-mono uppercase text-xs tracking-wider">Abort & Return</span>
                        </button>
                        
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end gap-1 border-r border-[#30363d] pr-6">
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (viewMode === 'preview') setViewMode('write');
                                        }}
                                        className={`text-xs font-mono uppercase tracking-widest transition-colors ${viewMode === 'write' ? 'text-[#ff0080] border-b border-[#ff0080]' : 'text-[#30363d] hover:text-[#8b949e]'}`}
                                    >
                                        [ Write ]
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (viewMode === 'write') {
                                                captureSelection();
                                                setViewMode('preview');
                                            }
                                        }}
                                        className={`text-xs font-mono uppercase tracking-widest transition-colors ${viewMode === 'preview' ? 'text-[#00ff00] border-b border-[#00ff00]' : 'text-[#30363d] hover:text-[#8b949e]'}`}
                                    >
                                        [ Preview ]
                                    </button>
                                </div>
                                <span className="text-[9px] font-mono text-[#30363d] uppercase tracking-tighter">Ctrl + Esc to toggle</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${viewMode === 'write' ? 'bg-[#ff0080] animate-pulse' : 'bg-[#00ff00]'}`}></div>
                                <span className={`font-mono text-xs uppercase tracking-widest ${viewMode === 'write' ? 'text-[#ff0080]' : 'text-[#00ff00]'}`}>
                                    {viewMode === 'write' ? 'Write Mode' : 'Preview Mode'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-12 bg-red-500/5 border border-red-500/20 text-red-400 p-4 font-mono text-xs flex items-center gap-3">
                                <AlertCircle size={14} />
                                <span>ERROR: {error}</span>
                            </div>
                        )}

                        {viewMode === 'write' ? (
                            <div className="space-y-12">
                                {/* Title Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono text-[#8b949e] uppercase tracking-[0.2em] block ml-1">Entry Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="TITLE_HERE"
                                        className="w-full bg-transparent border-b border-[#30363d] text-white text-4xl md:text-5xl font-extrabold pb-4 focus:outline-none focus:border-[#ff0080] transition-colors placeholder:text-[#30363d]"
                                    />
                                </div>

                                {/* Abstract Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono text-[#8b949e] uppercase tracking-[0.2em] block ml-1">Abstract / Description</label>
                                    <textarea
                                        value={excerpt}
                                        onChange={(e) => setExcerpt(e.target.value)}
                                        placeholder="Briefly describe this entry..."
                                        className="w-full bg-transparent text-[#c9d1d9] text-lg md:text-xl font-light p-4 h-24 resize-none focus:outline-none placeholder:text-[#30363d] leading-relaxed border-l-2 border-[#30363d] focus:border-[#c9d1d9] transition-colors scrollbar-hide"
                                    />
                                </div>

                                {/* Metadata & Tags */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-[#8b949e] uppercase tracking-[0.2em] block ml-1">Metadata Tags [{tags.length}/4]</label>
                                        <div className="flex flex-wrap gap-2 p-2 min-h-[40px]">
                                            {tags.map(tag => (
                                                <span key={tag} className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] text-[#00ffff] px-3 py-1 text-[10px] font-mono uppercase tracking-wider">
                                                    {tag}
                                                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X size={10} /></button>
                                                </span>
                                            ))}
                                            {tags.length < 4 && (
                                                <input
                                                    type="text"
                                                    value={currentTag}
                                                    onChange={(e) => setCurrentTag(e.target.value)}
                                                    onKeyDown={handleTagKeyDown}
                                                    placeholder="ADD_TAG"
                                                    className="bg-transparent border-none text-[10px] font-mono uppercase focus:outline-none w-[80px] py-1 placeholder:text-[#30363d]"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="pt-6 flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={handleSaveDraft}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 bg-transparent border border-[#30363d] text-[#8b949e] font-mono uppercase tracking-widest text-[10px] hover:border-[#ffff00] hover:text-[#ffff00] transition-colors disabled:opacity-50"
                                        >
                                            Save Draft
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-4 py-2 bg-transparent border border-[#30363d] text-white font-mono uppercase tracking-widest text-[10px] hover:border-[#00ff00] hover:text-[#00ff00] transition-colors disabled:opacity-50"
                                        >
                                            Commit Entry
                                        </button>
                                    </div>
                                </div>

                                {/* Content Input */}
                                <div className="space-y-2 relative group">
                                    <label className="text-[10px] font-mono text-[#8b949e] uppercase tracking-[0.2em] block ml-1">Main Content (Markdown)</label>
                                    <textarea
                                        ref={editorRef}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Begin entry... Markdown and HTML supported."
                                        className="w-full bg-[#080212] text-[#c9d1d9] text-xl md:text-2xl font-light leading-relaxed p-8 h-[800px] resize-y focus:outline-none placeholder:text-[#30363d] border border-[#30363d] focus:border-[#ff0080]/30 transition-colors scrollbar-hide rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsFullscreen(true)}
                                        className="absolute bottom-4 right-4 p-2 bg-[#161b22] border border-[#30363d] hover:border-[#ff0080] text-[#8b949e] rounded transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Maximize2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#010409]/30 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Preview Container aligned with ReadBlog */}
                                <div className="max-w-6xl mx-auto py-12 px-6 lg:px-12">
                                    {/* Reader Header Mock */}
                                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#30363d]">
                                        <div className="flex items-center gap-2 text-[#8b949e] font-mono text-xs">
                                            <TerminalIcon size={14} />
                                            <span>~/drafts/preview_mode</span>
                                        </div>
                                        <div className="text-[10px] font-mono text-[#58a6ff] uppercase tracking-widest">Render: Dynamic</div>
                                    </div>

                                    {/* Title Block Mock */}
                                    <div className="mb-12 border-b border-[#30363d] pb-8">
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-xs font-mono uppercase tracking-wider rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                                            {title || 'Untitled Entry'}
                                        </h1>
                                        <div className="flex flex-col md:flex-row md:items-center gap-4 text-[#8b949e] text-sm border-l-2 border-[#30363d] pl-4">
                                            <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            <span className="hidden md:inline">/</span>
                                            <span>Reading Time: Est. ~{Math.ceil(content.split(' ').length / 200)} min</span>
                                        </div>
                                    </div>

                                    {/* Content Mock */}
                                    <div className="prose prose-invert prose-lg mx-auto max-w-3xl text-[#c9d1d9] leading-relaxed selection:bg-white selection:text-black">
                                        {content ? (
                                            <ReactMarkdown
                                                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                                remarkPlugins={[remarkBreaks]}
                                            >
                                                {content}
                                            </ReactMarkdown>
                                        ) : (
                                            <div className="h-48 flex items-center justify-center text-[#30363d] font-mono text-sm uppercase tracking-widest border border-dashed border-[#30363d] rounded-lg">
                                                Empty Content State
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Fullscreen Content Editor */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-[#060010] flex flex-col animate-in fade-in duration-300">
                    <div className="flex-1 flex flex-col p-8 min-h-0">
                        {/* Header with Toggles */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#30363d]">
                            <div className="flex gap-8">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (viewMode === 'preview') setViewMode('write');
                                    }}
                                    className={`text-sm font-mono uppercase tracking-widest transition-colors ${viewMode === 'write' ? 'text-[#ff0080] border-b border-[#ff0080]' : 'text-[#30363d] hover:text-[#8b949e]'}`}
                                >
                                    [ Write ]
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (viewMode === 'write') {
                                            captureSelection();
                                            setViewMode('preview');
                                        }
                                    }}
                                    className={`text-sm font-mono uppercase tracking-widest transition-colors ${viewMode === 'preview' ? 'text-[#00ff00] border-b border-[#00ff00]' : 'text-[#30363d] hover:text-[#8b949e]'}`}
                                >
                                    [ Preview ]
                                </button>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ${viewMode === 'write' ? 'text-[#ff0080]' : 'text-[#00ff00]'}`}>
                                    {viewMode === 'write' ? 'Active Workflow: Editing' : 'Active Workflow: Reviewing'}
                                </span>
                                <button
                                    onClick={() => setIsFullscreen(false)}
                                    className="p-2 hover:bg-[#161b22] rounded transition-colors text-[#8b949e] hover:text-white"
                                >
                                    <Minimize2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-hidden min-h-0">
                            {viewMode === 'write' ? (
                                <textarea
                                    ref={editorRef}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full h-full bg-transparent text-[#c9d1d9] text-2xl font-light leading-relaxed p-12 resize-none focus:outline-none placeholder:text-[#30363d] scrollbar-hide max-w-5xl mx-auto block"
                                    autoFocus
                                    placeholder="Begin log entry..."
                                />
                            ) : (
                                <div className="w-full h-full overflow-y-auto px-12 py-8 scrollbar-hide">
                                    <div className="max-w-4xl mx-auto">
                                        {/* Mocking the Read View exactly in fullscreen preview */}
                                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#30363d]">
                                            <div className="flex items-center gap-2 text-[#8b949e] font-mono text-xs">
                                                <TerminalIcon size={14} />
                                                <span>~/fullscreen/preview</span>
                                            </div>
                                        </div>
                                        <h1 className="text-5xl font-extrabold text-white mb-12">{title || 'Untitled Entry'}</h1>
                                        <div className="prose prose-invert prose-lg mx-auto max-w-3xl text-[#c9d1d9] leading-relaxed">
                                            <ReactMarkdown
                                                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                                remarkPlugins={[remarkBreaks]}
                                            >
                                                {content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default WriteBlog;

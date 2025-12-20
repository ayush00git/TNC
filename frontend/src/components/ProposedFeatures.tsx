import React, { useEffect, useState } from 'react';
import { Sparkles, Rocket, GitPullRequest, Zap } from 'lucide-react';

interface Feature {
  _id: string; // Adhering to MongoDB standards, though API might return 'id'
  title: string;
  description: string;
  status: string;
}

export default function ProposedFeatures() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/features');
        const data = await response.json();
        // Ensure we are setting an array
        if (Array.isArray(data)) {
          setFeatures(data);
        } else if (data.features && Array.isArray(data.features)) {
          // Handle case where API returns { features: [...] }
          setFeatures(data.features);
        }
      } catch (error) {
        console.error("Failed to fetch features:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  return (
    // Added 'border-t border-white/5' to create the horizontal line above the component
    <div className="min-h-screen bg-[#060010] text-slate-200 font-sans py-24 px-6 relative overflow-hidden border-t border-white/5">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <Rocket size={14} />
            <span>Roadmap v2.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Future of TNC</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We are constantly evolving. Here is a sneak peek at the major updates coming to the platform in the next release.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading State placeholders
            [1, 2, 3].map((i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#0A0514] border border-white/10 h-64 animate-pulse flex flex-col justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/5" />
                <div className="space-y-3">
                  <div className="h-6 w-3/4 bg-white/5 rounded" />
                  <div className="h-4 w-full bg-white/5 rounded" />
                  <div className="h-4 w-2/3 bg-white/5 rounded" />
                </div>
              </div>
            ))
          ) : (
            features.map((feature, index) => (
              <div 
                key={feature._id || index}
                className="p-8 rounded-3xl bg-[#0A0514] border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-8">
                  {/* Using a generic icon for fetched features */}
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1625] border border-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                    <Zap size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {feature.status || "Planned"}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Progress Line Decoration */}
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-1/3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Call to Action / Contribution */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
            <GitPullRequest className="text-indigo-400" size={32} />
            <h3 className="text-xl font-bold text-white">Have a feature in mind?</h3>
            <p className="text-slate-400 max-w-md text-sm">
              TNC is open source. You can propose features or contribute directly to the codebase on GitHub.
            </p>
            <a 
              href="https://github.com/ayush00git/TNC" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 px-6 py-3 rounded-full bg-[#0A0514] border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors text-white"
            >
              Submit Proposal
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
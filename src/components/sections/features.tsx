"use client";

import { motion } from "framer-motion";
import {
    Database,
    Zap,
    Bell,
    Newspaper,
    TrendingUp,
    Layers,
} from "lucide-react";

const features = [
    {
        icon: Database,
        title: "Full Data Coverage",
        description: "Tracking every asset on the Ghana Stock Exchange with sub-second precision and 10+ years of historical data."
    },
    {
        icon: Layers,
        title: "Advanced Tools",
        description: "Professional-grade stock screeners, portfolio heatmaps, and customizable technical analysis dashboards."
    },
    {
        icon: Bell,
        title: "Real-time Alerts",
        description: "Set custom price triggers and get instant notifications via SMS, Email, or WhatsApp as market conditions change."
    },
    {
        icon: Newspaper,
        title: "AI News Aggregation",
        description: "Curated financial news from Bloomberg, Reuters, and local GSE sources, summarized by AI for quick reading."
    }
];

const educationalStories = [
    {
        category: "Featured Analysis",
        title: "MTN Ghana: Why Analysts are Bullish for Q3 2026",
        snippet: "A deep dive into the telco giant's expanding mobile money ecosystem and its impact on dividend yields.",
        date: "Jan 5, 2026"
    },
    {
        category: "Stock of the Week",
        title: "GCB Bank PLC (GCB)",
        snippet: "Stable growth and digital transformation makes GCB a top pick for retail investors this quarter.",
        date: "Jan 4, 2026"
    },
    {
        category: "Market Summary",
        title: "Week in Review: GSE Composite Index Gains 2.4%",
        snippet: "Financial stocks lead the rally as inflation fears subside and local investor participation hits record highs.",
        date: "Jan 3, 2026"
    }
];

export const FeatureHighlights = () => {
    return (
        <section id="features" className="py-24 bg-black">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">The Next Level of Analysis</h2>
                    <p className="text-white/40 max-w-2xl mx-auto">
                        Experience tools that were previously reserved for institutional investors,
                        now available at your fingertips.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const EducationalSection = () => {
    return (
        <section id="education" className="py-24 bg-black border-t border-white/[0.05]">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4"
                >
                    <div className="text-left">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Market Insights</h2>
                        <p className="text-white/40 max-w-xl">
                            Stay ahead of the curve with expert analysis and educational content tailored for
                            both beginners and pro traders.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-white font-medium hover:text-white/60 transition-colors"
                    >
                        Explore Learning Center <TrendingUp size={18} />
                    </motion.button>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {educationalStories.map((story, idx) => (
                        <motion.div
                            key={story.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer group"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6 block group-hover:text-white/60 transition-colors">
                                {story.category}
                            </span>
                            <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:translate-x-1 transition-transform">
                                {story.title}
                            </h3>
                            <p className="text-sm text-white/40 mb-8 leading-relaxed">
                                {story.snippet}
                            </p>
                            <div className="flex items-center justify-between text-xs text-white/20">
                                <span>{story.date}</span>
                                <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                                    Read Article <Zap size={10} />
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

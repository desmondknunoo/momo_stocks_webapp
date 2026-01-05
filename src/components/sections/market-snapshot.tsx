import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { mockIndices, mockGainers, mockLosers, mockActive, MarketIndex } from "@/data/mock-market";
import { cn } from "@/lib/utils";

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const width = 100;
    const height = 30;
    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((d - min) / (range || 1)) * height,
    }));

    const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;

    return (
        <svg width={width} height={height} className="overflow-visible">
            <motion.path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />
        </svg>
    );
};

const IndexCard = ({ item }: { item: MarketIndex }) => {
    const isPositive = item.change >= 0;
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm text-white/40 mb-1">{item.name}</p>
                    <h3 className="text-2xl font-bold text-white">{item.value.toLocaleString()}</h3>
                </div>
                <div className={cn(
                    "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                    isPositive ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
                )}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {isPositive ? "+" : ""}{item.changePercent}%
                </div>
            </div>
            <div className="mt-4">
                <Sparkline data={item.sparkline} color={isPositive ? "#10b981" : "#fb7185"} />
            </div>
        </motion.div>
    );
};

export const MarketSnapshot = () => {
    const [activeTab, setActiveTab] = useState<"gainers" | "losers" | "active">("gainers");

    const getMovers = () => {
        switch (activeTab) {
            case "gainers": return mockGainers;
            case "losers": return mockLosers;
            case "active": return mockActive;
        }
    };

    return (
        <section id="market-snapshot" className="pt-4 md:pt-12 pb-24 bg-black relative">
            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Indices Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {mockIndices.map((index) => (
                        <IndexCard key={index.name} item={index} />
                    ))}
                </div>

                {/* Movers Table */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
                    <div className="flex border-b border-white/[0.08]">
                        <button
                            onClick={() => setActiveTab("gainers")}
                            className={cn(
                                "flex-1 py-4 text-sm font-medium transition-colors",
                                activeTab === "gainers" ? "text-white bg-white/[0.05]" : "text-white/40 hover:text-white"
                            )}
                        >
                            Top Gainers
                        </button>
                        <button
                            onClick={() => setActiveTab("losers")}
                            className={cn(
                                "flex-1 py-4 text-sm font-medium transition-colors",
                                activeTab === "losers" ? "text-white bg-white/[0.05]" : "text-white/40 hover:text-white"
                            )}
                        >
                            Top Losers
                        </button>
                        <button
                            onClick={() => setActiveTab("active")}
                            className={cn(
                                "flex-1 py-4 text-sm font-medium transition-colors",
                                activeTab === "active" ? "text-white bg-white/[0.05]" : "text-white/40 hover:text-white"
                            )}
                        >
                            Most Active
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/[0.08] bg-white/[0.01]">
                                    <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Symbol</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Change</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Trend</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getMovers().map((stock) => (
                                    <tr key={stock.symbol} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white uppercase">{stock.symbol}</span>
                                                <span className="text-xs text-white/40">{stock.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-white">GHS {stock.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "font-medium",
                                                stock.change >= 0 ? "text-emerald-400" : "text-rose-400"
                                            )}>
                                                {stock.change >= 0 ? "+" : ""}{stock.changePercent}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <Sparkline data={stock.sparkline} color={stock.change >= 0 ? "#10b981" : "#fb7185"} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => window.location.href = `/legacy/index.html?symbol=${stock.symbol}`}
                                                className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
                                            >
                                                Trade <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => window.location.href = "/legacy/index.html"}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all font-medium"
                    >
                        View Full Market Data <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Background Glows */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
};

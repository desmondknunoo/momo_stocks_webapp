import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stock {
    name: string;
    price: number;
    change: number;
    volume: number;
}

export const MarketSnapshot = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"gainers" | "losers" | "active">("gainers");

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await fetch("https://dev.kwayisi.org/apis/gse/live");
                if (!response.ok) throw new Error("Failed to fetch market data");
                const data: Stock[] = await response.json();
                setStocks(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, []);

    const getMovers = () => {
        if (stocks.length === 0) return [];

        switch (activeTab) {
            case "gainers":
                return [...stocks].filter(s => s.change > 0).sort((a, b) => b.change - a.change).slice(0, 5);
            case "losers":
                return [...stocks].filter(s => s.change < 0).sort((a, b) => a.change - b.change).slice(0, 5);
            case "active":
                return [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 5);
        }
    };

    if (loading) {
        return (
            <section id="market-snapshot" className="pt-4 md:pt-12 pb-24 bg-black relative">
                <div className="container mx-auto px-4 md:px-6 flex justify-center items-center min-h-[300px]">
                    <Loader2 className="w-8 h-8 animate-spin text-white/40" />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="market-snapshot" className="pt-4 md:pt-12 pb-24 bg-black relative">
                <div className="container mx-auto px-4 md:px-6 flex justify-center items-center min-h-[300px]">
                    <p className="text-white/40">Failed to load market data</p>
                </div>
            </section>
        );
    }

    const movers = getMovers();

    return (
        <section id="market-snapshot" className="pt-4 md:pt-12 pb-24 bg-black relative">
            <div className="container mx-auto px-4 md:px-6 relative z-10">

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
                                    <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Volume</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                                            No {activeTab === "gainers" ? "gainers" : activeTab === "losers" ? "losers" : "active stocks"} at this time
                                        </td>
                                    </tr>
                                ) : (
                                    movers.map((stock) => (
                                        <tr key={stock.name} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-white uppercase">{stock.name}</span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-white">GHS {stock.price.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1 font-medium",
                                                    stock.change >= 0 ? "text-emerald-400" : "text-rose-400"
                                                )}>
                                                    {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                    {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell text-white/60">
                                                {stock.volume.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => window.location.href = `/legacy/index.html?symbol=${stock.name}`}
                                                    className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
                                                >
                                                    Trade <ChevronRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
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

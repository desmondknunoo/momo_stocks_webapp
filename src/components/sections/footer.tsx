"use client";

import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export const EnhancedFooter = () => {
    return (
        <footer className="bg-black pt-24 pb-12 border-t border-white/[0.05]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand column */}
                    <div className="md:col-span-1">
                        <div className="text-xl font-bold text-white mb-6 font-poppins">MoMo Stocks</div>
                        <p className="text-sm text-white/40 leading-relaxed mb-6 font-poppins">
                            The ultimate financial aggregator for the Ghana Stock Exchange.
                            Built for accuracy, speed, and ease of use.
                        </p>
                        <div className="flex gap-4">
                            <Twitter size={20} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
                            <Linkedin size={20} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
                            <Github size={20} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
                            <Mail size={20} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* Links columns */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest font-poppins">Product</h4>
                        <ul className="flex flex-col gap-4 text-sm text-white/40">
                            <li><a href="#market-snapshot" className="hover:text-white transition-colors font-poppins">Market Snapshot</a></li>
                            <li><a href="#features" className="hover:text-white transition-colors font-poppins">Features</a></li>
                            <li><a href="#pricing" className="hover:text-white transition-colors font-poppins">Pricing</a></li>
                            <li><a href="/legacy/index.html" className="hover:text-white transition-colors font-poppins">Live Dashboard</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest font-poppins">Resources</h4>
                        <ul className="flex flex-col gap-4 text-sm text-white/40">
                            <li><a href="#education" className="hover:text-white transition-colors font-poppins">Learning Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors font-poppins">API Documentation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors font-poppins">Market Reports</a></li>
                            <li><a href="#" className="hover:text-white transition-colors font-poppins">Help Center</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest font-poppins">Company</h4>
                        <ul className="flex flex-col gap-4 text-sm text-white/40">
                            <li><a href="#" className="hover:text-white transition-colors font-poppins">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors font-poppins">Contact Support</a></li>
                            <li><a href="#" className="hover:text-white transition-colors font-poppins">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors font-poppins">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                {/* Legal Section */}
                <div className="pt-12 border-t border-white/[0.05] flex flex-col md:flex-row justify-between gap-8">
                    <div className="max-w-2xl">
                        <p className="text-[10px] text-white/20 uppercase tracking-widest mb-4 font-bold">Disclaimer</p>
                        <p className="text-[11px] text-white/30 leading-relaxed font-poppins">
                            Trading stocks on the Ghana Stock Exchange (GSE) involves significant risk of loss and is not suitable
                            for every investor. Past performance is not indicative of future results. Information provided
                            by MoMo Stocks is for educational purposes only and does not constitute financial advice.
                            <br /><br />
                            <span className="text-white/40 font-bold">Data Delay Notice:</span> Free tier market data is delayed by 15-20 minutes.
                            Upgrade to Pro for real-time streaming data.
                        </p>
                    </div>
                    <div className="text-right flex flex-col justify-end">
                        <p className="text-sm text-white/20 font-poppins">
                            © 2026 MoMo Stocks. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

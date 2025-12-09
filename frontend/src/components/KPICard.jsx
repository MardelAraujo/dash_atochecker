import React from 'react';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, subtitle, icon: Icon, trend, color = "text-white" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 rounded-2xl relative overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                    <div className={`text-2xl font-bold ${color} tracking-tight`}>
                        {value}
                    </div>
                </div>
                <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors ${color}`}>
                    <Icon size={24} />
                </div>
            </div>

            {subtitle && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    {trend && (
                        <span className={trend > 0 ? "text-green-400" : "text-red-400"}>
                            {trend > 0 ? "+" : ""}{trend}%
                        </span>
                    )}
                    <span>{subtitle}</span>
                </div>
            )}

            {/* Decorative gradient blob */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-premium-magenta/20 to-premium-purple/20 blur-2xl rounded-full pointer-events-none" />
        </motion.div>
    );
};

export default KPICard;

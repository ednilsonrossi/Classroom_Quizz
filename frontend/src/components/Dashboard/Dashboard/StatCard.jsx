import React from 'react';

export default function StatCard({ icon, label, value }) {
    return (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group">
            <div className="p-4 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">
                {React.cloneElement(icon, {
                    size: 24,
                    className: icon.props.className || 'text-emerald-600'
                })}
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    {label}
                </p>

                <p className="text-2xl font-bold text-slate-800 tabular-nums">
                    {value}
                </p>
            </div>
        </div>
    );
}
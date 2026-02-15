import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = "", title, subtitle, footer }) => (
    <div className={`card overflow-hidden ${className}`}>
        {(title || subtitle) && (
            <div className="px-6 py-4 border-b border-[var(--border)]">
                {title && <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>}
                {subtitle && <p className="text-sm text-[var(--secondary)]">{subtitle}</p>}
            </div>
        )}
        <div className="px-6 py-5">
            {children}
        </div>
        {footer && (
            <div className="px-6 py-4 bg-[#f9fafb] border-t border-[var(--border)]">
                {footer}
            </div>
        )}
    </div>
);

export const Badge = ({ children, status = "default" }) => {
    const styles = {
        default: "bg-[#f2f4f7] text-[#344054] border-[#d0d5dd]",
        success: "bg-[#ecfdf3] text-[#067647] border-[#abefc6]",
        warning: "bg-[#fffaeb] text-[#b54708] border-[#fedf89]",
        error: "bg-[#fef3f2] text-[#b42318] border-[#fda29b]",
        blue: "bg-[#eff8ff] text-[#175cd3] border-[#b2ddff]",
    };
    return <span className={`badge ${styles[status]}`}>{children}</span>;
};

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
    const v = variant === "primary" ? "btn-primary" : "btn-outline";
    return <button className={`${v} ${className}`} {...props}>{children}</button>;
};

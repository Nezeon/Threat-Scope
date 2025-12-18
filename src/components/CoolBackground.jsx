import React from 'react';
import { motion } from 'framer-motion';

const CoolBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-900">
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0a192f] to-[#020c1b] opacity-90" />

            {/* Animated Orbs/Glows */}
            <motion.div
                className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-denim/20 blur-[100px]"
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, 30, -30, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute top-[20%] right-[0%] w-[40vw] h-[40vw] rounded-full bg-purple-900/20 blur-[120px]"
                animate={{
                    x: [0, -30, 30, 0],
                    y: [0, -50, 50, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />
        </div>
    );
};

export default CoolBackground;

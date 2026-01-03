
"use client"

import React from "react"
import { motion } from "framer-motion"

export function PageLights() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Intense Top Center Beaming Light - The "Source" */}
                <div
                    className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] 
        bg-blue-400/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen"
                />

                {/* Broad Ambient Blue Glow */}
                <div
                    className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[90%] h-[70%] 
        bg-blue-600/15 blur-[150px] rounded-full pointer-events-none"
                />

                {/* Deep Indigo Depth Layer */}
                <div
                    className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] 
        bg-indigo-600/10 blur-[180px] rounded-full pointer-events-none"
                />

                {/* Right Side Accent Glow */}
                <div
                    className="absolute top-[-10%] right-[-5%] w-[35%] h-[35%] 
        bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none opacity-60"
                />

                {/* Left Side Accent Glow */}
                <div
                    className="absolute top-[-10%] left-[-5%] w-[35%] h-[35%] 
        bg-blue-500/10 blur-[130px] rounded-full pointer-events-none opacity-60"
                />
            </div>
        </div>
    )
}

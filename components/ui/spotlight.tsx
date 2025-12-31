"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

type SpotlightProps = {
    className?: string;
    fill?: string;
};

export const Spotlight = ({ className, fill = "white" }: SpotlightProps) => {
    const spotlightRef = useRef<SVGSVGElement>(null);

    useGSAP(() => {
        gsap.to(spotlightRef.current, {
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
        });

        // Subtle breathing animation
        gsap.to(spotlightRef.current, {
            scale: 1.05,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Slight drift
        gsap.to(spotlightRef.current, {
            x: "+=20",
            y: "+=10",
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5
        });
    }, { scope: spotlightRef });

    return (
        <svg
            ref={spotlightRef}
            className={cn(
                "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
                className
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 3787 2842"
            fill="none"
        >
            <g filter="url(#filter0_f_29_218)">
                <ellipse
                    cx="1924.71"
                    cy="273.501"
                    rx="1924.71"
                    ry="273.501"
                    transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
                    fill={fill}
                    fillOpacity="0.35"
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_29_218"
                    x="0.860352"
                    y="0.838989"
                    width="3785.16"
                    height="2840.26"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="151"
                        result="effect1_foregroundBlur_29_218"
                    />
                </filter>
            </defs>
        </svg>
    );
};

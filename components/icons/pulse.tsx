import * as React from "react";

export default function PulseIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            <circle cx="12" cy="12" r="1" fill="currentColor" className="animate-pulse" />
        </svg>
    );
}

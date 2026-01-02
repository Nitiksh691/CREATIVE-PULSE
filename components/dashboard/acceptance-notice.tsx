"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AcceptanceNoticeProps {
    app: {
        _id: string
        company: {
            companyName: string
        }
        job?: {
            title: string
        }
        acceptanceDetails?: {
            message: string
            email: string
            phone?: string
        }
    }
}

export default function AcceptanceNotice({ app }: AcceptanceNoticeProps) {
    if (!app.acceptanceDetails) return null

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 relative overflow-hidden"
            data-testid="acceptance-notice"
        >
            <div className="absolute top-0 right-0 p-4 opacity-50">
                <CheckCircle2 className="size-24 text-green-500/20" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-green-500 text-white hover:bg-green-600 border-none px-3 py-1 text-xs uppercase tracking-wider">Hired</Badge>
                    <h3 className="text-xl font-display uppercase text-green-400">Congratulations! You have been selected.</h3>
                </div>
                <p className="text-muted-foreground font-mono text-sm max-w-2xl mb-6">
                    The team at <span className="text-white font-bold">{app.company?.companyName}</span> has accepted your application for <span className="text-white font-bold">{app.job?.title || "Direct Inquiry"}</span>.
                </p>

                <div className="bg-black/40 border border-white/5 rounded-lg p-5 max-w-2xl">
                    <h5 className="font-display uppercase text-sm text-white/70 mb-4 border-b border-white/5 pb-2">Next Steps & Contact Info</h5>

                    <div className="space-y-4">
                        <div className="font-mono text-sm leading-relaxed text-white/90 italic">
                            "{app.acceptanceDetails.message}"
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Contact Email</p>
                                <p className="font-mono text-sm select-all text-primary">{app.acceptanceDetails.email}</p>
                            </div>
                            {app.acceptanceDetails.phone && (
                                <div>
                                    <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Phone / WhatsApp</p>
                                    <p className="font-mono text-sm select-all text-white">{app.acceptanceDetails.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

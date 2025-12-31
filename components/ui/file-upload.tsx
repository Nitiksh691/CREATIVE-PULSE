"use client"

import { useState, useRef } from "react"
import { Upload, X, FileText, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from "next/image"

interface FileUploadProps {
    onUpload: (url: string) => void
    onRemove: () => void
    value: string
    label?: string
    accept?: string // "image/*" or ".pdf,.doc,.docx"
    folder?: "resumes" | "logos" | "portfolios"
    fullWidth?: boolean
}

export default function FileUpload({
    onUpload,
    onRemove,
    value,
    label = "Upload File",
    accept = "image/*",
    folder = "logos",
    fullWidth = false,
}: FileUploadProps) {
    const [loading, setLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFile = async (file: File) => {
        if (!file) return

        // Validation
        const isImage = file.type.startsWith("image/")
        const isPDF = file.type === "application/pdf"

        if (accept === "image/*" && !isImage) {
            toast.error("Please upload an image file")
            return
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("File size must be less than 5MB")
            return
        }

        setLoading(true)

        try {
            // 1. Get signature
            const signRes = await fetch("/api/upload/sign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ folder }),
            })

            const { signature, timestamp, cloudName, apiKey } = await signRes.json()

            // 2. Upload to Cloudinary
            const formData = new FormData()
            formData.append("file", file)
            formData.append("api_key", apiKey)
            formData.append("timestamp", timestamp.toString())
            formData.append("signature", signature)
            formData.append("folder", folder)

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/${isPDF ? "raw" : "image"}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            const data = await uploadRes.json()

            if (data.secure_url) {
                onUpload(data.secure_url)
                toast.success("Upload complete!")
            } else {
                throw new Error("Upload failed")
            }
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload file")
        } finally {
            setLoading(false)
        }
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = () => {
        setIsDragging(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
    }

    return (
        <div className={`space-y-2 ${fullWidth ? "w-full" : "w-auto"}`}>
            {/* Label */}
            <div className="flex justify-between items-center">
                <label className="font-mono uppercase text-xs tracking-wider text-muted-foreground">
                    {label}
                </label>
                {value && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault()
                            onRemove()
                        }}
                        className="h-5 px-2 text-[10px] text-destructive hover:text-destructive/80 font-mono uppercase"
                    >
                        Remove
                    </Button>
                )}
            </div>

            {value ? (
                // Preview State
                <div className="relative group border-2 border-primary/20 bg-primary/5 rounded-xl p-4 flex items-center gap-4 transition-all">
                    <div className="size-12 rounded-lg bg-background border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                        {value.endsWith(".pdf") ? (
                            <FileText className="size-6 text-primary" />
                        ) : (
                            <div className="relative w-full h-full">
                                <Image src={value} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs text-primary truncate">
                            {value.split("/").pop()}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase flex items-center gap-1 mt-1">
                            <CheckCircle2 className="size-3" /> Uploaded Successfully
                        </p>
                    </div>

                    <a
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 z-0"
                        aria-label="View file"
                    />
                </div>
            ) : (
                // Upload State
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`
            relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200 group
            flex flex-col items-center justify-center gap-2
            ${isDragging
                            ? "border-primary bg-primary/10"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        }
          `}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFile(file)
                        }}
                    />

                    {loading ? (
                        <div className="flex flex-col items-center gap-3 animate-pulse">
                            <Loader2 className="size-8 text-primary animate-spin" />
                            <p className="font-mono text-xs text-muted-foreground uppercase">Uploading...</p>
                        </div>
                    ) : (
                        <>
                            <div className="size-12 rounded-full bg-white/5 group-hover:bg-primary/20 flex items-center justify-center transition-colors mb-2">
                                {accept.includes("pdf") ? (
                                    <FileText className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                ) : (
                                    <Upload className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                )}
                            </div>
                            <p className="font-display uppercase text-sm group-hover:text-foreground transition-colors">
                                {isDragging ? "Drop to upload" : "Click or Drag to Upload"}
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground">
                                {accept.includes("pdf") ? "PDF up to 5MB" : "PNG, JPG up to 5MB"}
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

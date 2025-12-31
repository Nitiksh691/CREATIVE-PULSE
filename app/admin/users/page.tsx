"use client"

import { useEffect, useState } from "react"
import { Loader2, Search, MoreHorizontal, ShieldAlert, CheckCircle, Ban, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface User {
    _id: string
    name: string
    email: string
    role: string
    createdAt: string
    isBanned: boolean
    isVerified: boolean
    companyName?: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (search) params.set("search", search)

            const res = await fetch(`/api/admin/users?${params.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setUsers(data.users)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchUsers()
        }, 500) // Debounce search
        return () => clearTimeout(timeout)
    }, [search])

    const handleAction = async (userId: string, action: "ban" | "unban" | "verify" | "unverify") => {
        try {
            let payload: any = {}
            if (action === "ban") payload.isBanned = true
            if (action === "unban") payload.isBanned = false
            if (action === "verify") payload.isVerified = true
            if (action === "unverify") payload.isVerified = false

            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error("Action failed")

            toast.success(`User ${action} successful`)
            // Optimistic update
            setUsers(users.map(u => u._id === userId ? { ...u, ...payload } : u))

        } catch (error) {
            toast.error("Action failed")
        }
    }

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="font-display uppercase text-4xl tracking-tighter text-white">
                        User <span className="text-red-500 font-bold italic">Management</span>
                    </h1>
                    <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest opacity-60">
                        Control user access and verification level
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-red-500 transition-colors" />
                    <Input
                        placeholder="SEARCH REBELS..."
                        className="pl-9 bg-white/5 border-white/10 font-mono text-xs uppercase tracking-widest focus:border-red-500/50 focus:bg-white/10 transition-all rounded-xl h-12"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-black/40 border-b border-white/5">
                        <tr>
                            <th className="p-5 font-mono uppercase text-[10px] tracking-[0.2em] text-muted-foreground">User</th>
                            <th className="p-5 font-mono uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Role</th>
                            <th className="p-5 font-mono uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Status</th>
                            <th className="p-5 font-mono uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Joined</th>
                            <th className="p-5 font-mono uppercase text-[10px] tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading && users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center font-mono text-muted-foreground">No users found</td>
                            </tr>
                        ) : users.map((user) => (
                            <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div>
                                        <div className="font-medium flex items-center gap-2">
                                            {user.name}
                                            {user.companyName && <span className="text-xs text-muted-foreground">({user.companyName})</span>}
                                            {user.isVerified && <CheckCircle className="size-3 text-cyan-500" />}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-mono">{user.email}</div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Badge variant="outline" className={`uppercase font-mono text-[10px] ${user.role === 'admin' ? 'border-red-500/50 text-red-500' :
                                        user.role === 'company' ? 'border-orange-500/50 text-orange-500' :
                                            'border-purple-500/50 text-purple-500'
                                        }`}>
                                        {user.role}
                                    </Badge>
                                </td>
                                <td className="p-4">
                                    {user.isBanned ? (
                                        <Badge variant="destructive" className="uppercase font-mono text-[10px] flex w-fit items-center gap-1">
                                            <Ban className="size-3" /> Banned
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="uppercase font-mono text-[10px] bg-green-500/10 text-green-500 hover:bg-green-500/20">
                                            Active
                                        </Badge>
                                    )}
                                </td>
                                <td className="p-4 font-mono text-xs text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                                                Copy Email
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />

                                            {user.role === 'company' && (
                                                <DropdownMenuItem onClick={() => handleAction(user._id, user.isVerified ? "unverify" : "verify")}>
                                                    {user.isVerified ? <><XCircle className="mr-2 size-4" /> Revoke Verification</> : <><CheckCircle className="mr-2 size-4" /> Verify Company</>}
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuItem
                                                className={user.isBanned ? "text-green-500" : "text-red-500"}
                                                onClick={() => handleAction(user._id, user.isBanned ? "unban" : "ban")}
                                            >
                                                {user.isBanned ? <><CheckCircle className="mr-2 size-4" /> Unban User</> : <><ShieldAlert className="mr-2 size-4" /> Ban User</>}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

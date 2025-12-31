"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import SparklesIcon from "@/components/icons/sparkles"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Heart, MessageSquare, Share2, MoreVertical, Plus, Zap } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function CreatorDiscoverPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostSkills, setNewPostSkills] = useState("")
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [selectedPost, setSelectedPost] = useState<any>(null)

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/creator-posts")
      if (!res.ok) throw new Error("Failed to fetch posts")
      const data = await res.json()
      setPosts(data.posts)
    } catch (error) {
      console.error("Error fetching creator posts:", error)
      toast.error("Failed to load feed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) return

    setIsPosting(true)
    try {
      const res = await fetch("/api/creator-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newPostContent,
          skills: newPostSkills
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to create post")
      }

      const data = await res.json()
      setPosts([data.post, ...posts])
      setNewPostContent("")
      setNewPostSkills("")
      setIsComposerOpen(false)
      toast.success("Pitch published successfully!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Creator Discover",
        description: "Explore the rebellion's top talent",
        icon: SparklesIcon,
      }}
      showBackButton
    >
      <div className="pb-24 md:pb-8">
        <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
          <DialogTrigger asChild>
            <Button className="fixed bottom-24 md:bottom-10 right-4 md:right-10 size-14 md:size-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 hover:scale-110 z-50 transition-all">
              <Plus className="size-7 md:size-8" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-2 border-white/5 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display uppercase text-xl md:text-2xl">Share Your Pitch</DialogTitle>
              <DialogDescription className="font-mono text-xs uppercase opacity-50">
                What's your next mission? Show your skills.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="uppercase font-mono text-[10px] tracking-widest opacity-70">
                  Your Professional Pitch
                </Label>
                <Textarea
                  placeholder="I'M A SENIOR DEVELOPER SPECIALIZING IN..."
                  className="min-h-[150px] bg-background border-border/50 font-mono text-sm uppercase"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="uppercase font-mono text-[10px] tracking-widest opacity-70">
                  Relevant Skills (Comma separated)
                </Label>
                <Input
                  placeholder="Next.js, Tailwind, AI..."
                  className="bg-background border-border/50 font-mono text-sm uppercase"
                  value={newPostSkills}
                  onChange={(e) => setNewPostSkills(e.target.value)}
                />
              </div>
              <Button
                onClick={handlePostSubmit}
                disabled={isPosting}
                className="w-full h-12 md:h-14 bg-primary font-display uppercase tracking-widest text-base md:text-lg"
              >
                {isPosting ? "Publishing..." : "Publish Pitch"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-4 md:p-6 bg-card/50 rounded-xl border-2 border-white/5 space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="size-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <AnimatePresence initial={false}>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  className="bg-card/50 backdrop-blur-sm p-4 md:p-6 rounded-xl border-2 border-white/5 flex flex-col gap-3 md:gap-4 group cursor-pointer hover:border-primary/30 transition-all duration-300"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-3 md:gap-4 min-w-0 flex-1">
                      <Avatar className="size-10 md:size-12 rounded-lg shrink-0 border border-white/10">
                        <AvatarImage src={post.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="font-display">{post.name ? post.name[0] : "?"}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display uppercase text-sm md:text-base leading-none truncate mb-1">
                          {post.name}
                        </h4>
                        <p className="text-[9px] md:text-[10px] text-primary font-mono uppercase tracking-widest truncate">
                          {post.role}
                        </p>
                      </div>
                    </div>
                    <MoreVertical className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>

                  <p className="text-xs md:text-sm font-mono text-muted-foreground line-clamp-4 leading-relaxed uppercase">
                    {post.content}
                  </p>

                  <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1">
                    {post.skills.map((skill: string) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-primary/5 text-primary border border-primary/20 font-mono text-[8px] md:text-[9px] uppercase px-1.5 md:px-2 py-0.5"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 md:pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-3 md:gap-4">
                      <button className="flex items-center gap-1 md:gap-1.5 text-[10px] font-mono uppercase text-muted-foreground hover:text-primary transition-colors">
                        <Heart className="size-3.5 md:size-4" /> <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 md:gap-1.5 text-[10px] font-mono uppercase text-muted-foreground hover:text-primary transition-colors">
                        <MessageSquare className="size-3.5 md:size-4" /> <span>{post.comments || 0}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-1 md:gap-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                      <Zap className="size-3 text-primary" /> {post.views || 0}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {posts.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground font-mono uppercase">
                No active creators found. Be the first to post!
              </div>
            )}
          </div>
        )}

        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto bg-card border-2 border-white/10 w-[95vw] md:w-auto">
            <DialogHeader className="sr-only">
              <DialogTitle>Post Details</DialogTitle>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-6 md:space-y-8 py-2">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex gap-3 md:gap-4">
                    <Avatar className="size-14 md:size-16 rounded-xl shrink-0 border-2 border-white/10">
                      <AvatarImage src={selectedPost.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="font-display text-lg md:text-xl">
                        {selectedPost.name ? selectedPost.name[0] : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="justify-center flex flex-col">
                      <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight leading-none mb-1">
                        {selectedPost.name}
                      </h2>
                      <p className="text-primary font-mono uppercase text-[10px] md:text-xs tracking-widest">
                        {selectedPost.role}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="font-display uppercase tracking-widest text-xs h-10 px-6 md:px-8 border-2 bg-transparent w-full sm:w-auto"
                  >
                    Follow
                  </Button>
                </div>

                <div className="p-4 md:p-6 lg:p-8 bg-background/50 rounded-xl border border-white/5">
                  <p className="text-sm md:text-base lg:text-lg font-mono leading-relaxed uppercase">
                    {selectedPost.content}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  {selectedPost.skills.map((skill: string) => (
                    <Badge
                      key={skill}
                      className="px-3 md:px-4 py-1 text-[9px] md:text-[10px] font-mono uppercase bg-primary/10 text-primary border-primary/30"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between py-4 md:py-6 border-y border-white/10">
                  <div className="flex items-center gap-4 md:gap-6 lg:gap-10">
                    <button className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-display uppercase tracking-widest text-primary">
                      <Heart className="size-5 md:size-6" /> {selectedPost.likes} Likes
                    </button>
                    <button className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-display uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                      <MessageSquare className="size-5 md:size-6" /> {selectedPost.comments || 0} Comments
                    </button>
                  </div>
                  <Button variant="ghost" size="icon" className="hover:bg-white/5">
                    <Share2 className="size-4 md:size-5" />
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardPageLayout>
  )
}

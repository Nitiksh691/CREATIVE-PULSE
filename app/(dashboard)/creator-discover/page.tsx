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
  const [commentText, setCommentText] = useState("")
  const [isCommenting, setIsCommenting] = useState(false)

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

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const res = await fetch(`/api/creator-posts/${postId}/like`, {
        method: "POST",
      })

      if (!res.ok) throw new Error("Failed to like post")

      const data = await res.json()

      // Update posts state
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, likes: data.likesCount, isLiked: data.liked }
          : post
      ))

      // Update selected post if it's open
      if (selectedPost?.id === postId) {
        setSelectedPost({ ...selectedPost, likes: data.likesCount, isLiked: data.liked })
      }

      toast.success(data.liked ? "Liked!" : "Unliked!")
    } catch (error) {
      console.error("Error liking post:", error)
      toast.error("Failed to like post")
    }
  }

  const handleComment = async (postId: string) => {
    if (!commentText.trim()) return

    setIsCommenting(true)
    try {
      const res = await fetch(`/api/creator-posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: commentText }),
      })

      if (!res.ok) throw new Error("Failed to add comment")

      const data = await res.json()

      // Update posts state
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, comments: data.commentsCount }
          : post
      ))

      // Update selected post
      if (selectedPost?.id === postId) {
        setSelectedPost({ ...selectedPost, comments: data.commentsCount })
      }

      setCommentText("")
      toast.success("Comment added!")
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    } finally {
      setIsCommenting(false)
    }
  }

  const handleShare = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    const shareUrl = `${window.location.origin}/creator-discover?post=${postId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this creator pitch!',
          url: shareUrl,
        })
        toast.success("Shared successfully!")
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast.success("Link copied to clipboard!")
      } catch (error) {
        console.error("Error copying to clipboard:", error)
        toast.error("Failed to copy link")
      }
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
                  onClick={async () => {
                    setSelectedPost(post)
                    try {
                      const res = await fetch(`/api/creator-posts/${post.id}`)
                      if (res.ok) {
                        const data = await res.json()
                        setSelectedPost(data.post)
                      }
                    } catch (error) {
                      console.error("Error fetching post details:", error)
                    }
                  }}
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
                      <button
                        onClick={(e) => handleLike(post.id, e)}
                        className={`flex items-center gap-1 md:gap-1.5 text-[10px] font-mono uppercase transition-colors ${post.isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'
                          }`}
                      >
                        <Heart className={`size-3.5 md:size-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes || 0}</span>
                      </button>
                      <button
                        className="flex items-center gap-1 md:gap-1.5 text-[10px] font-mono uppercase text-muted-foreground hover:text-primary transition-colors"
                      >
                        <MessageSquare className="size-3.5 md:size-4" />
                        <span>{post.comments || 0}</span>
                      </button>
                      <button
                        onClick={(e) => handleShare(post.id, e)}
                        className="flex items-center gap-1 md:gap-1.5 text-[10px] font-mono uppercase text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Share2 className="size-3.5 md:size-4" />
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
                    <button
                      onClick={(e) => handleLike(selectedPost.id, e)}
                      className={`flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-display uppercase tracking-widest transition-colors ${selectedPost.isLiked ? 'text-red-500 hover:text-red-600' : 'text-primary hover:text-primary/80'
                        }`}
                    >
                      <Heart className={`size-5 md:size-6 ${selectedPost.isLiked ? 'fill-current' : ''}`} />
                      {selectedPost.likes || 0} Likes
                    </button>
                    <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-display uppercase tracking-widest text-muted-foreground">
                      <MessageSquare className="size-5 md:size-6" />
                      {selectedPost.commentsCount || 0} Comments
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/5"
                    onClick={(e) => handleShare(selectedPost.id, e)}
                  >
                    <Share2 className="size-4 md:size-5" />
                  </Button>
                </div>

                {/* Comment Section */}
                <div className="space-y-6">
                  <h3 className="font-display uppercase tracking-widest text-sm">Comments</h3>

                  {/* Existing Comments List */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedPost.comments && Array.isArray(selectedPost.comments) && selectedPost.comments.length > 0 ? (
                      selectedPost.comments.map((comment: any, idx: number) => (
                        <div key={idx} className="flex gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                          <Avatar className="size-8 rounded shrink-0 border border-white/10">
                            <AvatarImage src={comment.user?.image || comment.user?.logo || "/placeholder.svg"} />
                            <AvatarFallback className="text-[10px] font-display">
                              {comment.userName ? comment.userName[0] : (comment.user?.name ? comment.user.name[0] : "?")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-display text-[10px] md:text-xs uppercase tracking-wider text-primary">
                                {comment.userName || (comment.user?.name || "REBEL")}
                              </span>
                              <span className="text-[8px] font-mono text-muted-foreground uppercase">
                                {new Date(comment.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs font-mono text-muted-foreground leading-relaxed uppercase">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] font-mono text-muted-foreground uppercase text-center py-4 bg-white/5 rounded-lg border border-dashed border-white/10">
                        No transmissions yet. Be the first to break the silence.
                      </p>
                    )}
                  </div>

                  {/* Add Comment Form */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="min-h-[80px] bg-background border-border/50 font-mono text-sm uppercase"
                    />
                    <Button
                      onClick={() => handleComment(selectedPost.id)}
                      disabled={isCommenting || !commentText.trim()}
                      className="w-full font-display uppercase tracking-widest h-11"
                    >
                      {isCommenting ? "Broadcasting..." : "Beam Transmission"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardPageLayout>
  )
}

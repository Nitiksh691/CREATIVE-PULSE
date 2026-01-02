"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import UserIcon from "@/components/icons/user"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Mail, Globe, Calendar, Github, Linkedin, Twitter, Edit2, Save, X, Share2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import FileUpload from "@/components/ui/file-upload"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    image: "",
    role: "",
    bio: "",
    location: "",
    email: "",
    website: "",
    joinedDate: "",
    skills: [] as string[],
    experience: [] as any[],
    resume: "",
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
    },
    stats: {
      applications: 0,
      interviews: 0,
      offers: 0,
      profileViews: 0,
    },
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setProfileData(prev => ({
          ...prev,
          ...data.profileData,
          // Ensure nested objects exist to avoid crashes
          socialLinks: data.profileData.socialLinks || { github: "", linkedin: "", twitter: "" },
          stats: data.profileData.stats || { applications: 0, interviews: 0, offers: 0, profileViews: 0 }
        }))
      } else {
        toast.error("Failed to load profile data")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        toast.success("Profile updated successfully")
        setIsEditing(false)
        fetchProfile() // Refresh data
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle image upload
  const handleImageUpload = (url: string) => {
    setProfileData(prev => ({ ...prev, image: url }))
  }

  // Handle image remove
  const handleImageRemove = () => {
    setProfileData(prev => ({ ...prev, image: "" }))
  }

  // Handle resume upload
  const handleResumeUpload = (url: string) => {
    setProfileData(prev => ({ ...prev, resume: url }))
    toast.success("Resume uploaded! Don't forget to save changes.")
  }

  // Handle resume remove
  const handleResumeRemove = () => {
    setProfileData(prev => ({ ...prev, resume: "" }))
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success("Profile link copied to clipboard")
  }

  if (isLoading) {
    return (
      <DashboardPageLayout
        header={{
          title: "Your Profile",
          description: "Manage your professional identity",
          icon: UserIcon,
        }}
        showBackButton
      >
        <div className="flex justify-center items-center h-64">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </DashboardPageLayout>
    )
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Your Profile",
        description: "Manage your professional identity",
        icon: UserIcon,
      }}
      showBackButton // Added back button for improved navigation
    >
      <div className="space-y-6 md:space-y-8">
        {/* Profile Header Card */}
        <Card className="border-2 border-white/5 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="h-24 md:h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <CardContent className="relative px-4 md:px-6 pb-6 -mt-12 md:-mt-16">
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              {/* Avatar */}
              <div className="relative group">
                {isEditing ? (
                  <div className="size-24 rounded-full overflow-hidden border-4 border-background relative">
                    <div className="absolute inset-0">
                      <FileUpload
                        value={profileData.image || ""}
                        onUpload={handleImageUpload}
                        onRemove={handleImageRemove}
                        folder="logos"
                        label=""
                      />
                    </div>
                  </div>
                ) : (
                  <Avatar className="size-20 md:size-24 border-4 border-background rounded-xl">
                    {profileData.image && <AvatarImage src={profileData.image} alt={profileData.name} className="object-cover" />}
                    <AvatarFallback className="text-2xl font-display">{profileData.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* Name and Actions */}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display uppercase tracking-tight truncate">
                    {profileData.name}
                  </h2>
                  <p className="text-sm md:text-base text-primary font-mono uppercase">{profileData.role}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" /> {profileData.location || "Location not set"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" /> Joined {profileData.joinedDate}
                  </span>
                </div>
              </div>

              {/* Edit Toggle Button */}
              <div className="flex sm:flex-col gap-2 sm:justify-center">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 sm:flex-none font-mono text-xs uppercase tracking-widest gap-2"
                  >
                    <Edit2 className="size-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 sm:flex-none font-mono text-xs uppercase tracking-widest gap-2 bg-primary"
                    >
                      {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="flex-1 sm:flex-none font-mono text-xs uppercase tracking-widest gap-2"
                    >
                      <X className="size-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {Object.entries(profileData.stats).map(([key, value]) => (
            <Card key={key} className="border-2 border-white/5 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-display text-primary">{value}</div>
                <div className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-wider mt-1">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="border-2 border-white/5 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display uppercase tracking-widest text-lg md:text-xl">About</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="min-h-[120px] bg-background border-border/50 font-mono text-sm"
                  />
                ) : (
                  <p className="text-sm md:text-base text-muted-foreground font-mono leading-relaxed">
                    {profileData.bio || "No bio added yet."}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Experience Section */}
            {/* Keeping experience static or placeholder since schema update wasn't requested for it yet, 
                but hiding if empty unless we want to show it. For now, showing placeholder for structure preservation */}
            <Card className="border-2 border-white/5 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display uppercase tracking-widest text-lg md:text-xl">Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileData.experience && profileData.experience.length > 0 ? (
                  profileData.experience.map((exp: any, index: number) => (
                    <div key={index}>
                      {index > 0 && <Separator className="mb-6" />}
                      {isEditing ? (
                        <div className="space-y-3 relative pr-8">
                          <button
                            className="absolute top-0 right-0 hover:text-red-500 transition-colors"
                            onClick={() => {
                              const newExp = [...profileData.experience];
                              newExp.splice(index, 1);
                              setProfileData({ ...profileData, experience: newExp });
                            }}
                          >
                            <X className="size-4" />
                          </button>
                          <Input
                            placeholder="Job Title"
                            value={exp.title}
                            onChange={(e) => {
                              const newExp = [...profileData.experience];
                              newExp[index] = { ...newExp[index], title: e.target.value };
                              setProfileData({ ...profileData, experience: newExp });
                            }}
                            className="bg-background border-border/50 font-display uppercase tracking-wider !text-base"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => {
                                const newExp = [...profileData.experience];
                                newExp[index] = { ...newExp[index], company: e.target.value };
                                setProfileData({ ...profileData, experience: newExp });
                              }}
                              className="bg-background border-border/50 font-mono text-xs uppercase"
                            />
                            <Input
                              placeholder="Period (e.g. 2020 - 2022)"
                              value={exp.period}
                              onChange={(e) => {
                                const newExp = [...profileData.experience];
                                newExp[index] = { ...newExp[index], period: e.target.value };
                                setProfileData({ ...profileData, experience: newExp });
                              }}
                              className="bg-background border-border/50 font-mono text-xs uppercase"
                            />
                          </div>
                          <Textarea
                            placeholder="Description of responsibilities and achievements..."
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = [...profileData.experience];
                              newExp[index] = { ...newExp[index], description: e.target.value };
                              setProfileData({ ...profileData, experience: newExp });
                            }}
                            className="bg-background border-border/50 min-h-[80px] font-mono text-sm leading-relaxed"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h4 className="font-display uppercase text-base md:text-lg">{exp.title}</h4>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <p className="text-sm text-primary font-mono uppercase">{exp.company}</p>
                            <p className="text-xs text-muted-foreground font-mono uppercase">{exp.period}</p>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono leading-relaxed pt-2">{exp.description}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  !isEditing && <p className="text-sm text-muted-foreground font-mono">No experience listed.</p>
                )}

                {isEditing && (
                  <Button
                    variant="outline"
                    className="w-full font-mono text-xs uppercase mt-4 bg-transparent border-dashed border-primary/20 text-primary hover:bg-primary/5"
                    onClick={() => {
                      setProfileData({
                        ...profileData,
                        experience: [
                          ...(profileData.experience || []),
                          { title: "", company: "", period: "", description: "" }
                        ]
                      })
                    }}
                  >
                    + Add Experience
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card className="border-2 border-white/5 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display uppercase tracking-widest text-lg md:text-xl">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.length > 0 ? profileData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-primary/10 text-primary border border-primary/20 font-mono text-xs px-3 py-1"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          className="ml-2 hover:text-red-500"
                          onClick={() =>
                            setProfileData({
                              ...profileData,
                              skills: profileData.skills.filter((s) => s !== skill),
                            })
                          }
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </Badge>
                  )) : (
                    <p className="text-sm text-muted-foreground font-mono">No skills listed.</p>
                  )}
                </div>
                {/* Simplified Skill Adding for this iteration */}
                {isEditing && (
                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      id="new-skill"
                      className="bg-background border-border/50 font-mono text-sm max-w-[200px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = e.currentTarget.value.trim();
                          if (val && !profileData.skills.includes(val)) {
                            setProfileData({ ...profileData, skills: [...profileData.skills, val] })
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      className="font-mono text-xs uppercase bg-transparent"
                      onClick={() => {
                        const input = document.getElementById('new-skill') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          setProfileData({ ...profileData, skills: [...profileData.skills, input.value.trim()] })
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact & Links */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="border-2 border-white/5 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display uppercase tracking-widest text-base md:text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs font-mono uppercase">Email</Label>
                      <Input
                        value={profileData.email}
                        disabled // Email shouldn't be editable usually
                        className="bg-background/50 border-border/50 font-mono text-sm text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-mono uppercase">Website</Label>
                      <Input
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        className="bg-background border-border/50 font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-mono uppercase">Location</Label>
                      <Input
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="bg-background border-border/50 font-mono text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <Mail className="size-4 text-primary shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">Email</div>
                        <a
                          href={`mailto:${profileData.email}`}
                          className="text-sm font-mono hover:text-primary transition-colors break-all"
                        >
                          {profileData.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="size-4 text-primary shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">Website</div>
                        {profileData.website ? (
                          <a
                            href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono hover:text-primary transition-colors break-all"
                          >
                            {profileData.website}
                          </a>
                        ) : (
                          <span className="text-sm font-mono text-muted-foreground">Not set</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">Location</div>
                        <div className="text-sm font-mono">{profileData.location || "Not set"}</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-2 border-white/5 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display uppercase tracking-widest text-base md:text-lg">
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs font-mono uppercase flex items-center gap-2">
                        <Github className="size-3" /> GitHub
                      </Label>
                      <Input
                        value={profileData.socialLinks.github || ""}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialLinks: { ...profileData.socialLinks, github: e.target.value }
                        })}
                        placeholder="GitHub Profile URL"
                        className="bg-background border-border/50 font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-mono uppercase flex items-center gap-2">
                        <Linkedin className="size-3" /> LinkedIn
                      </Label>
                      <Input
                        value={profileData.socialLinks.linkedin || ""}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialLinks: { ...profileData.socialLinks, linkedin: e.target.value }
                        })}
                        placeholder="LinkedIn Profile URL"
                        className="bg-background border-border/50 font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-mono uppercase flex items-center gap-2">
                        <Twitter className="size-3" /> Twitter
                      </Label>
                      <Input
                        value={profileData.socialLinks.twitter || ""}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialLinks: { ...profileData.socialLinks, twitter: e.target.value }
                        })}
                        placeholder="Twitter Profile URL"
                        className="bg-background border-border/50 font-mono text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {profileData.socialLinks.github && (
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 font-mono text-xs uppercase bg-transparent"
                        asChild
                      >
                        <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="size-4" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {profileData.socialLinks.linkedin && (
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 font-mono text-xs uppercase bg-transparent"
                        asChild
                      >
                        <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="size-4" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {profileData.socialLinks.twitter && (
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 font-mono text-xs uppercase bg-transparent"
                        asChild
                      >
                        <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="size-4" />
                          Twitter
                        </a>
                      </Button>
                    )}
                    {!profileData.socialLinks.github && !profileData.socialLinks.linkedin && !profileData.socialLinks.twitter && (
                      <p className="text-sm text-muted-foreground font-mono">No social links added.</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2 border-white/5 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display uppercase tracking-widest text-base md:text-lg">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-2">
                    <Label className="text-xs font-mono uppercase">Update Resume</Label>
                    <FileUpload
                      value={profileData.resume || ""}
                      onUpload={handleResumeUpload}
                      onRemove={handleResumeRemove}
                      folder="resumes"
                      accept=".pdf,.doc,.docx"
                      label="Upload Resume"
                      fullWidth
                    />
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full font-mono text-xs uppercase bg-transparent"
                    disabled={!profileData.resume}
                    asChild={!!profileData.resume}
                  >
                    {profileData.resume ? (
                      <a href={profileData.resume} target="_blank" rel="noopener noreferrer">
                        Download Resume
                      </a>
                    ) : (
                      "No Resume Uploaded"
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full font-mono text-xs uppercase bg-transparent"
                  onClick={handleShare}
                >
                  <Share2 className="size-4 mr-2" />
                  Share Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  )
}

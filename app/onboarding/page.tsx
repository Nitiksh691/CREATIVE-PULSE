"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Building, Shield, ArrowRight, AlertCircle, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import FileUpload from "@/components/ui/file-upload"
import { motion, AnimatePresence } from "framer-motion"

type UserRole = "freelancer" | "company" | "admin"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [step, setStep] = useState<"role" | "details">("role")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(false)

  // Check if already onboarded
  useEffect(() => {
    if (isLoaded && user?.unsafeMetadata?.onboardingCompleted) {
      toast.info("You've already completed onboarding")
      router.push("/dashboard")
    }
  }, [isLoaded, user, router])

  // Freelancer form state
  const [freelancerData, setFreelancerData] = useState({
    skills: [] as string[],
    bio: "",
    portfolio: "",
    resume: "",
    hourlyRate: "",
    availability: "full-time",
  })
  const [skillInput, setSkillInput] = useState("")

  // Company form state
  const [companyData, setCompanyData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    website: "",
    description: "",
    logo: "",
  })

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setStep("details")
  }

  const addSkill = () => {
    if (skillInput.trim() && !freelancerData.skills.includes(skillInput.trim())) {
      setFreelancerData({
        ...freelancerData,
        skills: [...freelancerData.skills, skillInput.trim()],
      })
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setFreelancerData({
      ...freelancerData,
      skills: freelancerData.skills.filter((s) => s !== skill),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload =
        selectedRole === "freelancer"
          ? {
            role: selectedRole,
            ...freelancerData,
            hourlyRate: Number.parseFloat(freelancerData.hourlyRate) || 0,
          }
          : selectedRole === "company"
            ? {
              role: selectedRole,
              ...companyData,
            }
            : {
              role: selectedRole,
            }

      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to complete onboarding")
      }

      // Reload user session to get updated claims from server
      await user?.reload()

      toast.success("Onboarding completed!")

      // Redirect based on role
      if (selectedRole === "company") {
        router.push("/company-dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Onboarding error:", error)
      toast.error("Failed to complete onboarding. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      <div className="max-w-5xl w-full relative z-10">
        <AnimatePresence mode="wait">
          {step === "role" ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-widest mb-4"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  System Initialization
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-display uppercase tracking-tight text-white mb-2">
                  Choose Your <span className="text-primary text-glow">Path</span>
                </h1>
                <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto">
                  Select your role to configure your workspace. This defines your mission parameters and access protocols.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Freelancer Card */}
                <motion.div whileHover={{ y: -5 }} className="h-full">
                  <div
                    className="group relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 cursor-pointer hover:border-primary/50 transition-all duration-300 overflow-hidden"
                    onClick={() => handleRoleSelect("freelancer")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                      <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]">
                        <Briefcase className="size-10 text-primary" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-3xl font-display uppercase tracking-wider text-white">Freelancer</h3>
                        <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                          Operative / Specialist
                        </p>
                      </div>

                      <div className="w-full h-px bg-white/10" />

                      <ul className="space-y-3 text-left w-full">
                        <li className="flex items-center gap-3 text-sm text-gray-300 font-mono">
                          <Check className="size-4 text-primary shrink-0" />
                          <span>Access high-stakes missions</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300 font-mono">
                          <Check className="size-4 text-primary shrink-0" />
                          <span>Build your digital portfolio</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300 font-mono">
                          <Check className="size-4 text-primary shrink-0" />
                          <span>Direct line to companies</span>
                        </li>
                      </ul>

                      <div className="w-full pt-4">
                        <Button className="w-full bg-primary/20 hover:bg-primary hover:text-white border border-primary/50 font-display uppercase tracking-widest">
                          Initialize as Freelancer
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Company Card */}
                <motion.div whileHover={{ y: -5 }} className="h-full">
                  <div
                    className="group relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 cursor-pointer hover:border-primary/50 transition-all duration-300 overflow-hidden"
                    onClick={() => handleRoleSelect("company")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                      <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]">
                        <Building className="size-10 text-primary" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-3xl font-display uppercase tracking-wider text-white">Company</h3>
                        <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                          Organization / Recruiter
                        </p>
                      </div>

                      <div className="w-full h-px bg-white/10" />

                      <ul className="space-y-3 text-left w-full">
                        <li className="flex items-center gap-3 text-sm text-gray-300 font-mono">
                          <Check className="size-4 text-primary shrink-0" />
                          <span>Post classified openings</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300 font-mono">
                          <Check className="size-4 text-primary shrink-0" />
                          <span>Scout elite talent</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300 font-mono">
                          <Check className="size-4 text-primary shrink-0" />
                          <span>Manage application pipeline</span>
                        </li>
                      </ul>

                      <div className="w-full pt-4">
                        <Button className="w-full bg-primary/10 hover:bg-white/10 text-white border border-white/20 font-display uppercase tracking-widest">
                          Initialize as Company
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="details-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <Button
                variant="ghost"
                onClick={() => setStep("role")}
                className="mb-6 hover:bg-white/5 text-muted-foreground hover:text-white font-mono uppercase text-xs tracking-wider gap-2 pl-0"
              >
                ← Back to Selection
              </Button>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  {selectedRole === "freelancer" ? (
                    <Briefcase className="size-24 text-white/5 -rotate-12" />
                  ) : (
                    <Building className="size-24 text-white/5 -rotate-12" />
                  )}
                </div>

                <div className="relative z-10 space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-display uppercase tracking-tight text-white">
                      {selectedRole === "freelancer" ? "Operative Profile" : "Entity Registration"}
                    </h2>
                    <p className="text-muted-foreground font-mono text-sm">
                      Complete your dossier to finalize initialization.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {selectedRole === "freelancer" && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="font-mono uppercase text-xs tracking-wider text-primary">Resume (PDF)</Label>
                          <FileUpload
                            value={freelancerData.resume}
                            onUpload={(url) => setFreelancerData({ ...freelancerData, resume: url })}
                            onRemove={() => setFreelancerData({ ...freelancerData, resume: "" })}
                            accept=".pdf"
                            folder="resumes"
                            label="Upload Resume"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="font-mono uppercase text-xs tracking-wider text-primary">Core Skills</Label>
                          <div className="flex gap-2">
                            <Input
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                              placeholder="e.g. React, Node.js, Design"
                              className="bg-black/20 border-white/10 focus:border-primary/50 font-mono text-sm h-12"
                            />
                            <Button type="button" onClick={addSkill} className="bg-primary hover:bg-primary/90 h-12 px-6">
                              ADD
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {freelancerData.skills.length === 0 && (
                              <span className="text-xs text-muted-foreground font-mono italic">No skills added yet</span>
                            )}
                            {freelancerData.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="font-mono bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer border border-primary/20 py-1.5 px-3 uppercase text-xs tracking-wider transition-colors"
                                onClick={() => removeSkill(skill)}
                              >
                                {skill} <span className="ml-2 opacity-50">×</span>
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="font-mono uppercase text-xs tracking-wider text-primary">Bio / Summary</Label>
                          <Textarea
                            value={freelancerData.bio}
                            onChange={(e) => setFreelancerData({ ...freelancerData, bio: e.target.value })}
                            placeholder="Brief briefing about your capabilities..."
                            className="bg-black/20 border-white/10 focus:border-primary/50 font-mono text-sm min-h-[120px] resize-none"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="font-mono uppercase text-xs tracking-wider text-primary">Hourly Rate (USD)</Label>
                            <Input
                              type="number"
                              value={freelancerData.hourlyRate}
                              onChange={(e) => setFreelancerData({ ...freelancerData, hourlyRate: e.target.value })}
                              placeholder="50"
                              className="bg-black/20 border-white/10 focus:border-primary/50 font-mono text-sm h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-mono uppercase text-xs tracking-wider text-primary">Portfolio URL</Label>
                            <Input
                              value={freelancerData.portfolio}
                              onChange={(e) => setFreelancerData({ ...freelancerData, portfolio: e.target.value })}
                              placeholder="https://..."
                              className="bg-black/20 border-white/10 focus:border-primary/50 font-mono text-sm h-12"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRole === "company" && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="font-mono uppercase text-xs tracking-wider text-primary">Company Logo</Label>
                          <FileUpload
                            value={companyData.logo}
                            onUpload={(url) => setCompanyData({ ...companyData, logo: url })}
                            onRemove={() => setCompanyData({ ...companyData, logo: "" })}
                            accept="image/*"
                            folder="logos"
                            label="Upload Logo"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="font-mono uppercase text-xs tracking-wider text-primary">Company Name</Label>
                            <Input
                              value={companyData.companyName}
                              onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                              placeholder="Corporation Inc."
                              className="bg-black/20 border-white/10 focus:border-primary/50 font-mono text-sm h-12"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-mono uppercase text-xs tracking-wider text-primary">Industry</Label>
                            <Input
                              value={companyData.industry}
                              onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                              placeholder="e.g. Fintech, Cyber"
                              className="bg-black/20 border-white/10 focus:border-primary/50 font-mono text-sm h-12"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="font-mono uppercase text-xs tracking-wider text-primary">Workforce Size</Label>
                            <Select
                              value={companyData.companySize}
                              onValueChange={(value) => setCompanyData({ ...companyData, companySize: value })}
                            >
                              <SelectTrigger className="bg-black/20 border-white/10 focus:border-primary/50 font-mono text-sm h-12">
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1-10">1-10 operatives</SelectItem>
                                <SelectItem value="11-50">11-50 operatives</SelectItem>
                                <SelectItem value="51-200">51-200 operatives</SelectItem>
                                <SelectItem value="201-500">201-500 operatives</SelectItem>
                                <SelectItem value="500+">500+ operatives</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="font-mono uppercase text-xs tracking-wider text-primary">Website</Label>
                            <Input
                              value={companyData.website}
                              onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                              placeholder="https://..."
                              className="bg-black/20 border-white/10 focus:border-primary/50 font-mono text-sm h-12"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="font-mono uppercase text-xs tracking-wider text-primary">Mission Brief</Label>
                          <Textarea
                            value={companyData.description}
                            onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                            placeholder="Describe your organization's objectives..."
                            className="bg-black/20 border-white/10 focus:border-primary/50 font-mono text-sm min-h-[120px] resize-none"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 bg-primary hover:bg-primary/90 text-xl font-display uppercase tracking-widest relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : "Finalize Protocol"}
                        {!loading && <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />}
                      </span>
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

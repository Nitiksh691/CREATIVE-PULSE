"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const STEPS = ["Basics", "Requirements", "Details"]

export function JobPostingForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(0)
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput])
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`size-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                i <= step ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span className={`ml-2 text-xs uppercase ${i === step ? "text-primary" : "text-muted-foreground"}`}>
              {s}
            </span>
            {i < STEPS.length - 1 && <div className="w-12 h-px bg-border mx-4" />}
          </div>
        ))}
      </div>

      <div className="glass-card p-8 rounded-xl border border-border/50">
        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input placeholder="e.g. Senior Frontend Rebel" className="h-12 bg-background/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger className="h-12 bg-background/50">
                    <SelectValue placeholder="Full-time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="Remote or City" className="h-12 bg-background/50" />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Skills Required</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Type a skill and press Enter"
                  className="h-12 bg-background/50"
                />
                <Button onClick={addSkill} variant="secondary" className="h-12">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((s) => (
                  <Badge key={s} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
                    {s}
                    <X className="size-3 ml-2 cursor-pointer" onClick={() => removeSkill(s)} />
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select>
                  <SelectTrigger className="h-12 bg-background/50">
                    <SelectValue placeholder="Junior" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid-level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Salary Range</Label>
                <Input placeholder="e.g. $100k - $150k" className="h-12 bg-background/50" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Job Description</Label>
              <Textarea placeholder="Describe the mission..." className="min-h-[200px] bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input type="date" className="h-12 bg-background/50" />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} className="bg-primary hover:bg-primary/90">
              Next Step
            </Button>
          ) : (
            <Button onClick={onSuccess} className="bg-primary hover:bg-primary/90">
              Post Mission
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

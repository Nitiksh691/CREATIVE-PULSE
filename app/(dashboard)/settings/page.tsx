"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import GearIcon from "@/components/icons/gear"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Settings",
        description: "Manage your account and preferences",
        icon: GearIcon,
      }}
      showBackButton // Added back button for improved navigation
    >
      <div className="space-y-6 md:space-y-8 max-w-4xl">
        {/* Account Settings */}
        <Card className="border-2 border-white/5 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display uppercase tracking-widest text-lg md:text-xl">
              Account Settings
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              Manage your account information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-mono text-xs uppercase">
                Username
              </Label>
              <Input id="username" defaultValue="KRIMSON" className="bg-background border-border/50 font-mono" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-xs uppercase">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue="krimson@joyco.studio"
                className="bg-background border-border/50 font-mono"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="current-password" className="font-mono text-xs uppercase">
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                className="bg-background border-border/50 font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="font-mono text-xs uppercase">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                className="bg-background border-border/50 font-mono"
              />
            </div>

            <Button className="font-mono text-xs uppercase tracking-widest">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-2 border-white/5 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display uppercase tracking-widest text-lg md:text-xl">Notifications</CardTitle>
            <CardDescription className="font-mono text-xs">Control how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-mono text-sm">Job Match Alerts</Label>
                <p className="text-xs text-muted-foreground font-mono">Get notified when new jobs match your profile</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-mono text-sm">Application Updates</Label>
                <p className="text-xs text-muted-foreground font-mono">Receive updates on your job applications</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-mono text-sm">Company Messages</Label>
                <p className="text-xs text-muted-foreground font-mono">Get notified when companies message you</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-mono text-sm">Weekly Digest</Label>
                <p className="text-xs text-muted-foreground font-mono">Receive a weekly summary of activity</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="border-2 border-white/5 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display uppercase tracking-widest text-lg md:text-xl">Privacy</CardTitle>
            <CardDescription className="font-mono text-xs">Control your profile visibility and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-mono text-sm">Profile Visibility</Label>
                <p className="text-xs text-muted-foreground font-mono">Make your profile visible to companies</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-mono text-sm">Show Activity Status</Label>
                <p className="text-xs text-muted-foreground font-mono">Let others see when you're active</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-mono text-sm">Anonymous Browsing</Label>
                <p className="text-xs text-muted-foreground font-mono">Browse jobs without leaving a trace</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-2 border-red-500/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display uppercase tracking-widest text-lg md:text-xl text-red-500">
              Danger Zone
            </CardTitle>
            <CardDescription className="font-mono text-xs">Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <Label className="font-mono text-sm">Deactivate Account</Label>
                <p className="text-xs text-muted-foreground font-mono">Temporarily disable your account</p>
              </div>
              <Button
                variant="outline"
                className="font-mono text-xs uppercase text-red-500 border-red-500/30 hover:bg-red-500/10 bg-transparent"
              >
                Deactivate
              </Button>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <Label className="font-mono text-sm">Delete Account</Label>
                <p className="text-xs text-muted-foreground font-mono">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" className="font-mono text-xs uppercase">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  )
}

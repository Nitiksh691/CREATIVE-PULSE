import HomeIcon from "@/components/icons/home"
import BriefcaseIcon from "@/components/icons/briefcase"
import BuildingIcon from "@/components/icons/building"
import SparklesIcon from "@/components/icons/sparkles"
import FileTextIcon from "@/components/icons/file-text"
// <CHANGE> Removed MessageSquareIcon import - messaging feature removed
import UserIcon from "@/components/icons/user"
import GearIcon from "@/components/icons/gear"
import { Shield } from "lucide-react"

export const NAVIGATION_CONFIG = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: HomeIcon,
    mobile: true,
  },
  {
    title: "Jobs",
    url: "/jobs",
    icon: BriefcaseIcon,
    mobile: true,
  },
  {
    title: "Companies",
    url: "/companies",
    icon: BuildingIcon,
    mobile: true,
  },
  {
    title: "Creator Discover",
    url: "/creator-discover",
    icon: SparklesIcon,
    mobile: true,
  },
  {
    title: "Applications",
    url: "/applications",
    icon: FileTextIcon,
    mobile: false,
  },
  // <CHANGE> Removed Messages navigation item - messaging feature no longer needed
  {
    title: "Profile",
    url: "/profile",
    icon: UserIcon,
    mobile: true,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Shield,
    mobile: false,
    isAdmin: true,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: GearIcon,
    mobile: false,
  },
]

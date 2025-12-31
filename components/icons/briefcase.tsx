import type { SVGProps } from "react"
const BriefcaseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <path stroke="currentColor" strokeLinecap="square" strokeWidth={1.667} d="M16.667 5.833H3.333v10h13.334v-10Z" />
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.667}
      d="M13.333 5.833V4.167a.833.833 0 0 0-.833-.834H7.5a.833.833 0 0 0-.833.834v1.666m10 5h-13.334"
    />
  </svg>
)
export default BriefcaseIcon

import type { SVGProps } from "react"
const BuildingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.667}
      d="M2.5 17.5h15M4.167 17.5V4.167h7.5V17.5m4.166 0v-7.5h-4.166"
    />
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.667}
      d="M6.667 7.5h2.5m-2.5 2.5h2.5m-2.5 2.5h2.5m6.667 0h-2.5"
    />
  </svg>
)
export default BuildingIcon

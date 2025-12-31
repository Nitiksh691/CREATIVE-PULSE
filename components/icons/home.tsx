import type { SVGProps } from "react"
const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.667}
      d="M2.5 7.5 10 2.5l7.5 5v9.167a.833.833 0 0 1-.833.833h-13.334a.833.833 0 0 1-.833-.833V7.5Z"
    />
    <path stroke="currentColor" strokeLinecap="square" strokeWidth={1.667} d="M7.5 17.5v-6.667h5V17.5" />
  </svg>
)
export default HomeIcon

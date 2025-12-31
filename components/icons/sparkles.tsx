import type { SVGProps } from "react"
const SparklesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.667}
      d="M10 2.5v2.083m0 10.834V17.5m5.417-7.5h2.083m-15 0h2.083M14.583 5.417l1.459-1.459m-11.667 0 1.458 1.459m10.209 9.166-1.459-1.458M5.417 5.417l-1.459 1.458"
    />
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.667}
      d="M12.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
    />
  </svg>
)
export default SparklesIcon

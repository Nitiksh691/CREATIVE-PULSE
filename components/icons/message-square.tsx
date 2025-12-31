import type { SVGProps } from "react"
const MessageSquareIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.667}
      d="M17.5 11.667a1.667 1.667 0 0 1-1.667 1.666h-7.5l-5.833 3.334V5a1.667 1.667 0 0 1 1.667-1.667h11.666A1.667 1.667 0 0 1 17.5 5v6.667Z"
    />
  </svg>
)
export default MessageSquareIcon

import type { SVGProps } from "react"
const FileTextIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.667}
      d="M11.667 2.5H5a.833.833 0 0 0-.833.833v13.334c0 .46.373.833.833.833h10a.833.833 0 0 0 .833-.833V7.5l-4.166-5Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.667}
      d="M11.667 2.5v5h4.166M12.5 10.833H7.5m5 2.5H7.5"
    />
  </svg>
)
export default FileTextIcon

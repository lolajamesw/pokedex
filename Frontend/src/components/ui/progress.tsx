import * as React from "react"
import { cn } from "./../../lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, color = "bg-gray-900", ...props }, ref) => (
    <div ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)} {...props}>
      <div
        className={`h-full w-full rounded-full flex-1 ${color} transition-all duration-400 ease-out`}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
        }}
      />
    </div>
  ),
)
Progress.displayName = "Progress"

export { Progress }

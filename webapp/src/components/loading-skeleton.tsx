import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Section = {
  key?: string
  lines?: number
  height?: number
  className?: string
}

type PageSkeletonProps = {
  withHeader?: boolean
  headerActions?: number
  sections?: Section[]
  layout?: "single" | "two-column" | "split"
  className?: string
}

export function LoadingPageSkeleton({
  withHeader = true,
  headerActions = 2,
  sections = [{ lines: 3 }, { lines: 4 }, { lines: 2 }],
  layout = "single",
  className,
}: PageSkeletonProps) {
  const sectionWrapperClasses = {
    single: "grid gap-6",
    "two-column": "grid gap-6 md:grid-cols-2",
    split: "grid gap-6 lg:grid-cols-[2fr_1fr]",
  }[layout]

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {withHeader && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72 max-w-[70vw]" />
          </div>
          <div className="flex gap-3">
            {Array.from({ length: headerActions }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="h-9 w-28 rounded-md"
              />
            ))}
          </div>
        </div>
      )}

      <div className={sectionWrapperClasses}>
        {sections.map(({ key, lines = 3, height, className: sectionClass }, idx) => (
          <Card key={key ?? idx} className={cn("space-y-0", sectionClass)}>
            <CardHeader className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-60 max-w-[80%]" />
            </CardHeader>

            <CardContent className="space-y-3">
              {Array.from({ length: lines }).map((_, lineIdx) => (
                <Skeleton
                  key={lineIdx}
                  className={cn(
                    "h-4 w-full",
                    lineIdx === lines - 1 ? "w-1/2" : "w-full",
                    height && lineIdx === 0 && `h-[${height}px]`
                  )}
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
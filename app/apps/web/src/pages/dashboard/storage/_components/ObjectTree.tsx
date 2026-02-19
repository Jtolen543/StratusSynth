import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBucket, faEllipsisVertical, faFolder, faPlay } from "@fortawesome/free-solid-svg-icons"
import type { FormattedFileStructure } from "@packages/types/bucket"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { iconExtensionMatcher } from "../utils"
import { Checkbox } from "@/components/ui/checkbox"
import { HookBucketDetails } from "../queries/useGetBucketDetails"

interface ObjectTreeProps {
  details: HookBucketDetails
  className?: string
  onSelectFolder?: (path: string) => void
  selectedFolder: string
}

export function ObjectTree({ details, className, onSelectFolder, selectedFolder }: ObjectTreeProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [showFiles, setShowFiles] = useState<boolean>(false)
  const rootFolderCount = details.children.filter((node) => node.path.endsWith("/")).length
  const rootVisibleCount = showFiles ? details.children.length : rootFolderCount
  const showFilesId = "object-tree-show-files"

  return (
    <Card
      className={`flex h-full max-h-[800px] flex-col overflow-hidden border border-border/70 shadow-sm ${className ?? ""}`}
    >
      <CardHeader className="space-y-0 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">Object Browser</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faBucket} />
              <span className="truncate">{details.name}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
              {rootVisibleCount} root items
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onSelect={() => setOpen(true)}>Expand all</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setOpen(false)}>Collapse all</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onSelectFolder?.("")}>Go to root</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        <div className="flex items-center gap-2 px-4 pb-3 text-sm text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${open ? "rotate-90" : "rotate-0"} transition-transform`}
                onClick={() => setOpen((prev) => !prev)}
              >
                <FontAwesomeIcon icon={faPlay} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle objects</TooltipContent>
          </Tooltip>
          <div className="flex items-center gap-2 font-medium text-foreground">
            Root objects
            <Badge variant="outline" className="hidden sm:inline-flex">
              {rootVisibleCount} entries
            </Badge>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id={showFilesId}
                checked={showFiles}
                onCheckedChange={(checked) => setShowFiles(Boolean(checked))}
                className="h-4 w-4"
              />
              <label htmlFor={showFilesId} className="text-xs font-medium text-foreground">
                Show files
              </label>
            </div>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => onSelectFolder?.("")}>
              View root
            </Button>
          </div>
        </div>
        <Separator />
        <div className="relative flex-1 overflow-auto px-2 py-3 no-scrollbar">
          {open ? (
            <div className="space-y-1">
              <ObjectTreeChildren
                nodes={details.children}
                indentLevel={16}
                onSelectFolder={onSelectFolder}
                selectedFolder={selectedFolder}
                showFiles={showFiles}
              />
            </div>
          ) : (
            <div className="px-4 text-sm text-muted-foreground">Expand to browse objects</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ObjectTreeChildrenProps {
  nodes: FormattedFileStructure
  indentLevel: number
  onSelectFolder?: (path: string) => void
  selectedFolder: string
  showFiles: boolean
}

function ObjectTreeChildren({ nodes, indentLevel, onSelectFolder, selectedFolder, showFiles }: ObjectTreeChildrenProps) {
  const [openArray, setOpenArray] = useState<boolean[]>(Array.from({ length: nodes.length }, () => false))

  const handleObjectClick = (idx: number) => {
    setOpenArray((prev) => {
      const current = [...prev]
      current[idx] = !prev[idx]
      return current
    })
  }

  return (
    <div className="flex flex-col gap-1">
      {nodes.map((node, idx) => {
        const isFolder = node.path.endsWith("/")
        if (!showFiles && !isFolder) return null

        const visibleChildCount = showFiles
          ? node.children.length
          : node.children.filter((child) => child.path.endsWith("/")).length
        const isActive = isFolder && node.path === selectedFolder

        return (
          <div
            key={`${node.path}-${idx}`}
            className={`rounded-lg border border-transparent transition-colors duration-150 hover:border-border/80 hover:bg-muted/60 ${
              isActive ? "border-primary/60 bg-primary/5" : ""
            }`}
            style={{ paddingLeft: indentLevel }}
            onClick={() => (isFolder ? onSelectFolder?.(node.path) : undefined)}
          >
            <div className="flex items-center gap-2 px-2 py-1.5">
              {isFolder ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 ${openArray[idx] ? "rotate-90" : "rotate-0"} transition-transform`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleObjectClick(idx)
                      }}
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle folder</TooltipContent>
                </Tooltip>
              ) : (
                <div className="w-7" />
              )}

              {isFolder ? <FontAwesomeIcon icon={faFolder} size="lg" /> : iconExtensionMatcher(node.relativePath)}
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate text-sm font-medium">{node.relativePath}</span>
                {isFolder && (
                  <Badge variant="outline" className="hidden sm:inline-flex text-[11px]">
                    {visibleChildCount} items
                  </Badge>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onSelect={() => (isFolder ? onSelectFolder?.(node.path) : undefined)}>
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem>Copy path</DropdownMenuItem>
                  <DropdownMenuItem>Configure</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {openArray[idx] && (
              <div className="border-l border-border/60 pl-4">
                <ObjectTreeChildren
                  nodes={node.children}
                  indentLevel={indentLevel + 12}
                  onSelectFolder={onSelectFolder}
                  selectedFolder={selectedFolder}
                  showFiles={showFiles}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
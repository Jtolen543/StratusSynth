
import type React from "react"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBucket, faChevronRight, faEllipsisVertical, faFolder, faPlay } from "@fortawesome/free-solid-svg-icons"
import type { FormattedFileStructure } from "@packages/types/bucket"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { type FolderPathMapProps, formatBytes, formatDate, iconExtensionMatcher } from "../utils"
import type { HookBucketDetails } from "../queries/useGetBucketDetails"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface ObjectTreeProps {
  details: HookBucketDetails
  className?: string
  onSelectFolder?: (path: string) => void
  selectedFolder: string
}

function ObjectTree({ details, className, onSelectFolder, selectedFolder }: ObjectTreeProps) {
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

interface ObjectDetailsProps {
  bucket: string
  folder: string
  folderMap: FolderPathMapProps
  className?: string
}

function ObjectDetails({ bucket, folder, folderMap, className }: ObjectDetailsProps) {
  const [pageSize, setPageSize] = useState<number>(12)
  const segments = folder.split("/").filter(Boolean)
  const children = folderMap[folder] ?? []
  const activeLabel = folder === "" ? "Root" : folder.replace(/\/$/, "")
  const [page, setPage] = useState<number>(1)
  const [activeItem, setActiveItem] = useState<FormattedFileStructure[number] | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    setPage(1)
    setSelectedItems(new Set())
  }, [folder])

  const totalPages = Math.max(1, Math.ceil(children.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const pageItems = children.slice(startIndex, startIndex + pageSize)

  const toggleSelectAll = () => {
    if (selectedItems.size === pageItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(pageItems.map((item) => item.path)))
    }
  }

  const toggleSelectItem = (path: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(path)) {
      newSelected.delete(path)
    } else {
      newSelected.add(path)
    }
    setSelectedItems(newSelected)
  }

  const isFolder = activeItem?.path?.endsWith("/") ?? false
  const detailFields =
    activeItem === null
      ? []
      : [
          { label: "Path", value: activeItem.path || "--" },
          { label: "Type", value: isFolder ? "Folder" : activeItem.data?.contentType || "File" },
          { label: "Items", value: isFolder ? (activeItem.children?.length ?? 0) : "--" },
          { label: "Size", value: isFolder ? "--" : formatBytes(activeItem.data?.size || 0) },
          { label: "Created", value: isFolder ? "--" : formatDate(activeItem.data?.timeCreated || "") },
          { label: "Updated", value: isFolder ? "--" : formatDate(activeItem.data?.updated || "") },
          { label: "Storage Class", value: isFolder ? "--" : activeItem.data?.storageClass || "Standard" },
          { label: "Public", value: isFolder ? "--" : "Not Public" },
        ]

  return (
    <>
      <Card
        className={`flex h-full flex-1 flex-col max-h-[800px] overflow-hidden border border-border/70 shadow-sm ${className ?? ""}`}
      >
        <CardHeader className="space-y-3 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground min-w-0">
              <span className="font-semibold text-foreground whitespace-nowrap">Buckets</span>
              <FontAwesomeIcon icon={faChevronRight} className="shrink-0" />
              <span className="text-foreground truncate max-w-[120px] sm:max-w-none">{bucket}</span>
              {segments.map((segment, index) => (
                <div key={`${segment}-${index}`} className="flex items-center gap-2 min-w-0">
                  <FontAwesomeIcon icon={faChevronRight} className="shrink-0" />
                  <span className="text-foreground truncate max-w-[100px] sm:max-w-[150px]">{segment}</span>
                </div>
              ))}
            </div>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs whitespace-nowrap shrink-0">
              {children.length} {children.length === 1 ? "item" : "items"}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0 flex-1">
              <FontAwesomeIcon icon={faFolder} className="text-primary shrink-0" />
              <span className="font-medium text-foreground truncate">{activeLabel}</span>
              <Badge variant="outline" className="hidden sm:inline-flex shrink-0">
                Contents
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button size="sm" variant="outline" type="button" className="text-xs sm:text-sm bg-transparent">
                Refresh
              </Button>
              <Button size="sm" variant="secondary" type="button" className="text-xs sm:text-sm">
                New Folder
              </Button>
              <Button size="sm" variant="default" type="button" className="text-xs sm:text-sm">
                Upload
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col p-0">
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {children.length === 0 ? (
              <div className="flex h-full min-h-[240px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/20 px-4 py-10 m-4">
                <div className="text-center">
                  <FontAwesomeIcon icon={faFolder} className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-3 text-sm font-medium text-foreground">No objects yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Upload files or create folders to get started</p>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
                  <div className="grid grid-cols-[minmax(18rem,1fr)_9rem_11rem_auto] items-center gap-x-4 px-3 py-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Checkbox
                            checked={selectedItems.size === pageItems.length && pageItems.length > 0}
                            onCheckedChange={toggleSelectAll}
                            className="h-4 w-4"
                            aria-label="Select all items"
                          />
                        </TooltipTrigger>
                        <TooltipContent>Select all items</TooltipContent>
                      </Tooltip>
                      <div className="font-semibold truncate">Name</div>
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground">Size</div>
                    <div className="text-xs font-semibold text-muted-foreground">Updated</div>
                    <div className="text-xs font-semibold text-muted-foreground pr-1">Actions</div>
                  </div>
                </div>

                <div className="p-2 space-y-2">
                  {pageItems.map((child, idx) => {
                    const folderItem = child.path.endsWith("/")
                    const isSelected = selectedItems.has(child.path)

                    return (
                      <div
                        key={`bucket-row-${child.path}-${idx}`}
                        className={`grid grid-cols-[minmax(18rem,1fr)_9rem_11rem_auto] items-center gap-x-4 rounded-lg border bg-card px-3 py-2 transition-colors ${
                          isSelected ? "bg-muted/40 border-primary/40" : "hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleSelectItem(child.path)}
                                className="h-4 w-4"
                                aria-label={`Select ${child.relativePath}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>Select {folderItem ? "folder" : "object"}</TooltipContent>
                          </Tooltip>

                          <div className="flex items-center gap-2 min-w-0">
                            {folderItem ? (
                              <FontAwesomeIcon icon={faFolder} size="lg" />
                            ) : (
                              iconExtensionMatcher(child.relativePath)
                            )}
                            <div className="min-w-0">
                              <div className="truncate font-medium">{child.relativePath}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {folderItem ? "Folder" : child.data?.contentType}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground truncate">
                          {folderItem ? "—" : formatBytes(child.data?.size || 0)}
                        </div>

                        <div className="text-sm text-muted-foreground truncate">
                          {folderItem ? "—" : formatDate(child.data?.updated || "")}
                        </div>

                        <div className="justify-self-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onSelect={() => setActiveItem(child)}>View details</DropdownMenuItem>
                              <DropdownMenuItem>Open</DropdownMenuItem>
                              <DropdownMenuItem>Share link</DropdownMenuItem>
                              <DropdownMenuItem>Configure</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          {children.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 pt-3 pb-0 text-sm">
              <span className="text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + pageSize, children.length)} of {children.length}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="px-2 text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={!!activeItem}
        onOpenChange={(open) => {
          if (!open) setActiveItem(null)
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                {isFolder ? (
                  <FontAwesomeIcon icon={faFolder} className="h-6 w-6 text-primary" />
                ) : (
                  <div className="text-muted-foreground">
                    {activeItem && iconExtensionMatcher(activeItem.relativePath)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="truncate text-xl break-all">
                  {activeItem?.relativePath || "Item Details"}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant={isFolder ? "outline" : "secondary"} className="shrink-0">
                    {isFolder ? "Folder" : "Object"}
                  </Badge>
                  {!isFolder && activeItem?.data?.contentType && (
                    <span className="text-xs truncate">{activeItem.data.contentType}</span>
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {detailFields.map((field) => (
              <div key={field.label} className="rounded-lg border p-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{field.label}</div>
                <div className="mt-1 text-sm font-medium break-words">{field.value || "--"}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setActiveItem(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

const MIN_TREE_WIDTH = 480
const MAX_TREE_WIDTH = 840

interface ObjectsContentTabProps {
  details: HookBucketDetails
  folderMap: FolderPathMapProps
}

export function ObjectsContentTab({ details, folderMap }: ObjectsContentTabProps) {
  const [folder, setFolder] = useState<string>("")
  const [treeWidth, setTreeWidth] = useState<number>(420)

  function onMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault()
    if (window.matchMedia("(max-width: 1023px)").matches) return

    const startX = event.clientX
    const startWidth = treeWidth

    function onMouseMove(e: MouseEvent) {
      const newWidth = startWidth + (e.clientX - startX)
      setTreeWidth(Math.max(MIN_TREE_WIDTH, Math.min(newWidth, MAX_TREE_WIDTH)))
    }

    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  return (
    <TooltipProvider>
      <section
        className="flex w-full flex-col lg:grid lg:items-stretch overflow-y-auto no-scrollbar"
        style={{
          gridTemplateColumns: `minmax(${MIN_TREE_WIDTH}px, ${treeWidth}px) 4px minmax(0,1fr)`,
        }}
      >
        <ObjectTree details={details} onSelectFolder={setFolder} selectedFolder={folder} className="h-full" />
        <div
          className="hidden h-19/20 lg:self-center cursor-ew-resize rounded-full bg-border transition-colors duration-150 hover:bg-primary/60 lg:block"
          onMouseDown={onMouseDown}
        />
        <ObjectDetails bucket={details.name} folder={folder} folderMap={folderMap} className="h-full" />
      </section>
    </TooltipProvider>
  )
}

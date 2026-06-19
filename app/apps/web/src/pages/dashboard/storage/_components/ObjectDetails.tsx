import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faEllipsisVertical, faFolder } from "@fortawesome/free-solid-svg-icons"
import type { FormattedFileStructure } from "@packages/types/bucket"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { type FolderPathMapProps, formatBytes, formatDate, iconExtensionMatcher } from "../utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useLocation, useNavigate } from "react-router"

interface ObjectDetailsProps {
  bucket: string
  folder: string
  folderMap: FolderPathMapProps
  onSelectFolder: (path: string) => void
  className?: string
}

export function ObjectDetails({ bucket, folder, folderMap, onSelectFolder, className }: ObjectDetailsProps) {
  const [pageSize, setPageSize] = useState<number>(12)
  const segments = folder.split("/").filter(Boolean)
  const children = folderMap[folder] ?? []
  const activeLabel = folder === "" ? "Root" : folder.replace(/\/$/, "")
  const [page, setPage] = useState<number>(1)
  const [activeItem, setActiveItem] = useState<FormattedFileStructure[number] | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const location = useLocation()
  const navigate = useNavigate()

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
          { label: "Created", value: isFolder ? "--" : formatDate(activeItem.data?.createdAt || "") },
          { label: "Updated", value: isFolder ? "--" : formatDate(activeItem.data?.updatedAt || "") },
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
                    
                    function onObjectOpen() {
                      if (!folderItem) {
                        navigate(`${location.pathname}/object/${(child.relativePath)}`)
                      } else {
                        onSelectFolder(child.path)
                      }
                    }
                    return (
                      <div
                        key={`bucket-row-${child.path}-${idx}`}
                        className={`grid grid-cols-[minmax(18rem,1fr)_9rem_11rem_auto] items-center gap-x-4 rounded-lg border bg-card px-3 py-2 transition-colors ${
                          isSelected ? "bg-muted/40 border-primary/40" : "hover:bg-muted/40"
                        } cursor-pointer`}
                        onDoubleClick={onObjectOpen}
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
                          {folderItem ? "—" : formatDate(child.data?.updatedAt || "")}
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
                              <DropdownMenuItem onClick={onObjectOpen}>Open</DropdownMenuItem>
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
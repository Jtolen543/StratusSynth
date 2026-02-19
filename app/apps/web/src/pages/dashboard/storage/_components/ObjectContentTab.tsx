
import type React from "react"
import { useState } from "react"
import {  TooltipProvider } from "@/components/ui/tooltip"
import { type FolderPathMapProps  } from "../utils"
import type { HookBucketDetails } from "../queries/useGetBucketDetails"
import { ObjectDetails } from "./ObjectDetails"
import { ObjectTree } from "./ObjectTree"

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
        <ObjectDetails bucket={details.name} folder={folder} onSelectFolder={setFolder} folderMap={folderMap} className="h-full" />
      </section>
    </TooltipProvider>
  )
}

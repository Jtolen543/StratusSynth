
import { useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { type FolderPathMapProps } from "../utils"
import type { HookBucketDetails } from "../queries/useGetBucketDetails"
import { ObjectDetails } from "./ObjectDetails"
import { ObjectTree } from "./ObjectTree"

interface ObjectsContentTabProps {
  details: HookBucketDetails
  folderMap: FolderPathMapProps
}

export function ObjectsContentTab({ details, folderMap }: ObjectsContentTabProps) {
  const [folder, setFolder] = useState<string>("")

  return (
    <TooltipProvider>
      <section className="flex w-full flex-col lg:flex-row">
        <ObjectTree details={details} onSelectFolder={setFolder} selectedFolder={folder} className="h-full" />
        <ObjectDetails bucket={details.name} folder={folder} onSelectFolder={setFolder} folderMap={folderMap} className="h-full" />
      </section>
    </TooltipProvider>
  )
}

import { GCSObjectData, GCSObjectMetadata, BucketFileStructure, FormattedFileStructure } from "@packages/types/bucket"

export function buildBucketTree(metadata: GCSObjectMetadata[]) {
  const root: BucketFileStructure = []

  const addNode = (level: BucketFileStructure, path: string, data?: GCSObjectData) => {
    let node = level.find((val) => val.path === path)

    if (!node) {
      node = {
        path,
        data: data ?? {
          kind: "storage#object",
          id: "",
          selfLink: "",
          mediaLink: "",
          bucket: "",
          generation: "",
          metageneration: "",
          contentType: "",
          storageClass: "",
          size: "",
          md5Hash: "",
          crc32c: "",
          etag: "",
          temporaryHold: false,
          eventBasedHold: false,
          timeCreated: "",
          updated: "",
          timeStorageClassUpdated: "",
          timeFinalized: "",
        },
        children: []
      }
      level.push(node)
    } else if (data) node.data = data
    return node
  } 

  for (const obj of metadata) {
    const {name, ...data} = obj
    const segments = name.split("/").filter(Boolean)
    const isFolder = name.endsWith("/")

    let currentLevel = root
    let currentPath = ""

    segments.forEach((segment, idx) => {
      const isLast = idx === segments.length - 1

      currentPath = currentPath ? `${currentPath}/${segment}` : segment
      const fullPath = !isLast ? `${currentPath}/` : isFolder ? `${currentPath}/` : currentPath
      const objectData = isLast ? data : undefined

      const node = addNode(currentLevel, fullPath, objectData)
      currentLevel = node.children
    })
  }
  return root
}

export function formatBucketTree(metadata: BucketFileStructure, ascending: boolean = true): FormattedFileStructure {
    if (metadata.length === 0) return []

    const order = ascending ? 1 : -1
    const root = metadata.sort((a, b) => {
        const aIsFolder = a.path.endsWith("/")
        const bIsFolder = b.path.endsWith("/")

        if (aIsFolder && !bIsFolder) return -1
        else if (!aIsFolder && bIsFolder) return 1
        else {
            return ascending ? a.path.localeCompare(b.path) : b.path.localeCompare(a.path)
        }
    })
    
    const res: FormattedFileStructure = root.map((obj) => ({
        ...obj,
        data: {
            ...obj.data,
            size: Number(obj.data.size),
            generation: Number(obj.data.generation),
            metageneration: Number(obj.data.metageneration)
        },
        children: formatBucketTree(obj.children, ascending)
    }))

    return res
}
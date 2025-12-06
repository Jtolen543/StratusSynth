import { BucketFileStructure, BucketFileStructureData, FormattedFileStructure } from "@packages/types/bucket"

export function formatBucketTree(metadata: BucketFileStructureData, ascending: boolean = true) {
    function formatChildren(children: BucketFileStructure, ascending: boolean): FormattedFileStructure {
        if (children.length === 0) return []

        const root = children.sort((a, b) => {
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
                metageneration: Number(obj.data.metageneration),
            },
            children: formatChildren(obj.children, ascending)
        }))

        return res
    }

    return {
        ...metadata,
        children: formatChildren(metadata.children, ascending)
    }
}
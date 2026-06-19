import { BucketFileStructure, BucketFileStructureData, FormattedFileStructure } from "@packages/types/bucket"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFile, faFileAudio, faFileImage, faFilePdf, faFileVideo, faFileZipper } from "@fortawesome/free-solid-svg-icons"
import { HookBucketDetails } from "./queries/useGetBucketDetails"

export function formatBucketTree(metadata: BucketFileStructureData, ascending: boolean = true) {
    function formatChildren(children: BucketFileStructure, ascending: boolean): FormattedFileStructure {
        if (children.length === 0) return []

        const sorted = children.sort((a, b) => {
            const aIsFolder = a.path.endsWith("/")
            const bIsFolder = b.path.endsWith("/")

            if (aIsFolder && !bIsFolder) return -1
            else if (!aIsFolder && bIsFolder) return 1
            else return ascending ? a.path.localeCompare(b.path) : b.path.localeCompare(a.path)
        })

        return sorted.map((obj) => ({
            ...obj,
            children: formatChildren(obj.children, ascending)
        }))
    }

    return {
        ...metadata,
        children: formatChildren(metadata.children, ascending)
    }
}

export function formatBytes(value?: number): string {
    if (value == null || isNaN(value)) return "--"
    if (value === 0) return "0 B"
    
    const suffixValues = ["B", "KB", "MB", "GB", "TB", "PB", "EB"]
    let idx = 0

    while (value >= 1000 && idx < suffixValues.length - 1) {
        value /= 1000
        idx++
    }

    const formatted = idx === 0 ? value.toFixed(0) : value.toFixed(1)

    return `${formatted.replace(/\.0$/, "")} ${suffixValues[idx]}`
}

export function formatDate(value?: string | Date | null) {
    if (!value) return null

    if (typeof value === "string") {
        value = new Date(value)
    }

    return value.toLocaleString()
}

const DEVICON_BY_EXT: Record<string, string> = {
    ts: "devicon-typescript-plain colored text-lg",
    js: "devicon-javascript-plain colored text-lg",
    tsx: "devicon-react-original colored text-lg",
    jsx: "devicon-react-original colored text-lg",
    html: "devicon-html5-plain colored text-lg",
    htm: "devicon-html5-plain colored text-lg",
    css: "devicon-css3-plain colored text-lg",

    scss: "devicon-sass-original colored text-lg",
    sass: "devicon-sass-original colored text-lg",
    less: "devicon-less-plain colored text-lg",
    vue: "devicon-vuejs-plain colored text-lg",
    astro: "devicon-astro-plain colored text-lg",
    pug: "devicon-pug-plain colored text-lg",

    md: "devicon-markdown-plain colored text-lg",
    markdown: "devicon-markdown-plain colored text-lg",
    tex: "devicon-latex-plain colored text-lg",

    c: "devicon-c-plain colored text-lg",
    h: "devicon-c-plain colored text-lg",
    cpp: "devicon-cplusplus-plain colored text-lg",
    cc: "devicon-cplusplus-plain colored text-lg",
    cxx: "devicon-cplusplus-plain colored text-lg",
    hpp: "devicon-cplusplus-plain colored text-lg",
    hh: "devicon-cplusplus-plain colored text-lg",
    hxx: "devicon-cplusplus-plain colored text-lg",
    cs: "devicon-csharp-plain colored text-lg",
    java: "devicon-java-plain colored text-lg",
    kt: "devicon-kotlin-plain colored text-lg",
    kts: "devicon-kotlin-plain colored text-lg",
    swift: "devicon-swift-plain colored text-lg",
    go: "devicon-go-plain colored text-lg",
    rs: "devicon-rust-plain colored text-lg",
    dart: "devicon-dart-plain colored text-lg",
    py: "devicon-python-plain colored text-lg",
    rb: "devicon-ruby-plain colored text-lg",
    php: "devicon-php-plain colored text-lg",
    scala: "devicon-scala-plain colored text-lg",
    hs: "devicon-haskell-plain colored text-lg",
    ex: "devicon-elixir-plain colored text-lg",
    exs: "devicon-elixir-plain colored text-lg",
    erl: "devicon-erlang-plain colored text-lg",
    lua: "devicon-lua-plain colored text-lg",
    nim: "devicon-nim-plain colored text-lg",
    ml: "devicon-ocaml-plain colored text-lg",
    mli: "devicon-ocaml-plain colored text-lg",
    f: "devicon-fortran-plain colored text-lg",
    for: "devicon-fortran-plain colored text-lg",
    f90: "devicon-fortran-plain colored text-lg",
    clj: "devicon-clojure-plain colored text-lg",
    cljs: "devicon-clojure-plain colored text-lg",
    cljc: "devicon-clojure-plain colored text-lg",
    edn: "devicon-clojure-plain colored text-lg",
    pl: "devicon-perl-plain colored text-lg",
    pm: "devicon-perl-plain colored text-lg",
    groovy: "devicon-groovy-plain colored text-lg",
    jl: "devicon-julia-plain colored text-lg",
    prolog: "devicon-prolog-plain colored text-lg",

    sh: "devicon-bash-plain colored text-lg",
    bash: "devicon-bash-plain colored text-lg",
    zsh: "devicon-bash-plain colored text-lg",
    ps1: "devicon-powershell-plain colored text-lg",

    sql: "devicon-mysql-plain colored text-lg",
    graphql: "devicon-graphql-plain colored text-lg",

    ipynb: "devicon-jupyter-plain colored text-lg",

    cmake: "devicon-cmake-plain colored text-lg",
    gradle: "devicon-gradle-plain colored text-lg",
    bazel: "devicon-bazel-plain colored text-lg",
    yml: "devicon-githubactions-plain colored text-lg",
    yaml: "devicon-githubactions-plain colored text-lg",

    mongo: "devicon-mongodb-plain colored text-lg",
    mongodb: "devicon-mongodb-plain colored text-lg",
    psq: "devicon-postgresql-plain colored text-lg",
    psql: "devicon-postgresql-plain colored text-lg",

    fig: "devicon-figma-plain colored text-lg", 
    psd: "devicon-photoshop-plain colored text-lg",
    ai: "devicon-illustrator-plain colored text-lg",
    ae: "devicon-aftereffects-plain colored text-lg",

    coffee: "devicon-coffeescript-original colored text-lg",
    cson: "devicon-coffeescript-original colored text-lg",
    json: "devicon-json-plain colored text-lg"
};

export function iconExtensionMatcher(path: string) {
    const lower = path.toLowerCase();
    const ext = lower.split("/").pop()?.split(".").pop();

    if (lower.endsWith("dockerfile")) {
        return <i className="devicon-docker-plain colored text-lg" />;
    }

    if (lower.includes("git")) return <i className="devicon-git-plain colored text-lg" />

    if (!ext || ext === lower) {
        return <FontAwesomeIcon icon={faFile} size="lg" />;
    }

    if (["png", "jpg", "jpeg", "gif", "svg", "webp", "bmp", "tiff"].includes(ext)) {
        return <FontAwesomeIcon icon={faFileImage} size="lg" />;
    }

    if (ext === "pdf") return <FontAwesomeIcon icon={faFilePdf} size="lg" />;

    if (["zip", "rar", "gz", "tgz", "bz2", "7z", "tar"].includes(ext)) {
        return <FontAwesomeIcon icon={faFileZipper} size="lg" />;
    }

    if (["mp3", "wav", "flac", "ogg", "m4a", "aac"].includes(ext)) {
        return <FontAwesomeIcon icon={faFileAudio} size="lg" />;
    }

    if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) {
        return <FontAwesomeIcon icon={faFileVideo} size="lg" />;
    }

    const deviconClass = DEVICON_BY_EXT[ext];
    if (deviconClass) {
        return <i className={deviconClass} />;
    }

    return <FontAwesomeIcon icon={faFile} size="lg" />;
}

export function getFolderPathMap(details: HookBucketDetails) {
    const fileMap: {[key: string]: HookBucketDetails["children"]} = {}

    fileMap[""] = details.children

    function setPaths(children: FormattedFileStructure) {
        if (children.length === 0) return

        children.forEach((child) => {
            if (!child.path.endsWith("/")) return

            fileMap[child.path] = child.children
            setPaths(child.children)
        })
    }

    setPaths(details.children)
    return fileMap
}

export type FolderPathMapProps = ReturnType<typeof getFolderPathMap>
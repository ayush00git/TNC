export interface ProjectData {
    name: string,
    about: string,
    thumbnail: string,
    video: string,
    date: string,
    status: "completed" | "ongoing",
    features: string[],
    githubRepo?: string,
    sitelink?: string,
}

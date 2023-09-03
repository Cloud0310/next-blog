import * as fs from "fs"
import { marked } from "marked"
import * as matter from "gray-matter"

export async function generateStaticParams() {
    return await fs.promises.readdir("sources/posts")
        .then(files => files.map(file => matter.read(`sources/posts/${file}`)))
        .then(matters => {
            return matters.map(matter => {
                const date = matter.data.date || "0/0"
                const split = date.split("/")
                const year = split[0]
                const month = split[1]
                return {
                    slug: [year, month, matter.data.title]
                }
            })
        })
}

export default function Page({ params }: { params: { slug: string[] } }) {
    const title = params.slug[2]
    const matterData = matter.read(`sources/posts/${title}.md`)
    const htmlRendered = marked(matterData.content)
    return <div>${htmlRendered}</div>
}

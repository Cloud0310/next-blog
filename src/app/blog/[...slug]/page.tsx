import * as fs from "fs"
import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"
import markedKatex from "marked-katex-extension"
import hljs from 'highlight.js'
import * as matter from "gray-matter"
import parse from "html-react-parser"

const markdownRenderer = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    }),
    markedKatex({
        throwOnError: false
    })
);

export async function generateStaticParams() {
    if (!fs.existsSync("sources/posts"))
        return []
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
    const matterData = matter.read(`sources/posts/${decodeURIComponent(title)}.md`)
    const htmlRendered = markdownRenderer.parse(
        matterData.content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")) as string
    return (
            <div className="markdown-content">
                <link rel="stylesheet"
                      href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
                      integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
                      crossOrigin="anonymous"
                />
                <link rel="stylesheet"
                      href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.8.0/build/styles/default.min.css"
                />
                {parse(htmlRendered)}
            </div>
    )
}

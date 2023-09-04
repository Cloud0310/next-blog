import * as fs from 'fs'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import markedKatex from 'marked-katex-extension'
import Prism from 'prismjs'
import * as matter from 'gray-matter'
import parse from 'html-react-parser'

const markdownRenderer = new Marked(
    markedHighlight({
        langPrefix: 'prism language-',
        highlight(code, lang) {
            lang = lang.toLowerCase() || 'plaintext'
            if (!Prism.languages[lang]) {
                require(`prismjs/components/prism-${lang}.js`)
                if (!Prism.languages[lang])
                    lang = 'plaintext'
            }
            return Prism.highlight(code, Prism.languages[lang], lang);
        }
    }),
    markedKatex({
        throwOnError: false
    })
);

export async function generateStaticParams() {
    if (!fs.existsSync('sources/posts'))
        return []
    return await fs.promises.readdir('sources/posts')
        .then(files => files.map(file => matter.read(`sources/posts/${file}`)))
        .then(matters => {
            return matters.map(matter => {
                const date = matter.data.date || '0/0'
                const split = date.split('/')
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
                {parse(htmlRendered)}
            </div>
    )
}

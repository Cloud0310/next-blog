import * as fs from 'fs'
import { Marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import Prism from 'prismjs'
import matter from 'gray-matter'
import parse from 'html-react-parser'
import { slug } from "github-slugger";
import DOMPurity from 'isomorphic-dompurify'

// Marked Highlight, modified from marked-highlight --------------------------------------------------------------------
// From marked helpers
const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, 'g');
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');

function getEscapeReplacement(ch: string) {
    if (ch === '&')
        return '&amp;';
    else if (ch === '<')
        return '&lt;';
    else if (ch === '>')
        return '&gt;';
    else if (ch === '"')
        return '&quot;';
    else if (ch === "'")
        return '&#39;';
    return ch;
}

function escape(html: string, encode: boolean) {
    if (encode)
        if (escapeTest.test(html))
            return html.replace(escapeReplace, getEscapeReplacement);
    else
        if (escapeTestNoEncode.test(html))
            return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    return html;
}

const markdownRenderer = new Marked(
    markedKatex({
        throwOnError: false
    }),
    {
        walkTokens(token) {
            if (token.type !== 'code')
                return;
            if (!token.lang)
                return;
            let lang = (token.lang || 'plaintext').match(/\S*/)[0].toLowerCase();
            if (!Prism.languages[lang]) {
                require(`prismjs/components/prism-${lang}.js`);
                if (!Prism.languages[lang])
                    lang = 'plaintext';
            }
            const code = Prism.highlight(token.text, Prism.languages[lang], lang);
            if (code !== token.text) {
                token.escaped = true;
                token.text = code;
            }
        },
        renderer: {
            code(code, infoString, escaped) {
                if (!infoString)
                    return `<pre>${code}</pre>`
                // @ts-ignore
                const lang = infoString.match(/\S*/)[0].toLowerCase();
                const classAttr = ` class="prism language-${escape(lang, false)}"`;
                code = code.replace(/\n$/, '');
                return `
                    <div class="code-container">
                        <span class="lang-text">${escape(lang, false)}</span>
                        <pre><code${classAttr}>${escaped ? code : escape(code, true)}\n</code></pre>
                    </div>
                `;
            },
            heading(text, level, raw) {
                const linkHref = slug(text);
                return `
                    <h${level}>
                        <a id="${linkHref}" href="#${linkHref}" class="heading-link">
                            #
                        </a>
                        ${text}
                    </h${level}>
                `;
            },
            link(href, title, text) {
                return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
            }
        },
        hooks: {
            preprocess(markdown) {
                const matterData = matter(markdown);
                return matterData.content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,'');
            },
            postprocess(html) {
                return DOMPurity.sanitize(html);
            }
        }
    }
);
// ---------------------------------------------------------------------------------------------------------------------

export async function generateStaticParams() {
    if (!fs.existsSync('sources/posts'))
        return [];
    return await fs.promises.readdir('sources/posts')
        .then(files => files.map(file => [file, fs.readFileSync(`sources/posts/${file}`, 'utf-8')]))
        .then(files => files.map(file => [file[0], matter(file[1])]))
        .then(matters => {
            return matters.map(matter => {
                const date = (matter[1] as matter.GrayMatterFile<string>).data.date || '0/0'
                const split = date.split('/')
                const year = split[0]
                const month = split[1]
                return {
                    slug: [year, month, matter[0]]
                }
            })
        });
}

export default function Page({ params }: { params: { slug: string[] } }) {
    const title = params.slug[2];
    if (!fs.existsSync(`sources/posts/${decodeURIComponent(title)}.md`))
        return <div>What? The page has lost in this world line!</div>;
    const markdown = fs.readFileSync(`sources/posts/${decodeURIComponent(title)}.md`, 'utf-8');
    const htmlRendered = markdownRenderer.parse(markdown) as string;
    return (
            <div className="markdown-content">
                <link rel="stylesheet"
                      href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
                      integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
                      crossOrigin="anonymous"
                />
                {parse(htmlRendered)}
            </div>
    );
}

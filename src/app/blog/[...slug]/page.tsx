import * as fs from "fs";
import { Marked } from "marked";
import markedKatex from "marked-katex-extension";
import Prism from "prismjs";
import matter from "gray-matter";
import parse from "html-react-parser";
import { slug } from "github-slugger";
import DOMPurity from "isomorphic-dompurify";
//@ts-ignore
import { encodeHTML } from "entities";

// Marked Highlight, modified from marked-highlight --------------------------------------------------------------------
// From marked helpers
const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, "g");
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g");

function getEscapeReplacement(ch: string) {
  if (ch === "&") return "&amp;";
  else if (ch === "<") return "&lt;";
  else if (ch === ">") return "&gt;";
  else if (ch === '"') return "&quot;";
  else if (ch === "'") return "&#39;";
  return ch;
}

function escape(html: string, encode: boolean) {
  if (encode)
    if (escapeTest.test(html))
      return html.replace(escapeReplace, getEscapeReplacement);
    else if (escapeTestNoEncode.test(html))
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
  return html;
}

const markdownRenderer = new Marked(
  markedKatex({
    throwOnError: false,
  }),
  {
    renderer: {
      code(code, language, escaped) {
        if (!language) return `<pre>${code}</pre>`;
        // @ts-ignore
        let lang = language.match(/\S*/)[0].toLowerCase();
        if (!Prism.languages[lang]) {
          require(`prismjs/components/prism-${lang}.js`);
          if (!Prism.languages[lang]) lang = "plaintext";
        }
        const rendered = Prism.highlight(code, Prism.languages[lang], lang);
        const classAttr = ` class="prism language-${escape(lang, false)}"`;
        console.log(encodeHTML(code));
        return `
                    <div class="code-container">
                        <span class="lang-text">${escape(lang, false)}</span>
                        <button class="copy-content" value="${encodeHTML(
                          code,
                        )}">
                            <span>content_paste</span>
                        </button>
                        <pre><code${classAttr}>${rendered}</code></pre>
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
                        ${escape(text, false)}
                    </h${level}>
                `;
      },
      link(href, title, text) {
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      },
    },
    hooks: {
      preprocess(markdown) {
        const matterData = matter(markdown);
        return matterData.content.replace(
          /^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,
          "",
        );
      },
      postprocess(html) {
        return DOMPurity.sanitize(html, {
          ADD_ATTR: ["value"]
        });
      },
    },
  },
);

// ---------------------------------------------------------------------------------------------------------------------

export async function generateStaticParams() {
  if (!fs.existsSync("sources/posts")) return [];
  return await fs.promises
    .readdir("sources/posts")
    .then((files) =>
      files.map((file) => [
        file,
        fs.readFileSync(`sources/posts/${file}`, "utf-8"),
      ]),
    )
    .then((files) => files.map((file) => [file[0], matter(file[1])]))
    .then((matters) => {
      return matters.map((matter) => {
        const date =
          (matter[1] as matter.GrayMatterFile<string>).data.date || "0/0";
        const split = date.split("/");
        const year = split[0];
        const month = split[1];
        return {
          slug: [year, month, matter[0]],
        };
      });
    });
}

export default function Page({ params }: { params: { slug: string[] } }) {
  const title = params.slug[2];
  if (!fs.existsSync(`sources/posts/${decodeURIComponent(title)}.md`))
    return <div>What? The page has lost in this world line!</div>;
  const markdown = fs.readFileSync(
    `sources/posts/${decodeURIComponent(title)}.md`,
    "utf-8",
  );
  const htmlRendered = markdownRenderer.parse(markdown) as string;
  return (
    <div className="markdown-content">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
        integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
        crossOrigin="anonymous"
      />
      {parse(htmlRendered)}
    </div>
  );
}

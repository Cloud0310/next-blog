import * as fs from "fs";
import { marked, Marked, Tokens } from "marked";
import markedKatex from "marked-katex-extension";
import Prism from "prismjs";
import matter from "gray-matter";
import parse from "html-react-parser";
import { slug } from "github-slugger";
import DOMPurity from "isomorphic-dompurify";
//@ts-ignore
import { encodeHTML } from "entities";
//@ts-ignore
import MarkedOptions = marked.MarkedOptions;

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
  if (encode) {
    if (escapeTest.test(html)) return html.replace(escapeReplace, getEscapeReplacement);
    else if (escapeTestNoEncode.test(html)) return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
  }
  return html;
}

function loadLanguage(lang: string) {
  lang = lang.toLowerCase();
  console.log(lang);
  if (!Prism.languages[lang]) {
    require(`prismjs/components/prism-${lang}.js`);
    if (!Prism.languages[lang]) lang = "plaintext";
  }
  return lang;
}

function makeCodeBlock(code: string, lang: string, flags: string[]) {
  const rendered = Prism.highlight(code, Prism.languages[lang], lang);
  const classAttr = ` class="prism language-${escape(lang, false)}"`;
  const buttonCopy = `
                    <button class="copy-content" value="${encodeHTML(code)}">
                        <span>content_paste</span>
                    </button>`;
  const langText = flags.includes("no-copy")
    ? `<span class="lang-text-static">${escape(lang, false)}</span>`
    : `<span class="lang-text">${escape(lang, false)}</span>`;
  return `
                    <div class="code-container">
                        ${langText}
                        ${flags.includes("no-copy") ? "" : buttonCopy}
                        <pre><code${classAttr}>${rendered}</code></pre>
                    </div>
                `;
}

const markedRenderer = {
  code(code: string, language: string | undefined, escaped: boolean) {
    if (!language) return `<pre>${code}</pre>`;
    const langData = language.split(" ");
    let lang = loadLanguage(langData[0]);
    const flags = langData.slice(1);
    return makeCodeBlock(code, lang, flags);
  },
  heading(text: string, level: number, raw: string) {
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
  link(href: string, title: string | null | undefined, text: string) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  },
  listitem(text: string, task: boolean, checked: boolean) {
    return `<li${task ? ' class="task-list-item"' : ""}>${text}</li>`;
  }
};

const markedHooks = {
  options: MarkedOptions,
  preprocess(markdown: string) {
    const matterData = matter(markdown);
    for (const key in matterData.data) this.options[key] = matterData.data[key];
    return matterData.content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");
  },
  postprocess(html: string) {
    const options = this.options;
    if (options["title"]) {
      html = `<h1 class="title-text">${options["title"]}</h1>
                <div class="post-date">${options["date"]}</div>
                    ${html}
                `;
    }
    return DOMPurity.sanitize(html, {
      ADD_ATTR: ["value"]
    });
  }
};

function blockContainerCodeGroup(content: string[]) {
  let inCodeBlock = false;
  const codeBlocks = [];
  let currentCodeBlock = [] as string[];
  for (let i = 0; i < content.length; i++) {
    const line = content[i];
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        codeBlocks[codeBlocks.length - 1].content = currentCodeBlock.join("\n");
        currentCodeBlock = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        const lineSplit = line.substring(3).split(" ");
        let language = "plaintext";
        let fileName = "Unnamed File";
        const flags = [];
        if (lineSplit) {
          language = lineSplit[0];
          for (let j = 1; j < lineSplit.length; j++) {
            const part = lineSplit[j];
            if (part.startsWith("[") && part.endsWith("]")) fileName = part.substring(1, part.length - 1);
            else flags.push(part);
          }
        }
        codeBlocks.push({
          lang: language,
          fileName: fileName,
          content: "",
          flags: flags
        });
      }
    } else if (inCodeBlock) currentCodeBlock.push(line);
  }
  const codeBlocksRendered = codeBlocks.map(block => {
    const lang = loadLanguage(block.lang);
    const rendered = makeCodeBlock(block.content, lang, block.flags);
    return {
      fileName: block.fileName,
      rendered: rendered
    };
  });
  const tabs = [];
  const blocks = [];
  const renderUniqueString = Math.random().toString(36).substring(4);
  for (let i = 0; i < codeBlocksRendered.length; i++) {
    const block = codeBlocksRendered[i];
    const tab =
      i == 0
        ? `<span class="code-group-tab code-tab-active" id="code-tab-${renderUniqueString}-${i}">${block.fileName}</span>`
        : `<span class="code-group-tab" id="code-tab-${renderUniqueString}-${i}">${block.fileName}</span>`;
    const blockRendered =
      i == 0
        ? `<div class="code-group-block code-block-active" id="code-block-${renderUniqueString}-${i}">${block.rendered}</div>`
        : `<div class="code-group-block" id="code-block-${renderUniqueString}-${i}">${block.rendered}</div>`;
    tabs.push(tab);
    blocks.push(blockRendered);
  }
  return `
    <div class="block-code-group">
      <div class="code-group-tabs" id="code-group-tabs-${renderUniqueString}">${tabs.join("\n")}</div>
      <div class="code-group-blocks" id="code-group-blocks-${renderUniqueString}">${blocks.join("\n")}</div>
    </div>
  `;
}

function blockContainerPlain(headerSplit: string[], content: string) {
  const title = headerSplit.length === 1 ? headerSplit[0].toUpperCase() : headerSplit.slice(1).join(" ");
  return `
    <div class="block-container-${headerSplit[0].toLowerCase()}">
      <p class="block-container-title">${title}</p>
      ${markdownRendererWithoutContainer.parse(content)}
    </div>
  `;
}

const blockContainerExtension = {
  name: "blockContainer",
  level: "block",
  start(src: string) {
    return src.indexOf("\n:::");
  },
  tokenizer(src: string, tokens: any) {
    const match = src.match(/^:::[\s\S]+?\n:::/);
    if (match) {
      const data = match[0].slice(4, -4).trim();
      const dataSplit = data.split("\n");
      return {
        type: "blockContainer",
        raw: match[0],
        text: dataSplit
      };
    }
  },
  renderer(token: Tokens.Generic) {
    const header = token.text[0];
    const headerSplit = header.split(" ");
    const content = token.text.slice(1);
    if (headerSplit[0] === "code-group") return blockContainerCodeGroup(content);
    else return blockContainerPlain(headerSplit, content.join("\n"));
  }
};

const markdownRendererWithoutContainer = new Marked(
  markedKatex({
    throwOnError: false
  }),
  {
    renderer: markedRenderer,
    hooks: markedHooks
  }
);

const markdownRenderer = new Marked(
  markedKatex({
    throwOnError: false
  }),
  {
    extensions: [blockContainerExtension],
    renderer: markedRenderer,
    hooks: markedHooks
  }
);

// ---------------------------------------------------------------------------------------------------------------------

export async function generateStaticParams() {
  if (!fs.existsSync("sources/posts")) return [];
  return await fs.promises
    .readdir("sources/posts")
    .then(files => files.map(file => [file, fs.readFileSync(`sources/posts/${file}`, "utf-8")]))
    .then(files => files.map(file => [file[0], matter(file[1])]))
    .then(matters => {
      return matters.map(matter => {
        const date = (matter[1] as matter.GrayMatterFile<string>).data.date || "0/0";
        const split = date.split("/");
        const year = split[0];
        const month = split[1];
        const fileName = matter[0] as string;
        return {
          slug: [year, month, fileName.substring(0, fileName.lastIndexOf("."))]
        };
      });
    });
}

export default function Page({ params }: { params: { slug: string[] } }) {
  const title = params.slug[2];
  if (!fs.existsSync(`sources/posts/${decodeURIComponent(title)}.md`))
    return <div>What? The page has lost in this world line!</div>;
  const markdown = fs.readFileSync(`sources/posts/${decodeURIComponent(title)}.md`, "utf-8");
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

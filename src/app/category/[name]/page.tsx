import fs from "fs";
import matter from "gray-matter";

export async function generateStaticParams() {
  if (!fs.existsSync("sources/posts")) return [{ name: "nocat" }];
  return await fs.promises
    .readdir("sources/posts")
    .then(files => files.map(file => fs.readFileSync(`sources/posts/${file}`, "utf-8")))
    .then(files => files.map(file => matter(file)))
    .then(matters => matters.map(matter => matter.data["category"] as string))
    .then(categories => categories.filter((val, index) => categories.indexOf(val) == index))
    .then(categories => categories.map(category => ({ name: category })));
}

export default function Page({ params }: { params: { name: string } }) {
  const pages = fs
    .readdirSync("sources/posts")
    .map(file => [file, fs.readFileSync(`sources/posts/${file}`, "utf-8")])
    .map(file => [file[0], matter(file[1])])
    .filter(matter => (matter[1] as matter.GrayMatterFile<string>).data["category"] == params.name);
  return (
    <div className="category-content">
      <h1>{params.name}</h1>
      <p className="page-attribute">Categories Page</p>
      {pages.map(page => {
        let title = page[0] as string;
        title = title.substring(0, title.lastIndexOf("."));
        const data = (page[1] as matter.GrayMatterFile<string>).data;
        const date = data["date"] || "0/0";
        const split = date.split("/");
        const year = split[0];
        const month = split[1];
        return (
          <div key={title}>
            <p>
              <a href={`/blog/${year}/${month}/${encodeURIComponent(title)}`}>{title}</a>
            </p>
          </div>
        );
      })}
    </div>
  );
}
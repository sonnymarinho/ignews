import { RichText } from "prismic-dom";
import { Post } from "../../types/Post";
interface FormatPostProps {
  preview?: boolean;
  post: any;
}

function getContentAsHTMLpreview(content: string, preview: boolean) {
  return preview ? "" : RichText.asHtml(content);
}

export function formatPost({ preview = true, post }: FormatPostProps): Post {
  return {
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt:
      post.data.content.find((content) => content.type === "paragraph")?.text ??
      "",
    content: getContentAsHTMLpreview(post.data.content, preview),
    updatedAt: new Date(post.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };
}

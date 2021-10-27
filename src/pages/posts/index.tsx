import Link from "next/link";
import Prismic from "@prismicio/client";
import { GetStaticProps } from "next";
import Head from "next/head";
import React from "react";
import { getPrismicClient } from "../../services/prismic";
import { formatPost } from "../_utils/posts";
import styles from "./styles.module.scss";
import { ROUTES } from "../../config/routes";
import { Post as PostData } from "../../types/Post";

type PostType = Omit<PostData, "content">;
interface PostsProps {
  posts: Array<PostType>;
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | igNews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.postList}>
          {posts.map((post) => (
            <Post post={post} />
          ))}
        </div>
      </main>
    </>
  );
}

interface PostProps {
  post: PostType;
}

function Post({ post }: PostProps) {
  return (
    <Link href={`/${ROUTES.POSTS}/${post.slug}`}>
      <a href="#" key={post.slug}>
        <time>{post.updatedAt}</time>
        <strong>{post.title}</strong>
        <p>{post.excerpt}</p>
      </a>
    </Link>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const { results } = await prismic.query(
    [Prismic.Predicates.at("document.type", "publication")],
    {
      fetch: ["publication.title", "publication.content"],
      pageSize: 100,
    }
  );

  const posts = results.map((post) => formatPost({ post }));

  return {
    props: { posts },
  };
};

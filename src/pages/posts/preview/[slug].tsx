import { GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "../../../services/prismic";
import { Post } from "../../../types/Post";
import { formatPost } from "../../_utils/posts";
import styles from "../post.module.scss";
import Link from "next/link";
import { useSession } from "next-auth/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PostPreviewProps {
  post: Omit<Post, "excerpt">;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>

      <main className={styles.postContainer}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a href="">Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const post = await prismic.getByUID("publication", String(slug), {});

  const formattedPost = formatPost({ preview: true, post });

  return {
    props: {
      post: formattedPost,
    },
    redirect: 60 * 30, // 30 minutes
  };
};

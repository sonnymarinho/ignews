import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import { Post } from "../../types/Post";
import { formatPost } from "../../_utils/posts";
import styles from "./post.module.scss";

interface PostProps {
  post: Omit<Post, "excerpt">;
}

export default function Page({ post }: PostProps) {
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
            className={styles.postContent}
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          ></div>
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });

  if (!session.activeSubscription) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { slug } = params;

  const prismic = getPrismicClient(req);

  const post = await prismic.getByUID("publication", String(slug), {});

  const formattedPost = formatPost({ preview: false, post });

  return {
    props: {
      post: formattedPost,
    },
  };
};

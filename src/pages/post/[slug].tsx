import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { Fragment } from "react";
import { FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { getPrismicClient } from "../../services/prismic";
import commonStyles from "../../styles/common.module.scss";
import styles from "../../styles/Post.module.scss";
import { formatUpdateAt } from "../../utils/formatUpdatedAt";

interface Content {
  heading: string;
  body: string;
}

interface PostData {
  title: string;
  banner: {
    url: string;
    alt: string;
  };
  author: string;
  content: Content[];
}

interface Post {
  updatedAtDateTime: string;
  updatedAtFormatted: string;
  readTime: string;
  data: PostData;
}

interface PostProps {
  post?: Post;
}

type PostParams = {
  slug: string;
};

export const getStaticPaths: GetStaticPaths<PostParams> = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType("post");

  return {
    fallback: true,
    paths: postsResponse.results.map(post => ({
      params: {
        slug: post.uid!,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<PostProps, PostParams> = async ({
  params,
}) => {
  const prismic = getPrismicClient({});
  const { slug } = params!;
  const response = await prismic.getByUID("post", slug);

  const updatedAt = new Date(response.first_publication_date);

  const allContentText = (response.data.content as any[]).reduce<string>(
    (text, content: any) => {
      return `${text} ${content.heading} ${RichText.asText(content.body)}`;
    },
    "",
  );

  const words = allContentText.split(/\s+/g).filter(Boolean);

  return {
    revalidate: 60 * 60 * 24, // 24 hours
    props: {
      post: {
        updatedAtDateTime: updatedAt.toLocaleString(),
        updatedAtFormatted: formatUpdateAt(updatedAt),
        readTime: `${Math.ceil(words.length / 200)} min`,
        data: {
          title: response.data.title,
          author: response.data.author,
          banner: {
            alt: response.data.banner.alt,
            url: response.data.banner.url,
          },
          content: response.data.content.map(
            (content: any): Content => ({
              heading: content.heading,
              body: RichText.asHtml(content.body),
            }),
          ),
        },
      },
    },
  };
};

const Post: NextPage<PostProps> = ({ post }) => (
  <Fragment>
    <Head>
      <title>{`${post?.data.title || "Post"} | spacetraveling`}</title>
    </Head>
    {post ? (
      <Fragment>
        <div className={styles.banner}>
          <img src={post.data.banner.url} alt={post.data.banner.alt} />
        </div>

        <article className={styles.article}>
          <h1>{post.data.title}</h1>

          <div className={commonStyles.postInfo}>
            <div>
              <FiCalendar />
              <time dateTime={post.updatedAtDateTime}>
                {post.updatedAtFormatted}
              </time>
            </div>

            <div>
              <FiUser />
              <span>{post.data.author}</span>
            </div>

            <div>
              <FiClock />

              {post.readTime}
            </div>
          </div>

          <div className={styles.content}>
            {post.data.content.map(content => (
              <div key={content.heading}>
                <h2>{content.heading}</h2>
                <div dangerouslySetInnerHTML={{ __html: content.body }} />
              </div>
            ))}
          </div>
        </article>
      </Fragment>
    ) : (
      <div className={styles.loading}>Carregando...</div>
    )}
  </Fragment>
);

export default Post;

import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { Fragment } from "react";
import { FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { getPrismicClient } from "../../services/prismic";
import commonStyles from "../../styles/common.module.scss";
import styles from "../../styles/Post.module.scss";
import { formatFirstPublicationDate } from "../../utils/formatFirstPublicationDate";
import { getMinutesToRead } from "../../utils/getMinutesToRead";

interface Post {
  uid: string;
  first_publication_date: string;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
      alt: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
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

  return {
    revalidate: 60 * 60 * 24, // 24 hours
    props: {
      post: {
        uid: response.uid!,
        first_publication_date: response.first_publication_date,
        data: {
          title: response.data.title,
          subtitle: response.data.subtitle,
          author: response.data.author,
          banner: {
            alt: response.data.banner.alt,
            url: response.data.banner.url,
          },
          content: response.data.content.map((content: any) => ({
            heading: content.heading,
            body: content.body,
          })),
        },
      },
    },
  };
};

const Post: NextPage<PostProps> = ({ post }) => {
  const { isFallback } = useRouter();

  return (
    <Fragment>
      <Head>
        <title>{`${post?.data.title || "Post"} | spacetraveling`}</title>
      </Head>

      {isFallback ? (
        <div className={styles.loading}>Carregando...</div>
      ) : (
        <Fragment>
          <div className={styles.banner}>
            <img src={post.data.banner.url} alt={post.data.banner.alt} />
          </div>

          <article className={styles.article}>
            <h1>{post.data.title}</h1>

            <div className={commonStyles.postInfo}>
              <div>
                <FiCalendar />
                <time dateTime={post.first_publication_date}>
                  {formatFirstPublicationDate(
                    new Date(post.first_publication_date),
                  )}
                </time>
              </div>

              <div>
                <FiUser />
                <span>{post.data.author}</span>
              </div>

              <div>
                <FiClock />
                {getMinutesToRead(post.data.content)}
              </div>
            </div>

            <div className={styles.content}>
              {post.data.content.map(content => (
                <div key={content.heading}>
                  <h2>{content.heading}</h2>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(content.body),
                    }}
                  />
                </div>
              ))}
            </div>
          </article>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Post;

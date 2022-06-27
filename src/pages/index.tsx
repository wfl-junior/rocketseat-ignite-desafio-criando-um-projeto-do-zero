import { PrismicDocument } from "@prismicio/types";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Fragment, useState } from "react";
import { FiCalendar, FiUser } from "react-icons/fi";
import { getPrismicClient } from "../services/prismic";
import commonStyles from "../styles/common.module.scss";
import styles from "../styles/Home.module.scss";
import { fetchWrapper } from "../utils/fetchWrapper";
import { formatUpdateAt } from "../utils/formatUpdatedAt";

type PostData = {
  title: string;
  subtitle: string;
  author: string;
};

interface Post {
  slug: string;
  updatedAtDateTime: string;
  updatedAtFormatted: string;
  data: PostData;
}

interface PostPagination {
  next_page: string | null;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

function formatPostResults(
  results: PrismicDocument<PostData, string, string>[],
): Post[] {
  return results.map((post): Post => {
    const updatedAt = new Date(post.first_publication_date);

    return {
      slug: post.uid!,
      updatedAtDateTime: updatedAt.toLocaleString(),
      updatedAtFormatted: formatUpdateAt(updatedAt),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType("post", { pageSize: 1 });

  return {
    revalidate: 60 * 60 * 24, // 24 hours
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: formatPostResults(postsResponse.results as any),
      },
    },
  };
};

const Home: NextPage<HomeProps> = ({ postsPagination }) => {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  return (
    <Fragment>
      <Head>
        <title>Posts | spacetraveling</title>
      </Head>

      <div className={styles.posts}>
        {posts.map(post => (
          <Link key={post.slug} href={`/post/${post.slug}`}>
            <a>
              <h2>{post.data.title}</h2>
              <p>{post.data.subtitle}</p>

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
              </div>
            </a>
          </Link>
        ))}

        {nextPage !== null && (
          <button
            onClick={async () => {
              const data = await fetchWrapper<{
                next_page: typeof nextPage;
                results: PrismicDocument<PostData, string, string>[];
              }>(nextPage);

              setNextPage(data.next_page);
              setPosts(posts => posts.concat(formatPostResults(data.results)));
            }}
          >
            Carregar mais posts
          </button>
        )}
      </div>
    </Fragment>
  );
};

export default Home;

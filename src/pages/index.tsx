import { GetStaticProps } from 'next';
import Head from 'next/head';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ posts }: Post) {
  return (
    <>
      <Head>
        <title>Home | News.JS</title>
      </Head>
    </>
  );
}

// export const getStaticProps: GetStaticProps = async () => {
//   const prismic = getPrismicClient();

//   const postsResponse = await prismic.query(
//     [Prismic.predicates.at('document.type', 'post')],
//     {
//       fetch: ['post.title', 'post.content'],
//       fetchLinks: ['author.name'],
//       pageSize: 20,
//     }
//   );

//   const posts = postsResponse.results.map(post => {
//     return {
//       slug: post.uid,
//       // title: post.data.title,
//       updateAt: new Date(post.first_publication_date).toLocaleString('pt-BR', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//       }),
//       data: {
//         title: post.data.title,
//         subtitle: post.data.subtitle,
//         author: post.data.author,
//       },
//     };
//   });
//   // console.log(postsResponse);
//   console.log(posts);
//   return {
//     props: { posts },
//   };
// };
export const getStaticProps: GetStaticProps = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query('', {
    pageSize: 2,
    ref: previewData?.ref ?? null,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  console.log(JSON.stringify(postsResponse));

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
      preview,
    },
  };
};

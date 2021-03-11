import { useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getAllTaskIds, getTaskData } from '../../lib/tasks';

const fetcher = (url) => fetch(url).then((res) => res.json());

const Post = ({ staticTask, id }) => {
  const router = useRouter();

  const { data: task, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-task/${id}`,
    fetcher,
    {
      initialData: staticTask,
    }
  );

  useEffect(() => {
    mutate();
  }, []);

  if (router.isFallback || !task) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title={task.title}>
      <span className="mb-4">
        {'ID : '}
        {task.id}
      </span>
      <p className="mb-4 text-xl font-bold">{task.title}</p>
      <p className="mb-12">{task.created_at}</p>
      <Link href="/task-page">
        <div className="flex cursor-pointer mt-8">
          <svg
            class="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            ></path>
          </svg>
          <span>Back to task-page</span>
        </div>
      </Link>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const paths = await getAllTaskIds();

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const staticTask = await getTaskData(params.id);

  return {
    props: {
      id: staticTask.id,
      staticTask,
    },
    revalidate: 3,
  };
};

export default Post;

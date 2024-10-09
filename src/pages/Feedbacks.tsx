import FeedbackTable from '@/components/FeedbackTable';
import useLoadingStore from '@/components/hooks/useLoading';
import Loader from './Loader';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Feedbacks {
  feedback_id: number;
  feedback_message: string;
  feedback_rate: string;
  feedback_date: string;
  fullname: string;
}

const Feedbacks = () => {
  const { isLoading, setLoading } = useLoadingStore();

  const [data, setData] = useState<Feedbacks[]>([]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/feedback.php`,
      );

      setData(res.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div>
      {' '}
      <div className="flex h-[4rem] w-full items-center border-b-2 px-4">
        <h1 className="text-2xl font-bold">List of Feedbacks</h1>
      </div>
      <div className="my-4 max-h-fit min-h-[500px]">
        {isLoading ? (
          <div className="flex h-[400px] w-full items-center justify-center">
            <Loader />
          </div>
        ) : (
          <FeedbackTable fetchFeedbacks={fetchFeedbacks} data={data} />
        )}
      </div>
    </div>
  );
};

export default Feedbacks;

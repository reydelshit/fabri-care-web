import useLoadingStore from '@/components/hooks/useLoading';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import Loader from './Loader';

interface Users {
  user_Id: string;
  fullname: string;
  email: string;
  password: string;
  created_at: string;
}

interface Data {
  name: string;
  total: number;
}

interface Contributor {
  fullname: string;
  uploaded_image: number;
  day_most_used: string;
}

const Reports = () => {
  const [dataUser, setDataUser] = useState<Users[]>([]);
  const [data, setData] = useState<Data[]>([]);
  const [contributor, setContributor] = useState({} as Contributor);

  const { isLoading, setLoading } = useLoadingStore();

  const feetchGraphUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/graphWeek.php`,
      );

      setData(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContributor = async () => {
    try {
      setLoading(true);
      await axios
        .get(`${import.meta.env.VITE_SERVER_LINK}/contributer.php`)
        .then((res) => {
          console.log(res.data, 'contributor');

          const filteredData = res.data.reduce(
            (
              max: { uploaded_image: number },
              current: { uploaded_image: number },
            ) => {
              return current.uploaded_image > max.uploaded_image
                ? current
                : max;
            },
            res.data[0],
          );

          console.log(filteredData, 'filteredData');
          setContributor(filteredData);
        });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const feetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/users.php`,
      );
      setDataUser(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([feetchGraphUsers(), fetchContributor(), feetchUsers()]);
  }, []);

  return (
    <div className="h-full min-h-[700px] w-full">
      <div className="flex h-[4rem] w-full items-center border-b-2 px-4">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>

      <div className="flex gap-4">
        <div className="mt-[2rem] w-full p-4 text-center">
          <h1 className="text-[3rem] font-bold">ENGAGEMENT</h1>

          <span className="mt-[4rem] block text-center text-4xl text-[6rem] font-bold text-[#DEAC80]">
            {isLoading ? <Loader /> : dataUser.length + '+'}
          </span>
          <p className="mt-2 block text-[3rem] font-bold text-gray-400">
            TOTAL USERS
          </p>
        </div>

        <div className="mt-[2rem] w-full p-4 text-center">
          <h1 className="text-[3rem] font-bold">POPULAR DAYS</h1>'
          {isLoading ? (
            <Loader />
          ) : (
            <span className="mt-[4rem] block">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                  <XAxis
                    dataKey="name"
                    stroke="black"
                    fontSize={14}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="black"
                    fontSize={14}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Bar dataKey="total" fill="#DEAC80" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>{' '}
            </span>
          )}
        </div>

        <div className="mt-[2rem] flex w-full flex-col items-center p-4 text-center">
          <h1 className="text-[2.5rem] font-bold">TOP CONTRIBUTOR</h1>

          {isLoading ? (
            <Loader />
          ) : (
            <div className="mt-[2rem] text-start text-4xl">
              <p>
                Name:{' '}
                <span className="font-bold text-[#DEAC80]">
                  {contributor.fullname}
                </span>
              </p>
              <p>
                Image Uploaded:{' '}
                <span className="font-bold text-[#DEAC80]">
                  {contributor.uploaded_image}
                </span>
              </p>
              <p>
                Day Most Used:{' '}
                <span className="block font-semibold text-[#DEAC80]">
                  {' '}
                  {contributor.day_most_used}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;

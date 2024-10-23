import useLoadingStore from '@/components/hooks/useLoading';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
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

interface PopularFabricStains {
  month: string;
  fabric: string;
  fabricValue: number;
  stain: string;
  stainValue: number;
}

const Reports = () => {
  const [dataUser, setDataUser] = useState<Users[]>([]);
  const [data, setData] = useState<Data[]>([]);
  const [contributor, setContributor] = useState({} as Contributor);
  const [popularFabricStainsData, setPopularFabricStainsData] = useState<
    PopularFabricStains[]
  >([]);

  const { isLoading, setLoading } = useLoadingStore();

  const fetchGraphPopularFabricStains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/graph_popular.php`,
      );

      setPopularFabricStainsData(res.data);
      console.log(res.data, 'res.data');
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

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
    Promise.all([
      feetchGraphUsers(),
      fetchContributor(),
      feetchUsers(),
      fetchGraphPopularFabricStains(),
    ]);
  }, []);

  return (
    <div className="h-fit w-full">
      <div className="flex w-full items-center gap-2">
        <div className="flex w-[40%] flex-col items-start justify-start">
          <div className="mt-[2rem] w-full rounded-3xl border-[1px] p-4 text-center shadow-sm">
            <h1 className="text-[3rem] font-bold">ENGAGEMENT</h1>

            <span className="mt-[4rem] block text-center text-4xl text-[6rem] font-bold text-[#DEAC80]">
              {isLoading ? <Loader /> : dataUser.length + '+'}
            </span>
            <p className="mt-2 block text-[3rem] font-bold text-gray-400">
              TOTAL USERS
            </p>
          </div>

          <div className="mt-[2rem] flex w-full flex-col items-center rounded-3xl border-[1px] p-4 text-center shadow-sm">
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

        <div className="mx-auto w-full rounded-3xl border-[1px] p-4 shadow-sm">
          <h2 className="mb-4 text-center text-2xl font-bold">
            Popular Fabrics and Stains
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={popularFabricStainsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const fabricData = payload.find(
                      (p) => p.dataKey === 'fabricValue',
                    );
                    const stainData = payload.find(
                      (p) => p.dataKey === 'stainValue',
                    );
                    return (
                      <div className="border border-gray-300 bg-white p-2 shadow-md">
                        <p className="font-bold">{label}</p>
                        {fabricData && (
                          <p className="text-sm">{`${fabricData.payload.fabric}: ${fabricData.value}`}</p>
                        )}
                        {stainData &&
                          typeof stainData.value === 'number' &&
                          stainData.value > 0 && (
                            <p className="text-sm">{`${stainData.payload.stain}: ${stainData.value}`}</p>
                          )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="fabricValue" name="Fabric" fill="#DEAC80" />
              <Bar dataKey="stainValue" name="Stain" fill="#8B4513" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* 
        <div className="mt-[2rem] w-full rounded-3xl border-[1px] p-4 text-center shadow-sm">
          <h1 className="text-[3rem] font-bold">POPULAR DAYS</h1>'
          {isLoading ? (
            <Loader />
          ) : (
            <span className="mt-[4rem] block w-full">
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
        </div> */}
      </div>
    </div>
  );
};

export default Reports;

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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

  const feetchUsers = () => {
    axios
      .get(`${import.meta.env.VITE_SERVER_LINK}/graphWeek.php`)
      .then((res) => {
        console.log(res.data, 'graph');
        // setDataUser(res.data);

        setData(res.data);
      });
  };

  const fetchContributor = () => {
    axios
      .get(`${import.meta.env.VITE_SERVER_LINK}/contributer.php`)
      .then((res) => {
        console.log(res.data, 'contributor');
        // setDataUser(res.data);

        const filteredData = res.data.reduce(
          (
            max: { uploaded_image: number },
            current: { uploaded_image: number },
          ) => {
            return current.uploaded_image > max.uploaded_image ? current : max;
          },
          res.data[0],
        );

        console.log(filteredData, 'filteredData');
        setContributor(filteredData);
      });
  };

  const feetchGraph = () => {
    axios.get(`${import.meta.env.VITE_SERVER_LINK}/users.php`).then((res) => {
      console.log(res.data);
      setDataUser(res.data);
    });
  };

  useEffect(() => {
    Promise.all([feetchUsers(), fetchContributor(), feetchGraph()]);
  }, []);

  return (
    <div className="h-full w-full">
      <div className="flex h-[4rem] w-full items-center border-b-2 px-4">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>

      <div className="flex gap-4">
        <div className="mt-[2rem] w-full p-4 text-center">
          <h1 className="text-[3rem] font-bold">ENGAGEMENT</h1>
          <span className="mt-[4rem] block text-4xl text-[6rem] font-bold text-[#DEAC80]">
            {dataUser.length}+
          </span>
          <p className="mt-2 block text-[3rem] font-bold text-gray-400">
            TOTAL USERS
          </p>
        </div>

        <div className="mt-[2rem] w-full p-4 text-center">
          <h1 className="text-[3rem] font-bold">POPULAR DAYS</h1>
          <span className="mt-[4rem] block">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Bar
                  dataKey="total"
                  fill="#FACC15"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>{' '}
          </span>
        </div>

        <div className="mt-[2rem] flex w-full flex-col items-center p-4 text-center">
          <h1 className="text-[2.5rem] font-bold">TOP CONTRIBUTOR</h1>

          <div className="mt-[2rem] text-start text-4xl">
            <p>
              Name: <span className="font-bold">{contributor.fullname}</span>
            </p>
            <p>
              Image Uploaded:{' '}
              <span className="font-bold">{contributor.uploaded_image}</span>
            </p>
            <p>
              Day Most Used:{' '}
              <span className="block font-semibold">
                {' '}
                {contributor.day_most_used}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

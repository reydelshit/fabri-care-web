import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: 'Mon',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Tue',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Wed',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Thu',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Fri',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Sat',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Sun',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

const Reports = () => {
  return (
    <div className="h-full w-full">
      <div className="flex h-[4rem] w-full items-center border-b-2 px-4">
        <h1>Reports</h1>
      </div>

      <div className="flex gap-4">
        <div className="mt-[2rem] w-full p-4 text-center">
          <h1 className="text-[3rem] font-bold">ENGAGEMENT</h1>
          <span className="mt-[4rem] block text-4xl text-[6rem] font-bold text-[#DEAC80]">
            92+
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar
                  dataKey="total"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>{' '}
            92+
          </span>
        </div>

        <div className="mt-[2rem] flex w-full flex-col items-center p-4 text-center">
          <h1 className="text-[3rem] font-bold">STATISTICS</h1>

          <div className="mt-[2rem] text-start text-4xl">
            <p>Location: Polomolok</p>
            <p>Interactions: 40%</p>
            <p>
              Location: <span className="block font-semibold">Sunday</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

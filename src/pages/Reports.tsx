import useLoadingStore from '@/components/hooks/useLoading';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Loader from './Loader';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import usePagination from '@/components/hooks/usePagination';
import PaginationTemplate from '@/components/Pagination';

interface Users {
  user_Id: string;
  fullname: string;
  email: string;
  password: string;
  created_at: string;
}

interface MonthlyData {
  image_id: string;
  user_id: string;
  image_path: string;
  fabric: string;
  stain: string;
  full_name: string;
  image_uploadDate: string;
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

interface FabricStainData {
  name: string;
  value: number;
}

const Reports = () => {
  const [dataUser, setDataUser] = useState<Users[]>([]);
  // const [data, setData] = useState<Data[]>([]);
  const [contributor, setContributor] = useState({} as Contributor);
  const [popularFabricStainsData, setPopularFabricStainsData] = useState<
    PopularFabricStains[]
  >([]);

  const [fabricData, setFabricData] = useState<FabricStainData[]>([]);
  const [stainData, setStainData] = useState<FabricStainData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toLocaleString('default', { month: 'long' }),
  );

  const [isLoadingGraph, setIsLoadingGraph] = useState(false);

  const { isLoading, setLoading } = useLoadingStore();

  const fetchGraphPopularFabricStains = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/graph_popular.php`,
      );

      setPopularFabricStainsData(res.data);
      console.log(res.data, 'res.data');
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSelectMonth = async (month: string) => {
    try {
      setIsLoadingGraph(true);
      const resFabric = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/graphFabric.php`,
        { params: { month } },
      );

      const resStain = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/graphStain.php`,
        { params: { month } },
      );

      const resMonthlyData = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/monthlyTable.php`,
        { params: { month } },
      );

      console.log(resFabric, resStain, 'resFabric, resStain');

      Promise.all([resFabric, resStain, resMonthlyData]).then((res) => {
        setFabricData(res[0].data);
        setStainData(res[1].data);
        setMonthlyData(res[2].data);

        setIsLoadingGraph(false);
      });
    } catch (error) {
      console.error('Error fetching fabrics or stain:', error);
    }
  };

  // const feetchGraphUsers = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await axios.get(
  //       `${import.meta.env.VITE_SERVER_LINK}/graphWeek.php`,
  //     );

  //     // setData(res.data);
  //   } catch (error) {
  //     console.error('Error fetching users:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    handleSelectMonth(currentMonth);
    setLoading(true);
    Promise.all([
      // feetchGraphUsers(),
      fetchContributor(),
      feetchUsers(),
      fetchGraphPopularFabricStains(),
    ]).then(() => {
      setLoading(false);
    });
  }, []);

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 10,
      data: monthlyData,
    });

  return (
    <div className="h-fit w-full">
      <div className="flex w-full items-center gap-2">
        <div className="flex w-[30%] flex-col items-start justify-start">
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

        {!isLoadingGraph ? (
          <div className="flex w-full rounded-3xl border-[1px] p-4 shadow-sm">
            <div className="flex w-full justify-between gap-4">
              <div className="w-full max-w-[400px]">
                <h2 className="mb-4 text-start text-2xl font-bold">
                  Uploaded History
                </h2>

                <span>Only shows 10 per page. </span>
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Fabric</TableHead>
                      <TableHead>Stain</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="w-full">
                    {currentItems.length > 0 ? (
                      currentItems.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.full_name}</TableCell>
                          <TableCell>{row.fabric}</TableCell>
                          <TableCell>{row.stain}</TableCell>
                          <TableCell>{row.image_uploadDate}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell className="text-center" colSpan={4}>
                          No data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <PaginationTemplate
                  totalPages={totalPages}
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                />
              </div>
              <div className="flex h-full w-[60%] flex-col">
                <div className="flex w-full justify-between">
                  <h2 className="mb-4 text-start text-2xl font-bold">
                    Uploaded History
                  </h2>

                  <Select
                    onValueChange={handleSelectMonth}
                    defaultValue={new Date().toLocaleString('default', {
                      month: 'long',
                    })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="January">January</SelectItem>
                      <SelectItem value="February">February</SelectItem>
                      <SelectItem value="March">March</SelectItem>
                      <SelectItem value="April">April</SelectItem>
                      <SelectItem value="May">May</SelectItem>
                      <SelectItem value="June">June</SelectItem>
                      <SelectItem value="July">July</SelectItem>
                      <SelectItem value="August">August</SelectItem>
                      <SelectItem value="September">September</SelectItem>
                      <SelectItem value="October">October</SelectItem>
                      <SelectItem value="November">November</SelectItem>
                      <SelectItem value="December">December</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={fabricData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stainData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* <ResponsiveContainer width="100%" height={400}>
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
            </ResponsiveContainer> */}
          </div>
        ) : (
          <Loader />
        )}
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

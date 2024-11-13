import useLoadingStore from '@/components/hooks/useLoading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

import usePagination from '@/components/hooks/usePagination';
import PaginationTemplate from '@/components/Pagination';

interface Users {
  user_Id: string;
  fullname: string;
  email: string;
  password: string;
  created_at: string;
}

interface UploadHistoryTable {
  image_id: string;
  user_id: string;
  image_path: string;
  fabric: string;
  stain: string;
  fullname: string;
  image_uploadDate: string;
}

interface Contributor {
  fullname: string;
  uploaded_image: number;
  day_most_used: string;
}

interface FabricStainData {
  name: string;
  value: number;
}

const Reports = () => {
  const [dataUser, setDataUser] = useState<Users[]>([]);

  const [contributor, setContributor] = useState({} as Contributor);
  const [uploadedAllTimeImages, setUploadedAllTimeImages] = useState<
    UploadHistoryTable[]
  >([]);
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryTable[]>([]);
  const [currentMonth] = useState(
    new Date().toLocaleString('default', { month: 'long' }),
  );

  const { setLoading } = useLoadingStore();

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

  const fetchUploadedImage = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/AlltimeUpload.php`,
      );
      setUploadedAllTimeImages(res.data);

      console.log(res.data, 'images all time');
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      handleFilterValueChange(currentMonth),
      fetchContributor(),
      feetchUsers(),
      fetchUploadedImage(),
    ]).then(() => {
      setLoading(false);
    });
  }, []);

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 10,
      data: uploadHistory,
    });

  const [filterByWhat, setFilterByWhat] = useState<string>('Monthly');

  const [fabricData, setFabricData] = useState<FabricStainData[]>([]);
  const [stainData, setStainData] = useState<FabricStainData[]>([]);
  const [isLoadingGraph, setIsLoadingGraph] = useState<boolean>(false);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = Array.from({ length: 2025 - 2010 + 1 }, (_, i) =>
    (2010 + i).toString(),
  );

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const handleFilterValueChange = async (value: string) => {
    setIsLoadingGraph(true);

    try {
      const params = {
        filterByWhat,
        filterValue: value,
      };

      const [resFabric, resStain, uploadHistory] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVER_LINK}/graphFabric2.php`, {
          params,
        }),
        axios.get(`${import.meta.env.VITE_SERVER_LINK}/graphStain2.php`, {
          params,
        }),
        axios.get(`${import.meta.env.VITE_SERVER_LINK}/uploadHistory.php`, {
          params,
        }),
      ]);

      console.log(resFabric, resStain, 'resFabric, resStain');

      setFabricData(Array.isArray(resFabric.data) ? resFabric.data : []);
      setStainData(Array.isArray(resStain.data) ? resStain.data : []);
      setUploadHistory(
        Array.isArray(uploadHistory.data) ? uploadHistory.data : [],
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadingGraph(false);
    }
  };

  return (
    <div className="h-fit w-full">
      <div className="flex w-full gap-2">
        <div className="flex w-[30%] flex-col items-start justify-start rounded-3xl border bg-background p-6">
          <div className="flex w-full flex-col">
            <h1 className="my-4 text-2xl font-semibold">Current Trend</h1>
            <span className="text-sm">
              Most Famous Fabric:{' '}
              <span className="font-medium">
                {fabricData.length > 0 ? fabricData[0].name : 'No data'}
              </span>
            </span>
            <span className="mt-1 text-sm">
              Most Famous Stain:{' '}
              <span className="font-medium">
                {stainData.length > 0 ? stainData[0].name : 'No data'}
              </span>
            </span>
          </div>

          <div className="mt-6 flex w-full flex-col">
            <h1 className="my-4 text-2xl font-semibold">
              User Engagement Metrics
            </h1>
            <span className="text-sm">
              Total Users:{' '}
              <span className="font-medium">{dataUser.length}</span>
            </span>
            <span className="mt-1 text-sm">
              Active Users by Month:{' '}
              <span className="font-medium">{contributor.fullname}</span>
            </span>
            <span className="mt-1 text-sm">
              Average Uploads per Month:{' '}
              <span className="font-medium">
                {(uploadedAllTimeImages.length / months.length).toFixed(2)}
              </span>
            </span>
            <span className="mt-1 text-sm">
              Average Uploads per User:{' '}
              <span className="font-medium">
                {(uploadedAllTimeImages.length / dataUser.length).toFixed(2)}
              </span>
            </span>
            <span className="mt-1 text-sm">
              Most Active User:{' '}
              <span className="font-medium">
                {contributor.fullname} {contributor.uploaded_image} uploads
              </span>
            </span>
          </div>
        </div>
        <div className="flex w-full rounded-3xl border-[1px] p-4 shadow-sm">
          <div className="flex min-h-[400px] w-full justify-between gap-4">
            <div className="w-full max-w-[450px]">
              <h2 className="mb-4 text-start text-2xl font-bold">
                Upload History
              </h2>

              <span>Only shows 10 per page. </span>

              {!isLoadingGraph ? (
                <>
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
                            <TableCell>{row.fullname}</TableCell>
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
                </>
              ) : (
                <Loader />
              )}
            </div>
            <div className="flex h-full w-[60%] flex-col">
              <div className="flex w-full justify-between">
                <h2 className="mb-4 text-start text-2xl font-bold">
                  Tally (Total Uploads)
                </h2>

                <div className="flex gap-4">
                  <Select
                    defaultValue="Monthly"
                    onValueChange={setFilterByWhat}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>

                  {filterByWhat && (
                    <Select
                      defaultValue={currentMonth}
                      onValueChange={handleFilterValueChange}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue
                          placeholder={`Select ${filterByWhat.toLowerCase()}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filterByWhat === 'Daily' &&
                          days.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        {filterByWhat === 'Monthly' &&
                          months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        {filterByWhat === 'Yearly' &&
                          years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              {!isLoadingGraph ? (
                <div className="flex flex-col">
                  <div className="rounded bg-white p-4 shadow-md">
                    <div className="text-lg font-bold">Fabric Distribution</div>
                    <div className="mt-4 h-[300px]">
                      {isLoadingGraph ? (
                        <div className="flex h-full items-center justify-center">
                          Loading...
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={fabricData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 rounded bg-white p-4 shadow-md">
                    <div className="text-lg font-bold">Stain Distribution</div>
                    <div className="mt-4 h-[300px]">
                      {isLoadingGraph ? (
                        <div className="flex h-full items-center justify-center">
                          Loading...
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stainData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Loader />
              )}
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
        )
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

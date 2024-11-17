import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';

import usePagination from '@/components/hooks/usePagination';
import PaginationTemplate from '@/components/Pagination';
import axios from 'axios';
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

interface UploadHistoryTable {
  image_id: string;
  user_id: string;
  image_path: string;
  fabric: string;
  stain: string;
  fullname: string;
  image_uploadDate: string;
}

type GraphTypes = {
  name: string;
  value: number;
};

type PopularFabric = {
  fabric: string;
  combinination_count: number;
  washing_instructions: string;
};

type PopularStain = {
  fabric_type: string;
  stain_type: string;
  combinination_count: number;
  specific_instructions: string;
};
const NewReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);
  const [fabricData, setFabricData] = useState<GraphTypes[]>([]);
  const [stainData, setStainData] = useState<GraphTypes[]>([]);
  const [uploadedAllTimeImages, setUploadedAllTimeImages] = useState<
    UploadHistoryTable[]
  >([]);
  const [isLoading, setLoading] = useState(false);

  const [topPopularFabrics, setTopPopularFabrics] = useState<PopularFabric[]>(
    [],
  );
  const [topPopularStains, setTopPopularStains] = useState<PopularStain[]>([]);

  const fetchUploads = async () => {
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

  const fetchPopularStainFabric = async () => {
    try {
      setLoading(true);
      const res1 = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/popular_fab.php`,
      );
      setTopPopularFabrics(res1.data);

      console.log(res1.data, 'fabs');

      const res2 = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/popular_stain.php`,
      );
      setTopPopularStains(res2.data);

      console.log(res2.data, 'stains');
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGraphData = async () => {
    try {
      setIsLoadingGraph(true);
      const res1 = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/graphStain.php`,
      );
      setStainData(res1.data);

      const res2 = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/graphFabric.php`,
      );

      console.log(res2.data, 'fabs');
      setFabricData(res2.data);

      console.log(res1.data, 'fabs');
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingGraph(false);
    }
  };

  const handleChangeDate = async (value: string, type: string) => {
    // Update state
    if (type === 'start') {
      setStartDate(value);

      try {
        const serverLink = import.meta.env.VITE_SERVER_LINK;

        const [
          graphFabric,
          graphStain,
          popularFabrics,
          popularStains,
          allTimeUpload,
        ] = await Promise.all([
          axios.get(`${serverLink}/graphFabric.php`, {
            params: { startDate: value, endDate },
          }),
          axios.get(`${serverLink}/graphStain.php`, {
            params: { startDate: value, endDate },
          }),
          axios.get(`${serverLink}/popular_fab.php`, {
            params: { startDate: value, endDate },
          }),
          axios.get(`${serverLink}/popular_stain.php`, {
            params: { startDate: value, endDate },
          }),
          axios.get(`${serverLink}/AlltimeUpload.php`, {
            params: { startDate: value, endDate },
          }),
        ]);

        // Set data based on the responses
        setFabricData(graphFabric.data);
        setStainData(graphStain.data);
        setTopPopularFabrics(popularFabrics.data);
        setTopPopularStains(popularStains.data);
        setUploadedAllTimeImages(allTimeUpload.data);

        console.log(graphFabric.data, 'fabs start end');
        //   console.log(popularFabrics.data, 'popularFabrics  start end');
        //   console.log(popularStains.data, 'popularStains  start end');
        //   console.log(allTimeUpload.data, 'images all time  start end');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      setEndDate(value);
      try {
        const serverLink = import.meta.env.VITE_SERVER_LINK;

        const [
          graphFabric,
          graphStain,
          popularFabrics,
          popularStains,
          allTimeUpload,
        ] = await Promise.all([
          axios.get(`${serverLink}/graphFabric.php`, {
            params: { startDate, endDate: value },
          }),
          axios.get(`${serverLink}/graphStain.php`, {
            params: { startDate, endDate: value },
          }),
          axios.get(`${serverLink}/popular_fab.php`, {
            params: { startDate, endDate: value },
          }),
          axios.get(`${serverLink}/popular_stain.php`, {
            params: { startDate, endDate: value },
          }),
          axios.get(`${serverLink}/AlltimeUpload.php`, {
            params: { startDate, endDate: value },
          }),
        ]);

        // Set data based on the responses
        setFabricData(graphFabric.data);
        setStainData(graphStain.data);
        setTopPopularFabrics(popularFabrics.data);
        setTopPopularStains(popularStains.data);
        setUploadedAllTimeImages(allTimeUpload.data);

        console.log(graphFabric.data, 'fabs start end');
        //   console.log(popularFabrics.data, 'popularFabrics  start end');
        //   console.log(popularStains.data, 'popularStains  start end');
        //   console.log(allTimeUpload.data, 'images all time  start end');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    console.log(value, 'value');
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchUploads(),
      fetchGraphData(),
      fetchPopularStainFabric(),
    ]).then(() => {
      setLoading(false);
    });
  }, []);

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 8,
      data: uploadedAllTimeImages,
    });

  if (isLoading) {
    return (
      <div className="flex h-fit w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-fit w-full">
      <div className="mb-[1rem] mt-[-1rem] flex w-full justify-start gap-4">
        <div>
          <Label>Start Date:</Label>
          <Input
            onChange={(e) => {
              handleChangeDate(e.target.value, 'start');
            }}
            type="date"
            name="start_date"
          />
        </div>

        <div>
          <Label>End Date:</Label>
          <Input
            onChange={(e) => handleChangeDate(e.target.value, 'end')}
            type="date"
            name="end_date"
          />
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="w-[70%]">
          <h1 className="font-bold">Uploads</h1>
          <Table className="border-2">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Fabric</TableHead>
                <TableHead>Stain</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploadedAllTimeImages.length > 0 ? (
                currentItems.map((upload, index) => (
                  <TableRow key={index}>
                    <TableCell>{upload.fullname}</TableCell>
                    <TableCell>{upload.fabric}</TableCell>
                    <TableCell>{upload.stain}</TableCell>
                    <TableCell>{upload.image_uploadDate}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="h-[250px] text-center">
                  <TableCell rowSpan={2} colSpan={4}>
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

        <div className="flex w-[60%] gap-2">
          <div className="w-full">
            <h1 className="font-bold">Top Popular Instructions (Fabric): </h1>
            {topPopularFabrics.length > 0 ? (
              topPopularFabrics
                .map((fabric, index) => (
                  <div
                    className="my-2 gap-2 rounded-md border-2 p-2 shadow-sm"
                    key={index}
                  >
                    <span>Top: {index + 1}</span>

                    <h1 className="font-bold">{fabric.fabric}</h1>
                    <p>
                      {fabric.washing_instructions.slice(
                        0,
                        Math.min(fabric.washing_instructions.length, 100),
                      )}{' '}
                      ...
                      <Dialog>
                        <DialogTrigger>
                          <span className="text-sm text-blue-500">
                            Read more
                          </span>
                        </DialogTrigger>
                        <DialogContent className="h-fit w-[90%] max-w-[1200px]">
                          <DialogHeader className="mb-4">
                            <DialogTitle className="text-xl font-semibold">
                              Read More about {fabric.fabric}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                              Instructions for washing {fabric.fabric}
                            </DialogDescription>
                          </DialogHeader>

                          <p className="whitespace-pre-line">
                            {fabric.washing_instructions}
                          </p>
                        </DialogContent>
                      </Dialog>
                    </p>
                  </div>
                ))
                .slice(0, 3)
            ) : (
              <div className="my-2 flex h-full items-center justify-center gap-2 rounded-md border-2 p-2">
                No data
              </div>
            )}
          </div>

          <div className="w-full">
            <h1 className="font-bold">Top Popular Instructions (Stains): </h1>

            {topPopularStains.length > 0 ? (
              topPopularStains
                .map((stain, index) => (
                  <div
                    className="my-2 gap-2 rounded-md border-2 p-2 shadow-sm"
                    key={index}
                  >
                    <span>Top: {index + 1}</span>
                    <h1 className="font-bold">
                      {stain.fabric_type.charAt(0).toUpperCase() +
                        stain.fabric_type.slice(1)}{' '}
                      -{' '}
                      {stain.stain_type.charAt(0).toUpperCase() +
                        stain.stain_type.slice(1)}
                    </h1>
                    <p>
                      {stain.specific_instructions.slice(
                        0,
                        Math.min(stain.specific_instructions.length, 100),
                      )}
                      ...
                      <Dialog>
                        <DialogTrigger>
                          <span className="text-sm text-blue-500">
                            Read more
                          </span>
                        </DialogTrigger>
                        <DialogContent className="h-fit w-[90%] max-w-[1200px]">
                          <DialogHeader className="mb-4">
                            <DialogTitle className="text-xl font-semibold">
                              Read More about {stain.stain_type}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                              Instructions for stain {stain.stain_type}
                            </DialogDescription>
                          </DialogHeader>

                          <p className="whitespace-pre-line">
                            {stain.specific_instructions}
                          </p>
                        </DialogContent>
                      </Dialog>
                    </p>
                  </div>
                ))
                .slice(0, 3)
            ) : (
              <div className="my-2 flex h-full items-center justify-center gap-2 rounded-md border-2 p-2">
                No data
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-[2rem] flex w-full gap-4 rounded-md border-2 shadow-sm">
        <div className="w-full rounded bg-white p-4 shadow-md">
          <div className="text-lg font-bold">
            Fabric Distribution{' '}
            {startDate || endDate ? `(${startDate} - ${endDate})` : ''}
          </div>
          <div className="mt-4 flex h-[300px] w-full justify-between gap-4">
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
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}

            <div className="w-[250px] rounded-md border-2 p-2 shadow-sm">
              <h1 className="text-xl">
                Total:{' '}
                <span className="font-bold">
                  {' '}
                  {fabricData.reduce((a, b) => a + b.value, 0)}
                </span>
              </h1>

              <div>
                {fabricData.map((stain) => {
                  const total = fabricData.reduce((a, b) => a + b.value, 0);
                  const percentage =
                    total === 0
                      ? '0.00'
                      : ((stain.value / total) * 100).toFixed(2);

                  return (
                    <div key={stain.name}>
                      <span className="font-bold">{stain.name}:</span>{' '}
                      <span>{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full rounded bg-white p-4 shadow-md">
          <div className="text-lg font-bold">
            Stain Distribution{' '}
            {startDate || endDate ? `(${startDate} - ${endDate})` : ''}
          </div>
          <div className="mt-4 flex h-[300px] w-full justify-between gap-4">
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
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}

            <div className="w-[250px] rounded-md border-2 p-2 shadow-sm">
              <h1 className="text-xl">
                Total:{' '}
                <span className="font-bold">
                  {' '}
                  {stainData.reduce((a, b) => a + b.value, 0)}
                </span>
              </h1>

              <div>
                {stainData.map((stain) => {
                  const total = stainData.reduce((a, b) => a + b.value, 0);
                  const percentage =
                    total === 0
                      ? '0.00'
                      : ((stain.value / total) * 100).toFixed(2);

                  return (
                    <div key={stain.name}>
                      <span className="font-bold">{stain.name}:</span>{' '}
                      <span>{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReport;

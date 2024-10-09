import useLoadingStore from '@/components/hooks/useLoading';
import UsersTable from '@/components/UsersTable';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loader from './Loader';

interface Users {
  user_Id: string;
  fullname: string;
  email: string;
  password: string;
  created_at: string;
}

const Users = () => {
  const { isLoading, setLoading } = useLoadingStore();

  const [data, setData] = useState<Users[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/users.php`,
      );

      setData(res.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div>
      <div className="flex h-[4rem] w-full items-center border-b-2 px-4">
        <h1 className="text-2xl font-bold">List of Users</h1>
      </div>

      <div className="my-4 max-h-fit min-h-[500px]">
        {isLoading ? (
          <div className="flex h-[400px] w-full items-center justify-center">
            <Loader />
          </div>
        ) : (
          <UsersTable fetchUsers={fetchUsers} data={data} />
        )}
      </div>
    </div>
  );
};

export default Users;

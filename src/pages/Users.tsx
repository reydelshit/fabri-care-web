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
    <div className="h-full">
      <div className="my-4 h-full">
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

import UsersTable from '@/components/UsersTable';

const Users = () => {
  return (
    <div>
      <div className="flex h-[4rem] w-full items-center border-b-2 px-4">
        <h1 className="text-2xl font-bold">List of Users</h1>
      </div>

      <div className="my-4 h-full">
        <UsersTable />
      </div>
    </div>
  );
};

export default Users;

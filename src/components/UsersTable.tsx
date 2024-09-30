import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import {
  MaterialReactTable,
  MRT_TableInstance,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from 'material-react-table';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';

//data definitions...
interface Users {
  user_Id: string;
  fullname: string;
  email: string;
  password: string;
  created_at: string;
}

interface Attachments {
  fullname: string;
  image_path: string;
  image_uploadDate: string;
  user_Id: string;
}

const UsersTable = () => {
  const [data, setData] = useState<Users[]>([]);
  const [userID, setUserID] = useState<string>('');
  const [showAttachments, setShowAttachments] = useState<boolean>(false);

  const [attachments, setAttachments] = useState<Attachments[]>([]);

  const handleShowAttachments = (id: string) => {
    setUserID(id);
    setShowAttachments(true);

    axios
      .get(`${import.meta.env.VITE_SERVER_LINK}/users.php`, {
        params: {
          user_Id: id,
        },
      })
      .then((res) => {
        console.log(res.data, 'ssssssss');
        setAttachments(res.data);
      });
  };

  const feetchUsers = () => {
    axios.get(`${import.meta.env.VITE_SERVER_LINK}/users.php`).then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  };

  useEffect(() => {
    feetchUsers();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Users>[]>(
    () => [
      {
        id: 'user_Id',
        header: 'User ID',
        Cell: ({ row }) => <span>FABRI_USER - {row.original.user_Id} </span>,
      },
      {
        accessorKey: 'fullname',
        header: 'Full Name',
      },
      {
        accessorKey: 'username',
        header: 'Username',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        id: 'attachments',
        header: 'Attachments',
        Cell: ({ row }) => (
          <Button
            className="hover:bg-[#DEAC80]"
            onClick={() => {
              console.log(row.original.user_Id);
              handleShowAttachments(row.original.user_Id);
            }}
          >
            View Uploaded Images
          </Button>
        ),
      },

      {
        accessorKey: 'created_at',
        header: 'Account Created At',
        Cell: ({ cell }) => moment(cell.getValue<string>()).format('LL'),
      },
    ],
    [],
  );

  const handleDeleteRows = (
    rows: MRT_RowSelectionState,
    table: MRT_TableInstance<Users>,
  ) => {
    const selectedRowIds = Object.keys(rows);
    const isAllSelected = table.getIsAllRowsSelected();

    if (isAllSelected) {
      console.log(
        'Deleting all rows:',
        data.map((row) => row.user_Id),
      );

      const userIDS = data.map((row) => parseInt(row.user_Id.toString(), 10));

      userIDS.forEach((id) => {
        axios
          .delete(`${import.meta.env.VITE_SERVER_LINK}/users.php`, {
            data: {
              user_Id: id,
            },
          })
          .then((res) => {
            console.log(`Feedback ID ${id} deleted:`, res.data);
            feetchUsers();
          })
          .catch((error) => {
            console.error(`Error deleting feedback ID ${id}:`, error);
          });
      });
    } else {
      console.log('Deleting selected rows:', selectedRowIds);

      const userIDS = selectedRowIds.map((row) => parseInt(row.toString(), 10));

      userIDS.forEach((id) => {
        axios
          .delete(`${import.meta.env.VITE_SERVER_LINK}/users.php`, {
            data: {
              user_Id: id,
            },
          })
          .then((res) => {
            console.log(`Feedback ID ${id} deleted:`, res.data);
            feetchUsers();
          })
          .catch((error) => {
            console.error(`Error deleting feedback ID ${id}:`, error);
          });
      });
    }
  };

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    getRowId: (row) => row.user_Id,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        className="bg-red-500"
        disabled={Object.keys(rowSelection).length === 0}
        onClick={() => handleDeleteRows(rowSelection, table)}
      >
        <DeleteIcon /> Delete Selected
      </Button>
    ),
  });

  useEffect(() => {
    console.info({ rowSelection });
    console.info(table.getState().rowSelection);
  }, [rowSelection]);

  return (
    <div className="block">
      <MaterialReactTable table={table} />

      {showAttachments && (
        <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-75">
          <div className="relative h-fit max-h-[60%] w-[40%] overflow-y-scroll rounded-lg bg-white">
            <div className="sticky top-0 z-20 flex h-[8rem] w-full flex-col items-center justify-center border-b-2 bg-white px-4">
              <div className="flex w-full flex-row-reverse items-center justify-between">
                <div className="flex justify-end">
                  <Button
                    className="border-2 bg-[#DEAC80]"
                    onClick={() => setShowAttachments(false)}
                  >
                    Close
                  </Button>
                </div>

                <h1 className="text-lg font-bold">
                  LIST OF IMAGES{' '}
                  <span className="inline-block uppercase underline">
                    {attachments.length > 0 ? attachments[0].fullname : ''}
                  </span>{' '}
                  UPLOADED
                </h1>
              </div>

              <div className="flex h-fit w-full flex-row items-center justify-between">
                <h1 className="text-md font-semibold">
                  Number of Images: {attachments.length}
                </h1>
              </div>
            </div>

            <div className="relative flex h-full flex-col items-center justify-center">
              <div className="flex h-fit w-full flex-col bg-gray-100 px-2">
                {attachments.length > 0 ? (
                  attachments.map((attachment, index) => (
                    <div className="my-2 border-b-2 pb-2" key={index}>
                      <div className="flex items-center gap-4">
                        <h1 className="h-[3rem] w-[3rem] rounded-full bg-[#DEAC80] p-4 text-center font-bold">
                          {index + 1}
                        </h1>
                        <img
                          className="h-[15rem] w-[15rem] object-cover"
                          src={`${import.meta.env.VITE_SERVER_LINK}/${attachment.image_path}`}
                          alt="image"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid h-[8rem] place-content-center text-center">
                    No Images Found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;

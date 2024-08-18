import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import axios from 'axios';
import {
  MaterialReactTable,
  MRT_TableInstance,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';

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
  upload_date: string;
  upload_longblob: string;
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
        accessorKey: 'user_Id',
        header: 'User ID',
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
            onClick={() => {
              console.log(row.original.user_Id);
              handleShowAttachments(row.original.user_Id);
            }}
          >
            View Attachments
          </Button>
        ),
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
    } else {
      console.log('Deleting selected rows:', selectedRowIds);
    }
  };

  //optionally, you can manage the row selection state yourself
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    getRowId: (row) => row.user_Id, //give each row a more useful id
    onRowSelectionChange: setRowSelection, //connect internal row selection state to your own
    state: { rowSelection }, //pass our managed row selection state to the table to use
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        color="error"
        disabled={Object.keys(rowSelection).length === 0}
        onClick={() => handleDeleteRows(rowSelection, table)}
        startIcon={<DeleteIcon />}
        variant="contained"
      >
        Delete Selected
      </Button>
    ),
  });

  useEffect(() => {
    console.info({ rowSelection }); //read your managed row selection state
    console.info(table.getState().rowSelection); //alternate way to get the row selection state
  }, [rowSelection]);

  return (
    <>
      <MaterialReactTable table={table} />

      {showAttachments && (
        <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-75">
          <div className="h-full max-h-[60%] w-[40%] rounded-lg bg-white p-4">
            <div className="flex w-full justify-end">
              <Button onClick={() => setShowAttachments(false)}>CLose</Button>
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                LIST OF IMAGES{' '}
                <span className="inline-block uppercase underline">
                  {attachments.length > 0 ? attachments[0].fullname : ''}
                </span>{' '}
                UPLOADED
              </h1>
              {attachments.map((attachment, index) => (
                <div className="my-2" key={index}>
                  <div className="flex items-center gap-4">
                    <h1 className="h-[3rem] w-[3rem] rounded-full bg-[#DEAC80] p-4 text-center font-bold">
                      {index + 1}
                    </h1>
                    <img
                      className="h-[10rem] w-[10rem] border-2 object-cover"
                      src={attachment.upload_longblob}
                      alt="image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersTable;

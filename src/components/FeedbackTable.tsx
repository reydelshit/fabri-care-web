import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  MRT_Row,
  MRT_TableInstance,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from 'material-react-table';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

//data definitions...
interface Person {
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  city: string;
  state: string;
}
//end

const data = [
  {
    userId: '3f25309c-8fa1-470f-811e-cdb082ab9017', //we'll use this as a unique row id
    firstName: 'Dylan',
    lastName: 'Murray',
    age: 22,
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  }, //data definitions...
  {
    userId: 'be731030-df83-419c-b3d6-9ef04e7f4a9f',
    firstName: 'Raquel',
    lastName: 'Kohler',
    age: 18,
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  //end
];

const FeedbackTable = () => {
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Full Name',
      },

      {
        id: 'submissionTime', // use 'id' instead of 'accessorKey' for columns not in the data
        header: 'Submission Time',
        Cell: () => new Date().toLocaleString(), // This will show the current time
      },
      {
        id: 'feedback', // use 'id' instead of 'accessorKey' for columns not in the data
        header: 'Feedbacks',
        Cell: () => <Button>View Feedbacks</Button>,
      },
    ],
    [], //end
  );

  const handleDeleteRows = (
    rows: MRT_RowSelectionState,
    table: MRT_TableInstance<Person>,
  ) => {
    const selectedRowIds = Object.keys(rows);
    const isAllSelected = table.getIsAllRowsSelected();

    if (isAllSelected) {
      console.log(
        'Deleting all rows:',
        data.map((row) => row.userId),
      );
      // Implement your delete all logic here
      // For example:
      // setData([]);
    } else {
      console.log('Deleting selected rows:', selectedRowIds);
      // Implement your delete selected logic here
      // For example:
      // setData(prevData => prevData.filter(row => !selectedRowIds.includes(row.userId)));
    }
  };

  //optionally, you can manage the row selection state yourself
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    getRowId: (row) => row.userId, //give each row a more useful id
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

  //do something when the row selection changes...
  useEffect(() => {
    console.info({ rowSelection }); //read your managed row selection state
    console.info(table.getState().rowSelection); //alternate way to get the row selection state
  }, [rowSelection]);

  return <MaterialReactTable table={table} />;
};

export default FeedbackTable;

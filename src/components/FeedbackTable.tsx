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
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

//data definitions...
interface Feedbacks {
  feedback_id: number;
  feedback_message: string;
  feedback_rate: string;
  feedback_date: string;
  fullname: string;
}
//end

// const data = [
//   {
//     userId: '3f25309c-8fa1-470f-811e-cdb082ab9017', //we'll use this as a unique row id
//     firstName: 'Dylan',
//     lastName: 'Murray',
//     age: 22,
//     address: '261 Erdman Ford',
//     city: 'East Daphne',
//     state: 'Kentucky',
//   }, //data definitions...
//   {
//     userId: 'be731030-df83-419c-b3d6-9ef04e7f4a9f',
//     firstName: 'Raquel',
//     lastName: 'Kohler',
//     age: 18,
//     address: '769 Dominic Grove',
//     city: 'Columbus',
//     state: 'Ohio',
//   },
//   //end
// ];

const FeedbackTable = () => {
  const [data, setData] = useState<Feedbacks[]>([]);

  const fetchFeedbacks = () => {
    axios
      .get(`${import.meta.env.VITE_SERVER_LINK}/feedback.php`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Feedbacks>[]>(
    () => [
      {
        accessorKey: 'fullname',
        header: 'Full Name',
      },

      {
        accessorKey: 'feedback_date',
        header: 'Submission Date',
        Cell: ({ cell }) => moment(cell.getValue<string>()).format('LL'),
      },
      {
        accessorKey: 'feedback_rate',
        header: 'Feedbacks Rate',
      },

      {
        accessorKey: 'feedback_message',
        header: 'Feedbacks Message',
      },
    ],
    [],
  );

  const handleDeleteRows = (
    rows: MRT_RowSelectionState,
    table: MRT_TableInstance<Feedbacks>,
  ) => {
    const selectedRowIds = Object.keys(rows);
    const isAllSelected = table.getIsAllRowsSelected();

    if (isAllSelected) {
      console.log(
        'Deleting all rows:',
        data.map((row) => row.feedback_id),
      );

      const feedbackIds = data.map((row) =>
        parseInt(row.feedback_id.toString(), 10),
      );

      feedbackIds.forEach((id) => {
        axios
          .delete(`${import.meta.env.VITE_SERVER_LINK}/feedback.php`, {
            data: {
              feedback_id: id,
            },
          })
          .then((res) => {
            console.log(`Feedback ID ${id} deleted:`, res.data);
            fetchFeedbacks();
          })
          .catch((error) => {
            console.error(`Error deleting feedback ID ${id}:`, error);
          });
      });
    } else {
      console.log('Deleting selected rows:', selectedRowIds);

      console.log(selectedRowIds[0]);

      axios
        .delete(`${import.meta.env.VITE_SERVER_LINK}/feedback.php`, {
          data: {
            feedback_id: selectedRowIds[0],
          },
        })
        .then((res) => {
          console.log(res.data);
          fetchFeedbacks();
        });
    }
  };

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    getRowId: (row) => row.feedback_id.toString(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
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

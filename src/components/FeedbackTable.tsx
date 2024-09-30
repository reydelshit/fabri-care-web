import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from './ui/button';
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

interface Feedbacks {
  feedback_id: number;
  feedback_message: string;
  feedback_rate: string;
  feedback_date: string;
  fullname: string;
}

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
        header: 'Feedbacks',
      },

      {
        accessorKey: 'feedback_message',
        header: 'Feedback Message',
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

      // console.log(selectedRowIds[0]);

      const feedbackIds = selectedRowIds.map((row) =>
        parseInt(row.toString(), 10),
      );

      console.log(feedbackIds);

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
    }
  };

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const table = useMaterialReactTable({
    columns,
    data: data.sort((a, b) => {
      return (
        new Date(b.feedback_date).getTime() -
        new Date(a.feedback_date).getTime()
      );
    }),
    enableRowSelection: true,
    getRowId: (row) => row.feedback_id.toString(),
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

  return <MaterialReactTable table={table} />;
};

export default FeedbackTable;

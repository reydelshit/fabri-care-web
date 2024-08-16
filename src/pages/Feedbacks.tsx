import FeedbackTable from '@/components/FeedbackTable';
import React from 'react';

const Feedbacks = () => {
  return (
    <div>
      {' '}
      <div className="flex h-[4rem] w-full items-center border-b-2 px-4">
        <h1 className="text-2xl font-bold">List of Feedbacks</h1>
      </div>
      <div className="my-4">
        <FeedbackTable />
      </div>
    </div>
  );
};

export default Feedbacks;

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { SetStateAction, useState } from 'react';

const FeedbackForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackRate, setFeedbackRate] = useState('');

  const handleFeedbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post(`${import.meta.env.VITE_SERVER_LINK}/feedback.php`, {
        fullname: `${firstName} ${lastName}`,
        feedback_message: feedback,
        feedback_rate: feedbackRate,
      })
      .then((res) => {
        console.log(res.data);
        window.alert('Feedback submitted successfully');
        window.location.reload();
      });
  };

  const handleFeedbackChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setFeedbackRate(event.target.value);
  };

  return (
    <div className="flex h-dvh w-dvw items-center justify-center border-2">
      <div className="h-fit w-[40rem] rounded-xl border-2 p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Feedack Form</h1>

        <form onSubmit={handleFeedbackSubmit}>
          <div className="flex w-full gap-2">
            <div className="w-full">
              {' '}
              <Label> Firstname</Label>
              <Input onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="w-full">
              {' '}
              <Label> Lastname</Label>
              <Input onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="my-4 w-full">
            <h1 className="my-2 font-semibold">
              Please provide your feedback on the effectiveness of our product
            </h1>
            <div className="flex w-full items-center justify-center gap-4">
              {['Excellent', 'Superb', 'Good', 'Average', 'Poor'].map(
                (option) => (
                  <span key={option} className="flex items-center gap-2">
                    <Input
                      type="radio"
                      id={option}
                      name="feedback"
                      value={option}
                      checked={feedbackRate === option}
                      onChange={handleFeedbackChange}
                    />
                    <Label htmlFor={option}>{option}</Label>
                  </span>
                ),
              )}
            </div>
          </div>

          <div>
            <h1 className="my-2 font-semibold">
              Do you have any suggestion on what we can do to provide with
              better service?
            </h1>

            <textarea
              onChange={(e) => setFeedback(e.target.value)}
              className="h-[10rem] w-full rounded-xl border-2 p-4"
            ></textarea>
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="rounded-xl bg-[#DEAC80] p-2 text-white"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;

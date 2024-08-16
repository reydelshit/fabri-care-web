import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const FeedbackForm = () => {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center border-2">
      <div className="h-fit w-[40rem] rounded-xl border-2 p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Feedack Form</h1>

        <form>
          <div className="flex w-full gap-2">
            <div className="w-full">
              {' '}
              <Label> Firstname</Label>
              <Input />
            </div>
            <div className="w-full">
              {' '}
              <Label> Lastname</Label>
              <Input />
            </div>
          </div>

          <div className="my-4 w-full">
            <h1 className="my-2 font-semibold">
              Please provide your feedback on the effectiveness of our product
            </h1>
            <div className="flex w-full items-center justify-center gap-4">
              <span className="flex items-center gap-2">
                <Input type="radio" name="Excellent" />
                <Label>Excellent</Label>
              </span>
              <span className="flex items-center gap-2">
                <Input type="radio" name="Excellent" />
                <Label>Superb</Label>
              </span>
              <span className="flex items-center gap-2">
                <Input type="radio" name="Good" />
                <Label>Good</Label>
              </span>{' '}
              <span className="flex items-center gap-2">
                <Input type="radio" name="Average" />
                <Label>Average</Label>
              </span>{' '}
              <span className="flex items-center gap-2">
                <Input type="radio" name="Poor" />
                <Label>Poor</Label>
              </span>
            </div>
          </div>

          <div>
            <h1 className="my-2 font-semibold">
              Do you have any suggestion on what we can do to provide with
              better service?
            </h1>

            <textarea className="h-[10rem] w-full rounded-xl border-2 p-4"></textarea>
          </div>

          <div className="flex items-center justify-center">
            <Button className="rounded-xl bg-[#DEAC80] p-2 text-white">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;

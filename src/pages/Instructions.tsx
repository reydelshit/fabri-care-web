import usePagination from '@/components/hooks/usePagination';
import PaginationTemplate from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface StainData {
  id: string;
  fabric_type: string;
  stain_type: string;
  washing_instructions: string;
  blood_instructions: string;
  coffee_instructions: string;
  grass_instructions: string;
  grease_instructions: string;
  marker_instructions: string;
  ketchup_instructions: string;
  chocolate_instructions: string;
}

const Instructions = () => {
  // const [fabricType, setFabricType] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [formData, setFormData] = useState({
    fabric_type: '',
    washing_instructions: '',
    blood_instructions: '',
    coffee_instructions: '',
    grass_instructions: '',
    grease_instructions: '',
    marker_instructions: '',
    ketchup_instructions: '',
    chocolate_instructions: '',
  });

  const [instructions, setInstructions] = useState<StainData[]>([]);
  const [instructionsID, setInstructionsID] = useState<string>('');

  const [itemId, setItemId] = useState<string>('');

  const fetchInstructions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/instructions.php`,
      );

      console.log(res.data);
      setInstructions(res.data);
    } catch (error) {
      console.error('Error fetching instructions:', error);
    }
  };

  useEffect(() => {
    fetchInstructions();
  }, []);

  const filteredInstructions = instructions.filter((item) => {
    return item.fabric_type.toLowerCase().includes(search.toLowerCase());
  });

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 5,
      data: filteredInstructions,
    });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitted');

    console.log(formData);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_LINK}/instructions.php`,
        {
          stain_type: 'General',
          ...formData,
        },
      );

      fetchInstructions();
      console.log(res.data);

      toast({
        title: 'Instructions added successfully',
        description: 'The instructions have been added successfully',
      });

      setFormData({
        fabric_type: '',
        washing_instructions: '',
        blood_instructions: '',
        coffee_instructions: '',
        grass_instructions: '',
        grease_instructions: '',
        marker_instructions: '',
        ketchup_instructions: '',
        chocolate_instructions: '',
      });
    } catch (error) {
      console.error('Error submitting instructions:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER_LINK}/instructions.php`,
        {
          data: {
            id,
          },
        },
      );

      console.log(res.data);
      fetchInstructions();

      toast({
        title: 'Instructions deleted successfully',
        description: 'The instructions have been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting instructions:', error);
    }
  };

  const handleConfirmDelete = () => {
    handleDelete(itemId);
  };

  const fetchInstructionsByID = async (id: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/instructions.php`,
        {
          params: {
            id,
          },
        },
      );

      console.log(res.data);
      setFormData(res.data[0]);
      setInstructionsID(res.data[0].id);
    } catch (error) {
      console.error('Error fetching instructions:', error);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitted');

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_LINK}/instructions.php`,
        {
          ...formData,
          id: instructionsID,
          stain_type: 'General',
        },
      );

      console.log(res.data);

      toast({
        title: 'Instructions updated successfully',
        description: 'The instructions have been updated successfully',
      });
    } catch (error) {
      console.error('Error submitting instructions:', error);
    }

    fetchInstructions();
  };

  return (
    <div className="w-full">
      <div className="my-2 flex w-full justify-between">
        <Input
          placeholder="Search"
          className="w-[20rem]"
          onChange={(value) => setSearch(value.target.value)}
        />
        <Dialog>
          <DialogTrigger>
            <Button className="bg-[#DEAC80] p-2 text-white">
              Add Instructions
            </Button>
          </DialogTrigger>
          <DialogContent className="h-[95%] w-[70%]">
            <DialogHeader>
              <DialogTitle>
                Enter the instructions for the different types of stains
              </DialogTitle>
              <DialogDescription>
                Please enter the instructions for the different types of stains
                that can be found on the fabric
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div>
                <Label>Fabric type:</Label>
                <Input
                  value={formData.fabric_type}
                  onChange={handleChange}
                  name="fabric_type"
                  className="w-[50%]"
                />
              </div>

              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <Label>Washing Instructions</Label>
                  <Textarea
                    name="washing_instructions"
                    value={formData.washing_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Blood Instructions</Label>
                  <Textarea
                    name="blood_instructions"
                    value={formData.blood_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Coffee Instructions</Label>
                  <Textarea
                    name="coffee_instructions"
                    value={formData.coffee_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Grass Instructions</Label>
                  <Textarea
                    name="grass_instructions"
                    value={formData.grass_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Grease Instructions</Label>
                  <Textarea
                    name="grease_instructions"
                    value={formData.grease_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Marker Instructions</Label>
                  <Textarea
                    name="marker_instructions"
                    value={formData.marker_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Ketchup Instructions</Label>
                  <Textarea
                    name="ketchup_instructions"
                    value={formData.ketchup_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Chocolate Instructions</Label>
                  <Textarea
                    name="chocolate_instructions"
                    value={formData.chocolate_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="mt-4 inline-flex w-full justify-end self-end">
                <DialogClose>
                  {' '}
                  <Button
                    type="submit"
                    className="rounded-md bg-[#DEAC80] p-2 text-white"
                  >
                    Submit
                  </Button>
                </DialogClose>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <p className="my-2 font-semibold">Only shows 5, per page</p>
      <Table>
        <TableCaption>
          Stain Removal Instructions for Various Fabrics
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Fabric Type</TableHead>
            <TableHead>Stain Type</TableHead>
            <TableHead>Washing Instructions</TableHead>
            <TableHead>Blood Instructions</TableHead>
            <TableHead>Coffee Instructions</TableHead>
            <TableHead>Grass Instructions</TableHead>
            <TableHead>Grease Instructions</TableHead>
            <TableHead>Marker Instructions</TableHead>
            <TableHead>Ketchup Instructions</TableHead>
            <TableHead>Chocolate Instructions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.fabric_type}</TableCell>
              <TableCell>{item.stain_type}</TableCell>
              <TableCell>
                {item.washing_instructions?.slice(0, 50) + '...'}
              </TableCell>
              <TableCell>
                {item.blood_instructions?.slice(0, 50) + '...'}
              </TableCell>
              <TableCell>
                {item.coffee_instructions?.slice(0, 50) + '...'}
              </TableCell>
              <TableCell>
                {item.grass_instructions?.slice(0, 50) + '...'}
              </TableCell>
              <TableCell>
                {item.grease_instructions?.slice(0, 50) + '...'}
              </TableCell>
              <TableCell>
                {item.marker_instructions?.slice(0, 50) + '...'}
              </TableCell>
              <TableCell>
                {item.ketchup_instructions?.slice(0, 50) + '...'}
              </TableCell>
              <TableCell>
                {item.chocolate_instructions?.slice(0, 50) + '...'}
              </TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        onClick={() => fetchInstructionsByID(item.id)}
                        className="bg-[#DEAC80] p-2 text-white"
                      >
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="h-[95%] w-[70%]">
                      <DialogHeader>
                        <DialogTitle>View instructions</DialogTitle>
                        <DialogDescription>
                          Instructions for the different types of stains
                        </DialogDescription>
                      </DialogHeader>

                      <form className="overflow-y-scroll">
                        <div>
                          <Label>Fabric type:</Label>
                          <Input value={item.fabric_type} disabled />
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <Label>Washing Instructions</Label>
                            <Textarea
                              name="washing_instructions"
                              value={formData.washing_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[400px]"
                              disabled
                            />
                          </div>

                          <div>
                            <Label>Blood Instructions</Label>
                            <Textarea
                              name="blood_instructions"
                              value={formData.blood_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[400px]"
                              disabled
                            />
                          </div>

                          <div>
                            <Label>Coffee Instructions</Label>
                            <Textarea
                              name="coffee_instructions"
                              value={formData.coffee_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[400px]"
                              disabled
                            />
                          </div>

                          <div>
                            <Label>Grass Instructions</Label>
                            <Textarea
                              name="grass_instructions"
                              value={formData.grass_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[400px]"
                              disabled
                            />
                          </div>

                          <div>
                            <Label>Grease Instructions</Label>
                            <Textarea
                              name="grease_instructions"
                              value={formData.grease_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[400px]"
                              disabled
                            />
                          </div>

                          <div>
                            <Label>Marker Instructions</Label>
                            <Textarea
                              name="marker_instructions"
                              value={formData.marker_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[400px]"
                              disabled
                            />
                          </div>

                          <div>
                            <Label>Ketchup Instructions</Label>
                            <Textarea
                              name="ketchup_instructions"
                              value={formData.ketchup_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[400px]"
                              disabled
                            />
                          </div>

                          <div>
                            <Label>Chocolate Instructions</Label>
                            <Textarea
                              name="chocolate_instructions"
                              value={formData.chocolate_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[400px]"
                              disabled
                            />
                          </div>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger>
                      <Button
                        onClick={() => fetchInstructionsByID(item.id)}
                        className="bg-[#DEAC80] p-2 text-white"
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="h-[95%] w-[70%]">
                      <DialogHeader>
                        <DialogTitle>
                          Edit the instructions for the different types of
                          stains
                        </DialogTitle>
                        <DialogDescription>
                          Please edit the instructions for the different types
                          of stains that can be found on the fabric
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleSubmitEdit}>
                        <div>
                          <Label>Fabric type: </Label>

                          <Input
                            name="fabric_type"
                            value={formData.fabric_type}
                            onChange={handleChange}
                          />
                          {/* <Select
                            onValueChange={(value) => {
                              console.log(value);
                              setFabricType(value);
                            }}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Fabric type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cotton">Cotton</SelectItem>
                              <SelectItem value="Linen">Linen</SelectItem>
                              <SelectItem value="Rayon">Rayon</SelectItem>
                              <SelectItem value="Synthetic">
                                Synthetic
                              </SelectItem>
                              <SelectItem value="Cashmere">Cashmere</SelectItem>
                              <SelectItem value="Silk">Silk</SelectItem>
                              <SelectItem value="Wool">Wool</SelectItem>
                            </SelectContent>
                          </Select>{' '} */}
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <Label>Washing Instructions</Label>
                            <Textarea
                              name="washing_instructions"
                              value={formData.washing_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[100px]"
                            />
                          </div>

                          <div>
                            <Label>Blood Instructions</Label>
                            <Textarea
                              name="blood_instructions"
                              value={formData.blood_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[100px]"
                            />
                          </div>

                          <div>
                            <Label>Coffee Instructions</Label>
                            <Textarea
                              name="coffee_instructions"
                              value={formData.coffee_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[100px]"
                            />
                          </div>

                          <div>
                            <Label>Grass Instructions</Label>
                            <Textarea
                              name="grass_instructions"
                              value={formData.grass_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[100px]"
                            />
                          </div>

                          <div>
                            <Label>Grease Instructions</Label>
                            <Textarea
                              name="grease_instructions"
                              value={formData.grease_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[100px]"
                            />
                          </div>

                          <div>
                            <Label>Marker Instructions</Label>
                            <Textarea
                              name="marker_instructions"
                              value={formData.marker_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[100px]"
                            />
                          </div>

                          <div>
                            <Label>Ketchup Instructions</Label>
                            <Textarea
                              name="ketchup_instructions"
                              value={formData.ketchup_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[100px]"
                            />
                          </div>

                          <div>
                            <Label>Chocolate Instructions</Label>
                            <Textarea
                              name="chocolate_instructions"
                              value={formData.chocolate_instructions}
                              onChange={handleChange}
                              placeholder="Enter steps here, seperated by \n"
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>

                        <div className="mt-4 inline-flex w-full justify-end self-end">
                          <DialogClose>
                            <Button
                              type="submit"
                              className="rounded-md bg-[#DEAC80] p-2 text-white"
                            >
                              Update
                            </Button>
                          </DialogClose>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setItemId(item.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[30%]">
                      <DialogHeader>
                        <DialogTitle>
                          Are you sure you want to delete this item?
                        </DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete the item.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose>
                          <Button
                            variant="outline"
                            onClick={() => setItemId('')}
                          >
                            Cancel
                          </Button>{' '}
                        </DialogClose>
                        <DialogClose>
                          <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                          >
                            Delete
                          </Button>{' '}
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationTemplate
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Instructions;

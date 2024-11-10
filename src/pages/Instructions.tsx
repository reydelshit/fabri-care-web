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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import Loader from './Loader';

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

interface FormData {
  fabric_type: string;
  washing_instructions: string;
  blood_instructions: string;
  coffee_instructions: string;
  grass_instructions: string;
  grease_instructions: string;
  marker_instructions: string;
  ketchup_instructions: string;
  chocolate_instructions: string;
}

type InstructionField = keyof Omit<FormData, 'fabric_type'>;

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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchInstructions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_LINK}/instructions.php`,
      );

      console.log(res.data);
      setInstructions(res.data);
    } catch (error) {
      console.error('Error fetching instructions:', error);
    } finally {
      setIsLoading(false);
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

  const handleSelectInstructions = (type: string, value: string) => {
    switch (type) {
      case 'Washing':
        setFormData({
          ...formData,
          washing_instructions:
            instructions.find((item) => item.fabric_type === value)
              ?.washing_instructions || '',
        });

        break;
      case 'Blood':
        setFormData({
          ...formData,
          blood_instructions:
            instructions.find((item) => item.fabric_type === value)
              ?.blood_instructions || '',
        });
        break;
      case 'Coffee':
        setFormData({
          ...formData,
          coffee_instructions:
            instructions.find((item) => item.fabric_type === value)
              ?.coffee_instructions || '',
        });
        break;
      case 'Grass':
        setFormData({
          ...formData,
          grass_instructions:
            instructions.find((item) => item.fabric_type === value)
              ?.grass_instructions || '',
        });
        break;
      case 'Grease':
        setFormData({
          ...formData,
          grease_instructions:
            instructions.find((item) => item.fabric_type === value)
              ?.grease_instructions || '',
        });
        break;
      case 'Marker':
        setFormData({
          ...formData,
          marker_instructions:
            instructions.find((item) => item.fabric_type === value)
              ?.marker_instructions || '',
        });
        break;
      case 'Ketchup':
        setFormData({
          ...formData,
          ketchup_instructions:
            instructions.find((item) => item.fabric_type === value)
              ?.ketchup_instructions || '',
        });
        break;
      case 'Chocolate':
        setFormData({
          ...formData,
          chocolate_instructions:
            instructions.find((item) => item.fabric_type === value)
              ?.chocolate_instructions || '',
        });
        break;
    }
  };

  return (
    <div className="w-full">
      <div className="my-2 flex w-full justify-between">
        <div className="flex gap-4">
          <Input
            placeholder="Search"
            className="h-[3rem] w-[20rem]"
            onChange={(value) => setSearch(value.target.value)}
          />

          <p className="my-2 font-semibold">Only shows 5, per page</p>
        </div>

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
                  <div className="my-2 flex items-center justify-between">
                    <Label>Washing Instructions</Label>

                    <Select
                      onValueChange={(value: string) =>
                        handleSelectInstructions('Washing', value)
                      }
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Use existing instructions" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructions.map((item, index) => (
                          <SelectItem key={index} value={item.fabric_type}>
                            {item.fabric_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Textarea
                    name="washing_instructions"
                    value={formData.washing_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <div className="my-2 flex items-center justify-between">
                    <Label>Blood Instructions</Label>

                    <Select
                      onValueChange={(value: string) =>
                        handleSelectInstructions('Blood', value)
                      }
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Use existing instructions" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructions.map((item, index) => (
                          <SelectItem key={index} value={item.fabric_type}>
                            {item.fabric_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    name="blood_instructions"
                    value={formData.blood_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <div className="my-2 flex items-center justify-between">
                    <Label>Coffee Instructions</Label>

                    <Select
                      onValueChange={(value: string) =>
                        handleSelectInstructions('Coffee', value)
                      }
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Use existing instructions" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructions.map((item, index) => (
                          <SelectItem key={index} value={item.fabric_type}>
                            {item.fabric_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    name="coffee_instructions"
                    value={formData.coffee_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <div className="my-2 flex items-center justify-between">
                    <Label>Grass Instructions</Label>

                    <Select
                      onValueChange={(value: string) =>
                        handleSelectInstructions('Grass', value)
                      }
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Use existing instructions" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructions.map((item, index) => (
                          <SelectItem key={index} value={item.fabric_type}>
                            {item.fabric_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    name="grass_instructions"
                    value={formData.grass_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <div className="my-2 flex items-center justify-between">
                    <Label>Grease Instructions</Label>

                    <Select
                      onValueChange={(value: string) =>
                        handleSelectInstructions('Grease', value)
                      }
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Use existing instructions" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructions.map((item, index) => (
                          <SelectItem key={index} value={item.fabric_type}>
                            {item.fabric_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    name="grease_instructions"
                    value={formData.grease_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <div className="my-2 flex items-center justify-between">
                    <Label>Marker Instructions</Label>

                    <Select
                      onValueChange={(value: string) =>
                        handleSelectInstructions('Marker', value)
                      }
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Use existing instructions" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructions.map((item, index) => (
                          <SelectItem key={index} value={item.fabric_type}>
                            {item.fabric_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    name="marker_instructions"
                    value={formData.marker_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <div className="my-2 flex items-center justify-between">
                    <Label>Ketchup Instructions</Label>

                    <Select
                      onValueChange={(value: string) =>
                        handleSelectInstructions('Ketchup', value)
                      }
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Use existing instructions" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructions.map((item, index) => (
                          <SelectItem key={index} value={item.fabric_type}>
                            {item.fabric_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    name="ketchup_instructions"
                    value={formData.ketchup_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <div className="my-2 flex items-center justify-between">
                    <Label>Chocolate Instructions</Label>

                    <Select
                      onValueChange={(value: string) =>
                        handleSelectInstructions('Chocolate', value)
                      }
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Use existing instructions" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructions.map((item, index) => (
                          <SelectItem key={index} value={item.fabric_type}>
                            {item.fabric_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    name="chocolate_instructions"
                    value={formData.chocolate_instructions}
                    onChange={handleChange}
                    placeholder="Enter steps here, seperated by \n"
                    className="min-h-[200px]"
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

      {isLoading ? (
        <div className="flex min-h-[400px] items-center">
          <Loader />
        </div>
      ) : (
        <div className="min-h-[400px]">
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
                            className="bg-[#DEAC80] p-2 text-white transition-colors hover:bg-[#c49872]"
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="h-[95vh] w-[90%] max-w-[1200px]">
                          <DialogHeader className="mb-4">
                            <DialogTitle className="text-xl font-semibold">
                              View Instructions
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                              Instructions for the different types of stains
                            </DialogDescription>
                          </DialogHeader>

                          <div className="max-h-[calc(95vh-120px)] overflow-y-auto">
                            <div className="mb-4">
                              <Label className="mb-1 text-sm font-medium">
                                Fabric type:
                              </Label>
                              <Input
                                value={item.fabric_type}
                                disabled
                                className="bg-gray-50"
                              />
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              {[
                                {
                                  label: 'Washing Instructions',
                                  value: item.washing_instructions,
                                },
                                {
                                  label: 'Blood Instructions',
                                  value: item.blood_instructions,
                                },
                                {
                                  label: 'Coffee Instructions',
                                  value: item.coffee_instructions,
                                },
                                {
                                  label: 'Grass Instructions',
                                  value: item.grass_instructions,
                                },
                                {
                                  label: 'Grease Instructions',
                                  value: item.grease_instructions,
                                },
                                {
                                  label: 'Marker Instructions',
                                  value: item.marker_instructions,
                                },
                                {
                                  label: 'Ketchup Instructions',
                                  value: item.ketchup_instructions,
                                },
                                {
                                  label: 'Chocolate Instructions',
                                  value: item.chocolate_instructions,
                                },
                              ].map((instruction, index) => (
                                <div key={index} className="space-y-2">
                                  <Label className="text-lg font-medium">
                                    {instruction.label}
                                  </Label>
                                  <div className="min-h-[400px] overflow-y-auto whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    {instruction.value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger>
                          <Button
                            onClick={() => fetchInstructionsByID(item.id)}
                            className="bg-[#DEAC80] p-2 text-white hover:bg-[#c49872]"
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[85vh] w-[85%] max-w-[1200px]">
                          <DialogHeader>
                            <DialogTitle className="text-xl">
                              Edit the instructions for the different types of
                              stains
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">
                              Please edit the instructions for the different
                              types of stains that can be found on the fabric
                            </DialogDescription>
                          </DialogHeader>

                          <form onSubmit={handleSubmitEdit} className="mt-4">
                            <div className="max-h-[calc(85vh-200px)] overflow-y-auto pr-4">
                              <div className="mb-6">
                                <Label className="text-sm font-medium">
                                  Fabric type:{' '}
                                </Label>
                                <Input
                                  name="fabric_type"
                                  value={formData.fabric_type}
                                  onChange={handleChange}
                                  className="mt-1"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                {[
                                  {
                                    label: 'Washing Instructions',
                                    name: 'washing_instructions' as InstructionField,
                                  },
                                  {
                                    label: 'Blood Instructions',
                                    name: 'blood_instructions' as InstructionField,
                                  },
                                  {
                                    label: 'Coffee Instructions',
                                    name: 'coffee_instructions' as InstructionField,
                                  },
                                  {
                                    label: 'Grass Instructions',
                                    name: 'grass_instructions' as InstructionField,
                                  },
                                  {
                                    label: 'Grease Instructions',
                                    name: 'grease_instructions' as InstructionField,
                                  },
                                  {
                                    label: 'Marker Instructions',
                                    name: 'marker_instructions' as InstructionField,
                                  },
                                  {
                                    label: 'Ketchup Instructions',
                                    name: 'ketchup_instructions' as InstructionField,
                                  },
                                  {
                                    label: 'Chocolate Instructions',
                                    name: 'chocolate_instructions' as InstructionField,
                                  },
                                ].map((field) => (
                                  <div key={field.name} className="space-y-2">
                                    <Label className="text-sm font-medium">
                                      {field.label}
                                    </Label>
                                    <Textarea
                                      name={field.name}
                                      value={formData[field.name]}
                                      onChange={handleChange}
                                      placeholder="Enter steps here, separated by \n"
                                      className="min-h-[180px] resize-none"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mt-6 flex justify-end border-t pt-4">
                              <DialogClose>
                                <Button
                                  type="submit"
                                  className="rounded-md bg-[#DEAC80] px-4 py-2 text-white hover:bg-[#c49872]"
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
                              This action cannot be undone. This will
                              permanently delete the item.
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
        </div>
      )}

      <PaginationTemplate
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Instructions;

import { Category } from "@/components/common/Post/Category";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useField } from "formik";

export const CategorySelect = () => {
  const [field, meta, helpers] = useField("category");
  const handleSelectChange = (value: string) => {
    helpers.setValue(value);
  };

  return (
    <div>
      <Select onValueChange={handleSelectChange} value={field.value}>
        <SelectTrigger className="md:w-96">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select Category</SelectLabel>
            {Category.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {meta.touched && meta.error && (
        <div className="text-red-500">{meta.error}</div>
      )}
    </div>
  );
};

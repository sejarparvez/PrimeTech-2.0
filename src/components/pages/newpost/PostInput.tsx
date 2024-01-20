import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useField } from "formik";

interface MyTextInputProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  id?: string;
}

export const PostInput: React.FC<MyTextInputProps> = ({
  label,
  id,
  ...props
}) => {
  const [field, meta] = useField(props);
  return (
    <div className="col-span-1 flex flex-col">
      <Label className="mb-1" htmlFor={id || props.name}>
        {label}
      </Label>

      <Input {...field} {...props} />

      {meta.touched && meta.error ? (
        <div className=" text-red-600">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default PostInput;

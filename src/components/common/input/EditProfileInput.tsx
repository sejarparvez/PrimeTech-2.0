import { Input } from "@/components/ui/input";
import { useField } from "formik";

interface FormInputProps {
  name: string;
  type: string;
  id?: string;
  placeholder?: string;
  readOnly?: boolean;
  defaultValue?: string;
}

const EditProfileInput: React.FC<FormInputProps> = ({
  type,
  placeholder,
  id,
  readOnly,
  defaultValue,
  ...props
}) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <div className="relative">
        <Input
          {...field}
          {...props}
          type={type}
          placeholder={placeholder}
          readOnly={readOnly}
          defaultValue={defaultValue}
        />
      </div>
      {meta.touched && meta.error ? (
        <p className="text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default EditProfileInput;

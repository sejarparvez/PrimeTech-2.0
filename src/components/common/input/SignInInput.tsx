import { Input } from "@/components/ui/input";
import { useField } from "formik";

interface FormInputProps {
  name: string;
  type: string;
  id?: string;
  placeholder?: string;
  readOnly?: boolean;
}

const SigninInput: React.FC<FormInputProps> = ({
  type,
  placeholder,
  id,
  readOnly,
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
        />
      </div>
      {meta.touched && meta.error ? (
        <p className="text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default SigninInput;

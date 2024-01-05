import { Input } from "@/components/ui/input";
import { useField } from "formik";

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  id?: string;
}

const SigninInput: React.FC<FormInputProps> = ({ label, id, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <div className="relative">
        <Input
          {...field}
          {...props}
          className="peer flex h-12 w-full appearance-none rounded-lg border border-primary bg-transparent px-2  pb-2.5 pt-4 text-sm  focus:outline-none dark:border-white"
          placeholder=""
        />
        <label
          htmlFor={id}
          className="dark:text-lightgray-200 absolute left-1  top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-secondary px-2 text-sm text-gray-600 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-0  peer-focus:scale-75 peer-focus:px-2 peer-focus:text-black dark:text-gray-400 dark:peer-focus:text-white  "
        >
          {label}
        </label>
      </div>
      {meta.touched && meta.error ? (
        <p className="text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default SigninInput;

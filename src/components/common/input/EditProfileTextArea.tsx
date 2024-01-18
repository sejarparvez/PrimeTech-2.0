import { Textarea } from "@/components/ui/textarea";
import { useField } from "formik";

interface FormInputProps {
  name: string;
  id?: string;
  placeholder?: string;
}

const EditProfileTextArea: React.FC<FormInputProps> = ({
  placeholder,
  id,

  ...props
}) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <div className="relative">
        <Textarea {...field} {...props} placeholder={placeholder} />
      </div>
      {meta.touched && meta.error ? (
        <p className="text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default EditProfileTextArea;

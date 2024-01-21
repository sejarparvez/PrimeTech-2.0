import Toolbar from "@/components/common/Post/Toolbar";
import { Field, FieldProps } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function PostContent() {
  return (
    <div className="mb-20 md:mb-10 lg:mb-4">
      <div>
        <Field name="content">
          {({ field, meta }: FieldProps) => (
            <div>
              <ReactQuill
                className="h-56 w-full md:h-80 lg:h-96"
                value={field.value}
                onChange={field.onChange(field.name)}
                modules={Toolbar()}
              />
              {meta.touched && meta.error && (
                <div className="text-red-500">{meta.error}</div>
              )}
            </div>
          )}
        </Field>
      </div>
    </div>
  );
}

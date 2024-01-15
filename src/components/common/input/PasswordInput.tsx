"use client";
import { Input } from "@/components/ui/input";
import { useField } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormInputProps {
  name: string;
  id?: string;
  placeholder?: string;
  readOnly?: boolean;
}

export default function PasswordInput({
  placeholder,
  id,
  readOnly,
  ...props
}: FormInputProps) {
  const [field, meta] = useField(props);
  const [eye, setEye] = useState(false);

  function handleEye() {
    setEye(!eye);
  }
  return (
    <div>
      <div className="relative">
        <div className=" absolute right-4 top-1 p-2" onClick={handleEye}>
          {eye ? <FaEye /> : <FaEyeSlash />}
        </div>
        <Input
          {...field}
          {...props}
          type={eye ? "text" : "password"}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      </div>
      {meta.touched && meta.error ? (
        <p className="text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
}

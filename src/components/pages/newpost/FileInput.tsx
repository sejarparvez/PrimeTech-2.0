import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";

interface FileSelectProps {
  onFileSelect: (file: File) => void;
}

export function FileInput({ onFileSelect }: FileSelectProps) {
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Input
      id="picture"
      type="file"
      required={true}
      className="flex h-full items-start px-0"
      onChange={handleFileChange}
    />
  );
}

import Toolbar from "@/components/common/Post/Toolbar";
import dynamic from "next/dynamic";
import { FC, useEffect } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

interface Props {
  name: string; // Add a name prop
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

const Content: FC<Props> = ({ name, value, onChange, error }) => {
  useEffect(() => {
    const Quill = require("react-quill");
    if (Quill && typeof window !== "undefined") {
    }
  }, []);

  return (
    <div className="mb-20 md:mb-10 lg:mb-4">
      <div>
        <ReactQuill
          className="h-56 w-full md:h-80 lg:h-96"
          value={value}
          onChange={(content, delta, source, editor) => {
            onChange(name, editor.getHTML());
          }}
          modules={Toolbar()}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Content;

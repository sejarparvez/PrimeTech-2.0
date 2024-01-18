"use client";
import Toolbar from "@/components/common/Post/Toolbar";
import dynamic from "next/dynamic";
import { FC, useEffect } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const Content: FC<Props> = ({ value, onChange, error }) => {
  useEffect(() => {
    const Quill = require("react-quill");
    if (Quill && typeof window !== "undefined") {
    }
  }, []);

  return (
    <div className="mb-4 h-[25rem]">
      <div>
        <ReactQuill
          className="h-96 w-full max-w-5xl"
          value={value}
          onChange={(content, delta, source, editor) => {
            onChange(editor.getHTML());
          }}
          modules={Toolbar()}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Content;

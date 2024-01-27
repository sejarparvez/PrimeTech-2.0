"use client";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ category: string }>();
  return <p>Post: {params.category}</p>;
}

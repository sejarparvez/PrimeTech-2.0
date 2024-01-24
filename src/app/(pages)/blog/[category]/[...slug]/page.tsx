"use client";
import { useUrlParameters } from "@/components/helper/hook/UrlParamitters";
import Header from "@/components/pages/singlepost/Header";
import MainContent from "@/components/pages/singlepost/MainContent";

function decodeFromUrl(encodedStr: string) {
  return decodeURIComponent(encodedStr.replace(/_/g, " "));
}

export default function Page() {
  const { category, postDate, postMonth, postYear, decodedTitle } =
    useUrlParameters();

  return (
    <>
      <Header />
      <MainContent />
    </>
  );
}

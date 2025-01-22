"use client";

import BreadCrumb from "@/components/layout/admin/BreadCrumb";
import { DashboardSidebar } from "@/components/layout/admin/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createSlug } from "@/utils/slug";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { articleCategories } from "@/app/constants/articleCategory";
import { useDashboardArticle } from "@/app/services/post";
import Footer from "@/components/layout/Footer";
import { articleInterFace } from "@/utils/interface";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Edit, Eye, Filter, Search, Trash2 } from "lucide-react";
import { Suspense } from "react";
import DesignSkeleton from "./DesignSkeleton";
import PaginationUi from "./PaginationUi";

function DesignMessage({ message }: { message: string }) {
  return (
    <div className="flex h-[400px] flex-col items-center justify-center text-center">
      <p className="text-xl font-semibold text-muted-foreground">{message}</p>
    </div>
  );
}

function DesignCard({
  item,
  session,
  onDelete,
  onStatusChange,
}: {
  item: articleInterFace;
  session: any;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="md:p-3">
        <div className="relative overflow-hidden">
          <Link href={createSlug({ name: item.title, id: item.id })}>
            <Image
              src={item.coverImage}
              alt={item.title}
              width={400}
              height={300}
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-44"
            />
          </Link>
          <Badge
            className="absolute right-2 top-2 transition-colors duration-300"
            variant={item.status === "PUBLISHED" ? "default" : "secondary"}
          >
            {item.status}
          </Badge>
        </div>
        <div className="mt-3 space-y-2">
          <Link
            href={createSlug({ name: item.title, id: item.id })}
            className="line-clamp-2 text-lg font-semibold hover:underline"
          >
            {item.title}
          </Link>
          <div className="flex items-center text-sm text-muted-foreground">
            <Avatar className="mr-2 h-6 w-6">
              <AvatarImage src={item.author.image || undefined} />
              <AvatarFallback>{item.author.name?.[0]}</AvatarFallback>
            </Avatar>
            <span>{item.author.name}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Category: {item.category}</p>
            <p>
              {formatDistanceToNow(new Date(item.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between bg-muted/50 md:p-3">
        {session?.user?.role === "ADMIN" && (
          <Select
            defaultValue={item.status}
            onValueChange={(value) => onStatusChange(item.id, value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/dashboard/edit-design?id=${item.id}`}>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Edit Design</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={createSlug({ name: item.title, id: item.id })}>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>View Design</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Design</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this design? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}

function Design() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "all",
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("query") || "",
  );

  const handleFilterChange = useCallback(
    (value: string) => {
      setCategory(value);
      router.push(
        `/dashboard/all-design?category=${value}&query=${searchQuery}&page=1`,
      );
    },
    [router, searchQuery],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setSearchQuery(newQuery);
    },
    [],
  );

  const handleSearch = useCallback(() => {
    router.push(
      `/dashboard/all-design?category=${category}&query=${searchQuery}&page=1`,
    );
  }, [router, category, searchQuery]);

  const categoryName = searchParams.get("category") || "All";
  const query = searchParams.get("query") || "";
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  const { isLoading, data, isError, refetch } = useDashboardArticle({
    page,
    category: categoryName,
    searchQuery: query,
  });

  const handleDelete = async (id: string) => {
    toast.promise(
      fetch(`/api/design/single-design?id=${id}`, { method: "DELETE" }).then(
        (response) => {
          if (!response.ok) throw new Error("Failed to delete the design.");
          refetch();
        },
      ),
      {
        pending: "Deleting design...",
        success: "Design deleted successfully!",
        error: "Failed to delete the design. Please try again.",
      },
    );
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    toast.promise(
      axios
        .patch(`/api/design/single-design?id=${id}`, { status: newStatus })
        .then(() => refetch()),
      {
        pending: "Updating design status...",
        success: "Design status updated successfully!",
        error: "Failed to update design status. Please try again.",
      },
    );
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        document.activeElement === document.getElementById("search-input")
      ) {
        handleSearch();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleSearch]);

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main>
        <BreadCrumb />
        <div className="container md:px-4">
          <div className="mb-6 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="flex flex-1 space-x-2">
              <Select value={category} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {articleCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSearch}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Apply Filter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-1 space-x-2">
              <Input
                id="search-input"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSearch}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search Designs</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6">
              {[...Array(10)].map((_, index) => (
                <DesignSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <DesignMessage message="Something went wrong while fetching the designs." />
          ) : !data?.data || data.data.length === 0 ? (
            <DesignMessage message="No designs available." />
          ) : (
            <AnimatePresence>
              <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {data.data.map((item: articleInterFace) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DesignCard
                      item={item}
                      session={session}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {data?.meta && data.meta.totalPages > 1 && (
            <div className="mx-auto mt-8">
              <PaginationUi
                totalPages={data.meta.totalPages}
                category={category}
                currentPage={page}
                query={searchQuery}
              />
            </div>
          )}
        </div>
        <Footer />
      </main>
    </SidebarProvider>
  );
}

export default function DesignDashboard() {
  return (
    <Suspense fallback={<DesignSkeleton />}>
      <Design />
    </Suspense>
  );
}

"use client";

import Loading from "@/components/helper/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RegistrationImage from "@/image/registration.jpg";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { RegistrationForm } from "./RegistrationForm";

export default function RegistrationPage() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "authenticated") {
    router.replace("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegistrationForm />
      </div>
    </div>
  );
}


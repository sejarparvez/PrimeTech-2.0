import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PopUpProps {
  id: string;
}

export default function PopUp({ id }: PopUpProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    try {
      toast.loading("Please wait for the verification...");
      // Make the verification API call with the entered code
      const response = await axios.put("/api/registration", {
        userId: id,
        verificationCode: verificationCode,
      });

      // Display a toast notification based on the API response
      if (response.status === 200) {
        toast.dismiss();
        toast.success("User verified successfully", { autoClose: 3000 });
        setIsOpen(false);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.dismiss();
        toast.error("Verification code did not match. Please try again.");
      }
    } catch (error) {
      // Handle errors from the verification API call
      toast.dismiss();
      console.error("Error during verification:", error);
      toast.error("Error during verification. Please try again.");
    }
  };
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verification Code</DialogTitle>
          <DialogDescription>
            Please check your email for the verification code. If you do not see
            the verification code in the inbox, please check your spam folder.
          </DialogDescription>
          <DialogDescription>
            Closing this will fail the user creation process.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              className="h-10 rounded-lg border border-primary outline-none"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
          <Button
            type="button"
            size="sm"
            className="px-3"
            onClick={handleVerify}
          >
            Verify
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
      <ToastContainer position="top-center" theme="dark" />
    </Dialog>
  );
}

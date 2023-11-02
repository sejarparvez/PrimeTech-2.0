import EditProfileInput from "@/components/common/input/EditProfileInput";
import EditProfileTextArea from "@/components/common/input/EditProfileTextArea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Form, Formik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

interface props {
  bio: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  github: string;
}

export default function MoreTab({
  bio,
  facebook,
  twitter,
  linkedin,
  instagram,
  github,
}: props) {
  return (
    <Formik
      initialValues={{
        bio: bio,
        facebook: facebook,
        twitter: twitter,
        linkedin: linkedin,
        instagram: instagram,
        github: github,
      }}
      validationSchema={Yup.object({
        bio: Yup.string().max(1000, "Bio must be at most 1000 characters"),
        facebook: Yup.string().matches(
          /^(https?:\/\/)?(www\.)?facebook\.com\/.+/,
          "Invalid Facebook URL",
        ),
        twitter: Yup.string().matches(
          /^(https?:\/\/)?(www\.)?twitter\.com\/.+/,
          "Invalid Twitter URL",
        ),
        instagram: Yup.string().matches(
          /^(https?:\/\/)?(www\.)?instagram\.com\/.+/,
          "Invalid Instagram URL",
        ),
        linkedin: Yup.string().matches(
          /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/,
          "Invalid LinkedIn URL",
        ),
        github: Yup.string().matches(
          /^(https?:\/\/)?(www\.)?github\.com\/.+/,
          "Invalid GitHub URL",
        ),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          // Show loading toast
          toast.loading("Updating profile...", { autoClose: false });

          // Make a PUT request to the server
          await axios.put("/api/editprofile/more", values); // Replace with your actual API endpoint

          // Hide loading toast and display success toast
          toast.dismiss(); // Dismiss the loading toast
          toast.success("Profile updated successfully!");
        } catch (error) {
          // Hide loading toast and display error toast
          toast.dismiss(); // Dismiss the loading toast
          toast.error("Failed to update profile. Please try again.");
          console.error("Error updating profile:", error);
        } finally {
          // Set form submission as complete
          setSubmitting(false);
        }
      }}
    >
      <Form>
        <Card>
          <CardHeader>
            <CardTitle>More Settings</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you&#39;re
              done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="new">Describe Yourself</Label>
              <EditProfileTextArea
                name="bio"
                id="bio"
                defaultValue={bio}
                placeholder="Add a few line about yourself"
              />
            </div>
            <div className="space-y-1">
              <CardTitle>Social Accounts</CardTitle>
              <CardDescription>
                You can add your social media accounts here, so user can easily
                find you.
              </CardDescription>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Facebook</AccordionTrigger>
                  <AccordionContent>
                    <div className="m-1 space-y-1">
                      <EditProfileInput
                        id="facebook"
                        type="text"
                        name="facebook"
                        defaultValue={facebook}
                        placeholder="facebook.com/primetech"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Twitter</AccordionTrigger>
                  <AccordionContent>
                    <div className="m-1 space-y-1">
                      <EditProfileInput
                        id="twitter"
                        type="text"
                        name="twitter"
                        defaultValue={twitter}
                        placeholder="twitter.com/primetech"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Instagram</AccordionTrigger>
                  <AccordionContent>
                    <div className="m-1 space-y-1">
                      <EditProfileInput
                        id="instagram"
                        name="instagram"
                        type="text"
                        defaultValue={instagram}
                        placeholder="instagram.com/primetech"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Linkedin</AccordionTrigger>
                  <AccordionContent>
                    <div className="m-1 space-y-1">
                      <EditProfileInput
                        id="new"
                        name="linkedin"
                        type="text"
                        defaultValue={linkedin}
                        placeholder="linkedin/in/primetech"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Github</AccordionTrigger>
                  <AccordionContent>
                    <div className="m-1 space-y-1">
                      <EditProfileInput
                        id="new"
                        name="github"
                        type="text"
                        defaultValue={github}
                        placeholder="github.com/primetech"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Info</Button>
          </CardFooter>
        </Card>
        <ToastContainer theme="dark" position="top-center" />
      </Form>
    </Formik>
  );
}

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function MoreTab({ bio }: { bio: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>More Settings</CardTitle>
        <CardDescription>
          Make changes to your account here. Click save when you&#39;re done.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="new">Describe Yourself</Label>
          <Textarea
            defaultValue={bio}
            placeholder="Add a few line about yourself"
          />
        </div>
        <div className="space-y-1">
          <CardTitle>Social Accounts</CardTitle>
          <CardDescription>
            You can add your social media accounts here, so user can easily find
            you.
          </CardDescription>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Facebook</AccordionTrigger>
              <AccordionContent>
                <div className="m-1 space-y-1">
                  <Input
                    id="new"
                    type="text"
                    defaultValue=""
                    placeholder="facebook.com/primetech"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Twitter</AccordionTrigger>
              <AccordionContent>
                <div className="m-1 space-y-1">
                  <Input
                    id="new"
                    type="text"
                    defaultValue=""
                    placeholder="twitter.com/primetech"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Instagram</AccordionTrigger>
              <AccordionContent>
                <div className="m-1 space-y-1">
                  <Input
                    id="new"
                    type="text"
                    defaultValue=""
                    placeholder="instagram.com/primetech"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Linkedin</AccordionTrigger>
              <AccordionContent>
                <div className="m-1 space-y-1">
                  <Input
                    id="new"
                    type="text"
                    defaultValue=""
                    placeholder="linkedin/in/primetech"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Github</AccordionTrigger>
              <AccordionContent>
                <div className="m-1 space-y-1">
                  <Input
                    id="new"
                    type="text"
                    defaultValue=""
                    placeholder="github.com/primetech"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save password</Button>
      </CardFooter>
    </Card>
  );
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

export function SocialLinks() {
  return (
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
  );
}

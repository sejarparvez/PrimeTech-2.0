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
import { Textarea } from "@/components/ui/textarea";
import { SocialLinks } from "./SocialLinks";

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

          <SocialLinks />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save password</Button>
      </CardFooter>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewPost() {
  return (
    <div className="mt-28 flex items-center justify-center">
      <Card className="w-10/12">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-3xl">Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Post Title:</Label>
          <Input placeholder="Post Title" type="text" />
          <Input placeholder="Featured Image" type="file" />
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}

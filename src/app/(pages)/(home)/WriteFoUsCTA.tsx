"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WriteForUsCTA() {
  return (
    <div className="container mt-10 md:mt-16">
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="mx-auto flex w-fit flex-col items-center justify-center gap-5 p-4 text-center">
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Want to Share Your Ideas?
          </h1>
          <p className="text-center md:text-lg">
            Join our community of writers and publish your articles for
            thousands to read.
          </p>
          <Button size="lg" variant="secondary">
            Sign Up to Write
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

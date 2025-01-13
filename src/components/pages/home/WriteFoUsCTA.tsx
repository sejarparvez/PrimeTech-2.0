"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WriteForUsCTA() {
  return (
    <div className="container mt-16">
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="mx-auto flex w-fit flex-col items-center justify-center gap-5">
          <h1 className="text-4xl font-extrabold">Want to Share Your Ideas?</h1>
          <p className="text-center text-lg">
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

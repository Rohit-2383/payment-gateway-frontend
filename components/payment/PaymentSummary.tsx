"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MAX_RETRY_ATTEMPTS } from "@/constants/payment";

export function PaymentSummary() {
  return (
    <Card className="ring-1 ring-foreground/10">
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>
          Demo API simulates success, failure, and timeouts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>No network calls in components (hook → utility → API route).</li>
          <li>Retries are capped at {MAX_RETRY_ATTEMPTS} attempts.</li>
        </ul>
      </CardContent>
    </Card>
  );
}


"use client";

import * as React from "react";
import { Controller, type Control } from "react-hook-form";

import { AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { PaymentFormInputValues, PaymentFormValues } from "@/validators/schema";

const UI_TEXT = {
  label: "Cardholder Name",
  placeholder: "Jane Doe",
} as const;

type TextInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "onBlur" | "name" | "ref" | "id"
>;

type PaymentFormControl = Control<PaymentFormInputValues, unknown, PaymentFormValues>;

export type CardholderFieldProps = {
  control: PaymentFormControl;
  id?: string;
  className?: string;
  inputProps?: TextInputProps;
};

export function CardholderField({
  control,
  id,
  className,
  inputProps,
}: CardholderFieldProps) {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  const errorId = `${inputId}-error`;

  return (
    <Controller
      control={control}
      name="cardholderName"
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message;
        const value = typeof field.value === "string" ? field.value : "";

        return (
          <div className={className}>
            <label className="text-sm font-medium" htmlFor={inputId}>
              {UI_TEXT.label}
            </label>
            <div className="mt-1.5">
              <Input
                {...inputProps}
                id={inputId}
                ref={field.ref}
                name={field.name}
                value={value}
                placeholder={UI_TEXT.placeholder}
                autoComplete="cc-name"
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? errorId : undefined}
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            </div>
            {errorMessage ? (
              <p id={errorId} className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                {errorMessage}
              </p>
            ) : null}
          </div>
        );
      }}
    />
  );
}


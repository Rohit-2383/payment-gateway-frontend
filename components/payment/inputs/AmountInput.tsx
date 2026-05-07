"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEFAULT_LABEL = "Amount";
const DEFAULT_PLACEHOLDER = "0.00";
const MAX_DECIMALS = 2;

type InputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "onBlur" | "name" | "ref" | "id"
>;

export type AmountInputProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues = TFieldValues
> = {
  control: Control<TFieldValues, unknown, TTransformedValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  inputProps?: InputProps;
};

function sanitizeAmountInput(value: string): string {
  const cleaned = value.replaceAll(/[^0-9.]/g, "");
  const [integerPart, ...rest] = cleaned.split(".");

  const decimalPart = rest.join("");
  if (rest.length === 0) return integerPart;

  const limitedDecimals = decimalPart.slice(0, MAX_DECIMALS);
  const int = integerPart.length > 0 ? integerPart : "0";
  return `${int}.${limitedDecimals}`;
}

export function AmountInput<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues = TFieldValues
>({
  control,
  name,
  label = DEFAULT_LABEL,
  description,
  placeholder = DEFAULT_PLACEHOLDER,
  id,
  className,
  inputProps,
}: AmountInputProps<TFieldValues, TTransformedValues>) {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message;
        const describedBy = [
          description ? descriptionId : null,
          errorMessage ? errorId : null,
        ]
          .filter(Boolean)
          .join(" ");

        const value = typeof field.value === "string" ? field.value : "";

        return (
          <div className={cn("flex flex-col gap-1.5", className)}>
            <label className="text-sm font-medium" htmlFor={inputId}>
              {label}
            </label>

            {description ? (
              <p id={descriptionId} className="text-xs text-muted-foreground">
                {description}
              </p>
            ) : null}

            <Input
              {...inputProps}
              id={inputId}
              ref={field.ref}
              name={field.name}
              value={value}
              inputMode="decimal"
              autoComplete="transaction-amount"
              placeholder={placeholder}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={describedBy.length > 0 ? describedBy : undefined}
              className={cn("font-mono tabular-nums", inputProps?.className)}
              onBlur={field.onBlur}
              onChange={(event) => {
                const sanitized = sanitizeAmountInput(event.target.value);
                field.onChange(sanitized);
              }}
            />

            {errorMessage ? (
              <p id={errorId} className="flex items-center gap-1 text-xs text-destructive">
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

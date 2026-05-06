"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatCardNumber } from "@/utils/formatters";

const DEFAULT_LABEL = "Card Number";
const DEFAULT_PLACEHOLDER = "1234 5678 9012 3456";

type InputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "onBlur" | "name" | "ref" | "id"
>;

export type CardInputProps<
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

export function CardInput<
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
}: CardInputProps<TFieldValues, TTransformedValues>) {
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
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder={placeholder}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={describedBy.length > 0 ? describedBy : undefined}
              onBlur={field.onBlur}
              onChange={(event) => {
                const formatted = formatCardNumber(event.target.value);
                field.onChange(formatted);
              }}
            />

            {errorMessage ? (
              <p id={errorId} className="text-xs text-destructive">
                {errorMessage}
              </p>
            ) : null}
          </div>
        );
      }}
    />
  );
}


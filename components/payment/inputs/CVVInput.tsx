"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEFAULT_LABEL = "CVV";
const DEFAULT_PLACEHOLDER = "123";
const DEFAULT_MAX_LENGTH = 3;

type InputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "onBlur" | "name" | "ref" | "id" | "maxLength"
>;

export type CVVInputProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues = TFieldValues
> = {
  control: Control<TFieldValues, unknown, TTransformedValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  maxLength?: number;
  id?: string;
  className?: string;
  inputProps?: InputProps;
};

function sanitizeCvv(value: string, maxLength: number): string {
  return value.replaceAll(/\D/g, "").slice(0, maxLength);
}

export function CVVInput<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues = TFieldValues
>({
  control,
  name,
  label = DEFAULT_LABEL,
  description,
  placeholder = DEFAULT_PLACEHOLDER,
  maxLength = DEFAULT_MAX_LENGTH,
  id,
  className,
  inputProps,
}: CVVInputProps<TFieldValues, TTransformedValues>) {
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
              type={inputProps?.type ?? "password"}
              value={value}
              maxLength={maxLength}
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder={placeholder}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={describedBy.length > 0 ? describedBy : undefined}
              className={cn("font-mono tabular-nums", inputProps?.className)}
              onBlur={field.onBlur}
              onChange={(event) => {
                const sanitized = sanitizeCvv(event.target.value, maxLength);
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

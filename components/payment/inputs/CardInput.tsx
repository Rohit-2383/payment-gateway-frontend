"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CARD_TYPES } from "@/constants/cards";
import { CardBrandIcon } from "@/components/payment/card-brand-icons";
import { formatCardNumber } from "@/utils/formatters";
import type { CardType } from "@/types/payment";

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
  cardType?: CardType;
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
  cardType,
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

  const showBadge = cardType !== undefined && cardType !== CARD_TYPES.UNKNOWN;

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
            <label
              className="flex items-center gap-2 text-sm font-medium"
              htmlFor={inputId}
            >
              {label}
              {showBadge && cardType && (
                <CardBrandIcon cardType={cardType} variant="badge" />
              )}
            </label>

            {description ? (
              <p id={descriptionId} className="text-xs text-muted-foreground">
                {description}
              </p>
            ) : null}

            <div className="relative">
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
                className={cn(
                  "font-mono tabular-nums",
                  showBadge && "pr-16",
                  inputProps?.className
                )}
                onBlur={field.onBlur}
                onChange={(event) => {
                  const formatted = formatCardNumber(event.target.value);
                  field.onChange(formatted);
                }}
              />
              {showBadge && cardType && (
                <span
                  className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center"
                  aria-hidden="true"
                >
                  <CardBrandIcon cardType={cardType} variant="badge" />
                </span>
              )}
            </div>

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

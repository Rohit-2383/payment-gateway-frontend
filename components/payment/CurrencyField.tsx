"use client";

import * as React from "react";
import { Controller, type Control } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentFormInputValues, PaymentFormValues } from "@/utils/validators";
import { CURRENCIES } from "@/constants/currencies";

const UI_TEXT = {
  label: "Currency",
} as const;

type PaymentFormControl = Control<PaymentFormInputValues, unknown, PaymentFormValues>;

export type CurrencyFieldProps = {
  control: PaymentFormControl;
  id?: string;
  className?: string;
};

export function CurrencyField({ control, id, className }: CurrencyFieldProps) {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  const errorId = `${inputId}-error`;

  const currencyOptions = React.useMemo(() => Object.values(CURRENCIES), []);

  return (
    <Controller
      control={control}
      name="currency"
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message;
        return (
          <div className={className}>
            <label className="text-sm font-medium" htmlFor={inputId}>
              {UI_TEXT.label}
            </label>
            <div className="mt-1.5">
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={inputId}
                  aria-invalid={Boolean(errorMessage)}
                  aria-describedby={errorMessage ? errorId : undefined}
                  className="w-full"
                >
                  <SelectValue placeholder={UI_TEXT.label} />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errorMessage ? (
              <p id={errorId} className="mt-1.5 text-xs text-destructive">
                {errorMessage}
              </p>
            ) : null}
          </div>
        );
      }}
    />
  );
}


import { z } from "zod";

export const currencySchema = z.enum(["USD", "EUR"]);

export type Currency = z.infer<typeof currencySchema>;

export const Currency = {
  USD: "USD",
  EUR: "EUR",
} as const satisfies Record<string, Currency>;

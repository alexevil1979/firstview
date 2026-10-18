"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/mock-data";

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          FAQ
        </h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Коротко о том, как устроен продукт.
        </p>
      </div>
      <Accordion type="single" collapsible className="mt-10">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem key={item.q} value={`item-${i}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

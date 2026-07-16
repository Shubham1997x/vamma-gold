"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/lib/products";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/navbar";
import { EnquiryDialog } from "@/components/enquiry-dialog";

function specs(product: Product): { label: string; value: string }[] {
  return [
    product.grossWeight && {
      label: "Gross",
      value: `${product.grossWeight.toFixed(3)} g`,
    },
    product.netWeight && {
      label: "Net",
      value: `${product.netWeight.toFixed(3)} g`,
    },
    product.size && { label: "Size", value: product.size },
  ].filter(Boolean) as { label: string; value: string }[];
}

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const reduceMotion = useReducedMotion();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const enquiryText = `Hello ${site.name}, I would like to enquire about ${product.name} (${product.code}).`;
  const whatsappHref = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(enquiryText)}`;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-[0_1px_2px_rgba(43,33,24,0.06)] transition-shadow hover:shadow-[0_10px_30px_rgba(150,116,42,0.18)]"
    >
      <div className="relative aspect-square overflow-hidden bg-ivory-soft">
        <Image
          src={product.image}
          alt={`${product.name} — ${product.code}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
              {product.subcategory}
            </p>
            <p className="text-[11px] font-semibold tracking-[0.12em] text-gold-deep">
              {product.code}
            </p>
          </div>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">
            {product.name}
          </h3>
        </div>

        {/* certificate-style specs, echoing the physical jewellery tag */}
        {specs(product).length > 0 && (
          <div className="border-y border-gold/20 py-2.5">
            <dl className="flex items-center justify-around">
              {specs(product).map((s, i) => (
                <div
                  key={s.label}
                  className={
                    i > 0
                      ? "border-l border-gold/20 pl-5 text-center"
                      : "text-center"
                  }
                >
                  <dt className="text-[9px] font-semibold uppercase tracking-[0.18em] text-clay">
                    {s.label}
                  </dt>
                  <dd className="mt-0.5 font-display text-base font-semibold tabular-nums text-ink">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-auto grid grid-cols-2 gap-2">
          <Button
            variant="gold"
            size="sm"
            className="w-full cursor-pointer"
            onClick={() => setEnquiryOpen(true)}
          >
            Send Enquiry
          </Button>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="sm" className="w-full cursor-pointer">
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </Button>
          </a>
        </div>
      </div>

      <EnquiryDialog
        product={product}
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />
    </motion.article>
  );
}

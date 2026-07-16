"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/products";
import type { Site } from "@/lib/site";
import { Button } from "@/components/ui/button";

const fieldClass =
  "w-full rounded-lg border border-gold/40 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-clay focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold";

export function EnquiryDialog({
  product,
  site,
  open,
  onClose,
}: {
  product: Product;
  site: Site;
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productCode: product.code,
        productName: product.name,
        name,
        phone,
        email: email || undefined,
        message: message || undefined,
      }),
    }).catch(() => null);

    setSubmitting(false);
    if (res?.ok) {
      setSent(true);
    } else {
      setError("Couldn't send your enquiry — please try again or message us on WhatsApp.");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-maroon-deep/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={`Enquiry for ${product.name}`}
            className="w-full max-w-md rounded-2xl border border-gold/30 bg-ivory p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
                  Send Enquiry
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
                  {product.name}
                </h3>
                <p className="text-xs font-semibold tracking-wider text-gold-deep">
                  {product.code}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="cursor-pointer rounded-full p-1.5 text-clay transition-colors hover:bg-ivory-soft hover:text-ink"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {sent ? (
              <div className="mt-6 text-center">
                <p className="font-display text-xl text-ink">Enquiry sent</p>
                <p className="mt-2 text-sm text-clay">
                  We&apos;ve received your enquiry and will get back to you shortly, or
                  message us directly on WhatsApp at {site.whatsappDisplay}.
                </p>
                <Button variant="gold" size="sm" className="mt-5" onClick={onClose}>
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div>
                  <label htmlFor="enq-name" className="mb-1 block text-xs font-semibold text-ink">
                    Your name
                  </label>
                  <input
                    id="enq-name"
                    ref={firstFieldRef}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="enq-phone" className="mb-1 block text-xs font-semibold text-ink">
                    Phone number
                  </label>
                  <input
                    id="enq-phone"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 ..."
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="enq-email" className="mb-1 block text-xs font-semibold text-ink">
                    Email <span className="font-normal text-clay">(optional)</span>
                  </label>
                  <input
                    id="enq-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="enq-message" className="mb-1 block text-xs font-semibold text-ink">
                    Message <span className="font-normal text-clay">(optional)</span>
                  </label>
                  <textarea
                    id="enq-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Preferred size, quantity, or any question"
                    className={fieldClass}
                  />
                </div>
                {error && <p className="text-sm text-red-700">{error}</p>}

                <div className="flex justify-end gap-2 pt-1">
                  <Button type="button" variant="ghost" size="sm" className="text-clay hover:bg-ivory-soft hover:text-ink" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={submitting}>
                    {submitting ? "Sending…" : "Send Enquiry"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

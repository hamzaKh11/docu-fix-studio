import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Replace with your analytics implementation
const trackEvent = (name: string, meta?: Record<string, unknown>) => {
  console.log("ANALYTICS:", name, meta || {});
};

const ASSETS = {
  BAD: "/images/rejected-cv-preview.png",
  GOOD: "/images/optimized-cv-preview.png",
};

const CardBadge: React.FC<{
  tone: "bad" | "good";
  text: string;
}> = ({ tone, text }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${
      tone === "bad"
        ? "bg-red-50 text-red-700 border-red-100"
        : "bg-emerald-50 text-emerald-700 border-emerald-100"
    }`}
  >
    {tone === "bad" ? <X size={16} /> : <Check size={16} />}
    {text}
  </span>
);

const CvShowcase: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<null | {
    src: string;
    tone: "bad" | "good";
  }>(null);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (preview) {
      trackEvent("preview_open", { tone: preview.tone });
      setOpen(true);
    }
  }, [preview]);

  const openPreview = (tone: "bad" | "good") => {
    trackEvent("preview_click", { tone });
    setPreview({ src: tone === "bad" ? ASSETS.BAD : ASSETS.GOOD, tone });
  };

  const closePreview = () => {
    trackEvent("preview_close", { tone: preview?.tone });
    setOpen(false);
    setTimeout(() => setPreview(null), 300);
  };

  // Helper function for keyboard accessibility (DRY)
  const handleCardKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    tone: "bad" | "good"
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPreview(tone);
    }
  };

  return (
    <section
      id="showcase"
      aria-labelledby="showcase-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#FBFBFC] to-white py-20"
    >
      {/* ... (Ambient decorative blobs) ... */}
      <div className="pointer-events-none absolute -left-28 -top-28 w-96 h-96 rounded-full bg-gradient-to-tr from-[#fef3f2] to-transparent opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-24 w-96 h-96 rounded-full bg-gradient-to-bl from-[#ecfdf5] to-transparent opacity-70 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2
            id="showcase-heading"
            className="text-4xl md:text-5xl font-extrabold text-[#0b1220] tracking-tight leading-tight"
          >
            From <span className="text-red-400">Rejected</span> to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-600">
              Hired
            </span>
          </h2>
          <p className="mt-3 text-base md:text-lg text-slate-600">
            Witness the transformation — a CV designed for both ATS and humans.
            Click any card to preview in full.
          </p>
        </div>

        {/* ... (Grid & Cards remain the same) ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* BAD Card (left) */}
          <motion.article
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            onClick={() => openPreview("bad")}
            onKeyDown={(e) => handleCardKeyDown(e, "bad")}
            className="relative rounded-3xl p-6 border border-transparent bg-white shadow-[0_6px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Preview rejected CV"
          >
            <div className="absolute left-6 right-6 -top-6 h-12 rounded-b-2xl bg-gradient-to-b from-[#fff1f0] to-transparent blur-[6px] opacity-95 pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <CardBadge tone="bad" text="REJECTED" />
              <div className="text-xs font-medium text-red-500">
                0.1% Success
              </div>
            </div>

            <div className="mx-auto w-[190px] sm:w-[220px] md:w-[260px] aspect-[8.5/11] rounded-xl overflow-hidden relative border border-slate-100 bg-white">
              <img
                src={ASSETS.BAD}
                alt="Rejected CV preview"
                className="w-full h-full object-cover object-top"
                draggable={false}
                loading="lazy"
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-0 top-0 w-full h-24 bg-gradient-to-b from-[rgba(244,63,94,0.12)] to-transparent"></div>
              </div>
            </div>

            <div className="mt-5 text-center text-sm text-slate-600">
              <p className="max-w-[30ch] mx-auto">
                Cluttered layout, long paragraphs and missing keywords.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs text-slate-500">
              <span className="px-2 py-1 rounded-md bg-red-50 border border-red-100">
                No keywords
              </span>
              <span className="px-2 py-1 rounded-md bg-red-50 border border-red-100">
                Poor spacing
              </span>
            </div>
          </motion.article>

          {/* GOOD Card (right) */}
          <motion.article
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            onClick={() => openPreview("good")}
            onKeyDown={(e) => handleCardKeyDown(e, "good")}
            className="relative rounded-3xl p-6 border border-transparent bg-white shadow-[0_6px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.09)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Preview optimized CV"
          >
            <div className="absolute left-6 right-6 -top-6 h-12 rounded-b-2xl bg-gradient-to-b from-[#ecfdf5] to-transparent blur-[6px] opacity-95 pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <CardBadge tone="good" text="APPROVED" />
              <div className="text-xs font-medium text-emerald-600">
                99.9% Success
              </div>
            </div>

            <div className="mx-auto w-[190px] sm:w-[220px] md:w-[260px] aspect-[8.5/11] rounded-xl overflow-hidden relative border border-slate-100 bg-white">
              <img
                src={ASSETS.GOOD}
                alt="Optimized CV preview"
                className="w-full h-full object-cover object-top"
                draggable={false}
                loading="lazy"
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-0 top-0 w-full h-24 bg-gradient-to-b from-[rgba(16,185,129,0.12)] to-transparent"></div>
              </div>
            </div>

            <div className="mt-5 text-center text-sm text-slate-600">
              <p className="max-w-[36ch] mx-auto">
                Clean sections, strong keywords and measurable results that
                recruiters love.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs text-slate-500">
              <span className="px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100">
                ATS-ready
              </span>
              <span className="px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100">
                Reader friendly
              </span>
            </div>
          </motion.article>
        </div>

        {/* ... (CTA section remains the same) ... */}
        <div className="mt-16 text-center">
          <Button
            asChild
            size="lg"
            className="inline-flex items-center gap-3 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg transition-transform hover:scale-[1.02]"
            onClick={() => trackEvent("cta_click_from_showcase")}
          >
            <Link to="/app">
              Try Your CV Now
              <ArrowRight size={18} />
            </Link>
          </Button>
          <p className="mt-3 text-sm text-slate-500">
            Upload a CV to get instant, actionable feedback.
          </p>
        </div>
      </div>

      {/* Accessible Modal using Headless UI */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={closePreview}
          initialFocus={closeButtonRef}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            {/* هذا الـ div هو حاوية التوسيط. 
              الـ p-4 هنا هو "Gutter" أو هامش الأمان على الهاتف.
            */}
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 scale-95"
              >
                {/* هنا الـ Panel. 
                  w-full يجعله يملأ الحاوية (التي لديها p-4)
                  max-w-4xl يوقفه عن التمدد كثيراً على الشاشات الكبيرة
                */}
                <Dialog.Panel className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        {preview?.tone === "good" ? (
                          <Check size={18} />
                        ) : (
                          <X size={18} />
                        )}
                      </div>
                      <div>
                        <Dialog.Title className="text-base font-semibold text-slate-900 capitalize">
                          {preview?.tone ?? "Preview"} CV
                        </Dialog.Title>
                        <p className="text-sm text-slate-500">
                          {preview?.tone === "good"
                            ? "Optimized Version"
                            : "Original Version"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    ref={closeButtonRef}
                    onClick={closePreview}
                    aria-label="Close preview"
                    className="absolute top-3.5 right-3.5 p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <X size={20} />
                  </button>

                  {/* هنا حاوية الصورة. 
                    p-4 sm:p-6 تعني padding أصغر على الهاتف وأكبر على الحاسوب.
                  */}
                  <div className="p-4 sm:p-6 bg-slate-50 flex justify-center">
                    {preview ? (
                      <img
                        src={preview.src}
                        alt={`Preview ${preview.tone}`}
                        //
                        // ⭐️⭐️⭐️ IMPROVEMENT HERE ⭐️⭐️⭐️
                        // أضفنا 'max-w-full'
                        // هذا يضمن أن الصورة لن تتجاوز عرض حاويتها أبداً
                        //
                        className="max-h-[75vh] w-auto max-w-full object-contain rounded-md shadow-lg"
                      />
                    ) : (
                      <div className="h-40 w-full flex items-center justify-center text-slate-400">
                        No preview
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </section>
  );
};

export default CvShowcase;

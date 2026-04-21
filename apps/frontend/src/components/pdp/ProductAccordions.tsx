'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type AccordionItem = {
  title: string;
  content: React.ReactNode;
};

export default function ProductAccordions({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <div className="border-t border-border mt-8 pt-2">
      {items.map((item, i) => (
        <div key={i} className="border-b border-border">
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between py-5 group"
          >
            <span className="font-display font-bold text-lg text-navy-900 group-hover:text-primary-600 transition-colors">
              {item.title}
            </span>
            <ChevronDown 
              size={20} 
              className={`text-navy-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-primary-500' : ''}`}
            />
          </button>
          
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pb-6 text-sm sm:text-base text-navy-600 leading-relaxed text-balance">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

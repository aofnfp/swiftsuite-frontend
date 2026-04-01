import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const NotificationDetailDrawer = ({
  isOpen,
  headerTop = 90,
  rightOffset = 400,
  width = 560,
  notification,
}) => {
  const contentRef = useRef(null);
  const [measuredH, setMeasuredH] = useState(0);

  useLayoutEffect(() => {
    if (!isOpen || !notification) return;

    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      const maxH = window.innerHeight - headerTop;
      const paddingAndShadow = 0;
      const h = clamp(el.scrollHeight + paddingAndShadow, 1, maxH);
      setMeasuredH(h);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isOpen, notification?.id, headerTop]);

  return (
    <AnimatePresence>
      {isOpen && !!notification && (
        <motion.div
          style={{
            top: headerTop,
            right: rightOffset,
            position: "fixed",
            width,
            height: measuredH ? `${measuredH}px` : "auto",
            willChange: "transform",
          }}
          className="text-white z-[65] bg-[#027840] overflow-hidden rounded-l-lg"
          initial={{ x: width, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: width, opacity: 0 }}
          transition={{ type: "tween", duration: 0.28 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div ref={contentRef} className="px-4 py-4">
            <div
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: notification.message }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDetailDrawer;

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const NotificationDetailDrawer = ({
  isOpen,
  headerTop = 90,
  width = 560,
  notification,
  onCloseDetail,
  isMobile = false,
}) => {
  const contentRef = useRef(null);
  const [measuredH, setMeasuredH] = useState(0);

  useLayoutEffect(() => {
    if (!isOpen || !notification) return;

    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      if (isMobile) {
        const maxH = window.innerHeight * 0.7;
        const h = clamp(el.scrollHeight, 1, maxH);
        setMeasuredH(h);
      } else {
        const maxH = window.innerHeight - headerTop;
        const h = clamp(el.scrollHeight, 1, maxH);
        setMeasuredH(h);
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isOpen, notification?.id, headerTop, isMobile]);

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const handleClose = (e) => {
    e.stopPropagation();
    onCloseDetail();
  };

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && !!notification && (
          <motion.div
            style={{
              bottom: 0,
              left: 0,
              right: 0,
              position: "fixed",
              width: "100%",
              height: measuredH ? `${measuredH}px` : "auto",
              willChange: "transform",
            }}
            className="text-white z-[65] bg-[#027840] overflow-hidden rounded-t-2xl shadow-xl"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={contentRef} className="px-4 py-4 overflow-y-auto max-h-full">
              <div className="mb-4 pb-4 border-b border-white/20 flex justify-between items-start gap-3 sticky top-0 bg-[#027840]">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                    {notification.title}
                  </h2>
                  <div className="text-xs text-white/70">
                    {formatDateTime(notification.sent_at)}
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 text-white hover:bg-white/10 rounded transition-colors duration-150 p-1"
                  aria-label="Close notification"
                >
                  <MdClose size={20} />
                </button>
              </div>

              <div
                className="text-sm leading-relaxed text-white/90"
                dangerouslySetInnerHTML={{ __html: notification.message }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && !!notification && (
        <motion.div
          style={{
            top: headerTop,
            right: 400,
            position: "fixed",
            width,
            height: measuredH ? `${measuredH}px` : "auto",
            willChange: "transform",
          }}
          className="text-white z-[55] bg-[#027840] overflow-hidden rounded-l-lg shadow-xl"
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 560, opacity: 0 }}
          transition={{ type: "tween", duration: 0.28 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div ref={contentRef} className="px-4 py-4">
            <div className="mb-4 pb-4 border-b border-white/20 flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                  {notification.title}
                </h2>
                <div className="text-xs text-white/70">
                  {formatDateTime(notification.sent_at)}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-white hover:bg-white/10 rounded transition-colors duration-150 p-1"
                aria-label="Close notification"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div
              className="text-sm leading-relaxed text-white/90"
              dangerouslySetInnerHTML={{ __html: notification.message }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDetailDrawer;
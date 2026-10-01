import { useEffect, useId, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={titleId}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-[2px] border border-black/10 bg-white p-8 text-black shadow-xl backdrop:bg-black/60"
    >
      <div className="flex items-center justify-between border-b border-black/10 pb-3">
        <h2 id={titleId} className="text-lg font-bold tracking-tight text-black">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="size-8 flex items-center justify-center border border-black/10 font-mono text-xs hover:bg-black hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          ✕
        </button>
      </div>
      <div className="mt-5">{children}</div>
    </dialog>
  );
}

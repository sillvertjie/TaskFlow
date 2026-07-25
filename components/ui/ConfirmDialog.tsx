"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-lg
          border
          bg-background
          p-6
          text-foreground
          shadow-lg
        "
      >
        <h2 className="text-lg font-semibold">{title}</h2>

        <p
          className="
            mt-2
            text-sm
            text-gray-600
            dark:text-gray-300
          "
        >
          {description}
        </p>

        <div
          className="
            mt-6
            flex
            justify-end
            gap-3
          "
        >
          <button
            onClick={onCancel}
            className="
              rounded
              border
              px-3
              py-2
              text-sm
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="
              rounded
              bg-red-600
              px-3
              py-2
              text-sm
              text-white
            "
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

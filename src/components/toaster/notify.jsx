import toast from "react-hot-toast";
import { AlertTriangle, Info } from "lucide-react";

const DEFAULT_MESSAGES = {
  success: "Operation completed successfully.",
  error: "Something went wrong. Please try again.",
  loading: "Processing...",
  info: "Information updated.",
  warning: "Please review before continuing.",
};

const STYLES = {
  warning: {
    style: {
      background: "#e6921e",
      color: "#ffffff",
      border: "1px solid oklch(var(--wa) / 0.5)",
    },
    icon: <AlertTriangle size={16} />,
  },
  info: {
    style: {
      background: "#2664eb",
      color: "#ffffff",
      border: "1px solid oklch(var(--in) / 0.5)",
    },
    icon: <Info size={16} />,
  },
};

const notify = {
  success: (message) => toast.success(message || DEFAULT_MESSAGES.success),

  error: (message) => toast.error(message || DEFAULT_MESSAGES.error),

  loading: (message) => toast.loading(message || DEFAULT_MESSAGES.loading),

  info: (message) => toast(message || DEFAULT_MESSAGES.info, STYLES.info),

  warning: (message) =>
    toast(message || DEFAULT_MESSAGES.warning, STYLES.warning),

  dismiss: (id) => toast.dismiss(id),

  promise: (promise, messages) =>
    toast.promise(promise, {
      loading: messages?.loading || DEFAULT_MESSAGES.loading,
      success: messages?.success || DEFAULT_MESSAGES.success,
      error: messages?.error || DEFAULT_MESSAGES.error,
    }),
};

export default notify;

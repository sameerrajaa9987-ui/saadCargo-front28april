import { toast as sonnerToast } from "sonner";

export const toast = {
  success(message = "Action completed successfully") {
    return sonnerToast.success(message);
  },
  error(message = "Something went wrong") {
    return sonnerToast.error(message);
  },
  info(message: string) {
    return sonnerToast.info(message);
  },
};

import { http, getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";

/**
 * Share a backend-generated document (invoice, bilti) via the user's
 * preferred channel.
 *
 * Strategy:
 *   1. Pull the PDF through the authenticated axios client (auth header gets
 *      attached automatically; bypasses the 401 you'd get from a bare <a>).
 *   2. If the device supports navigator.share with files (modern Android +
 *      iOS Safari), open the native share sheet with the PDF pre-attached —
 *      one tap → WhatsApp → the consignor's chat. This is the path we
 *      optimise for since the user is on a phone at the godown.
 *   3. Otherwise (desktop, older browsers): trigger a download and open
 *      WhatsApp Web/app with a pre-filled message via wa.me. The user then
 *      drags the downloaded PDF into the chat. Two steps, but works.
 */

export type ShareDocumentArgs = {
  /** Authenticated path on the API, e.g. "/invoices/abc/pdf" or "/pods/abc/pdf". */
  path: string;
  /** Desired file name when downloaded or shared. */
  filename: string;
  /** Display title for the share-sheet (Android shows it). */
  title: string;
  /** Plain-text caption pre-filled in WhatsApp / share sheet. */
  message: string;
  /** Optional E.164 mobile (no +, no spaces) for the wa.me deep-link fallback. */
  phone?: string;
};

export async function shareDocument(args: ShareDocumentArgs): Promise<void> {
  const { path, filename, title, message, phone } = args;

  let blob: Blob;
  try {
    const res = await http.get(path, { responseType: "blob" });
    blob = new Blob([res.data], { type: "application/pdf" });
  } catch (err) {
    toast.error(getApiErrorMessage(err));
    return;
  }

  const file = new File([blob], filename, { type: "application/pdf" });

  // Path 1 — native share with files (mobile): one-tap to WhatsApp.
  // canShare may not exist (Safari < 15.4); guard everything.
  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };

  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title, text: message });
      return; // user dismissed or shared — either way, we're done
    } catch (err) {
      // User cancelled the share sheet — that's not an error worth toasting.
      if ((err as DOMException)?.name === "AbortError") return;
      // Otherwise fall through to the download + wa.me fallback.
    }
  }

  // Path 2 — desktop / unsupported: download + open WhatsApp with caption.
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);

  const waBase = phone ? `https://wa.me/${cleanPhone(phone)}` : "https://wa.me/";
  const waUrl = `${waBase}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
  toast.success("PDF downloaded — drag it into the WhatsApp chat that just opened.");
}

/** Strip everything except digits so wa.me accepts it. */
function cleanPhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

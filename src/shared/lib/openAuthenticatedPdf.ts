import { http, getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";

/**
 * Fetch an authenticated PDF endpoint and open it in a new tab.
 *
 * Why this exists: a plain `<a href="/api/foo/pdf" target="_blank">` opens
 * a request the browser handles directly — it never sees the bearer token
 * stored in localStorage and the server returns 401. Going through the
 * authenticated axios client attaches the token, then we open a blob URL.
 */
export async function openAuthenticatedPdf(
  path: string,
  options?: { filename?: string },
): Promise<void> {
  try {
    const res = await http.get(path, { responseType: "blob" });
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      // Popup blocked — fall back to a download
      const a = document.createElement("a");
      a.href = url;
      a.download = options?.filename ?? "document.pdf";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    // Revoke the URL after a delay so the new tab has time to load
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (err) {
    toast.error(getApiErrorMessage(err));
  }
}

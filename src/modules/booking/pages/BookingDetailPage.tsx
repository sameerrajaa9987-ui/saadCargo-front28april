import { useParams } from "react-router-dom";
import { useBooking } from "../hooks/useBookings";
import { formatPKR, formatDateTime } from "@/shared/lib/utils";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  Package,
  Truck,
  FileText,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { http } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading, error } = useBooking(id || "");

  async function downloadInvoice() {
    if (!booking) return;
    try {
      const res = await http.get(`/bookings/${booking.id}/invoice`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${booking.invoiceNumber || booking.bookingId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded successfully");
    } catch {
      toast.error("Failed to download invoice");
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/bookings")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
        <Button onClick={downloadInvoice}>
          <Download className="mr-2 h-4 w-4" />
          Download Invoice
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Booking {booking.bookingId}
        </h1>
        <p className="text-sm text-muted-foreground">
          Created on {formatDateTime(booking.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Invoice Number
                  </p>
                  <p className="text-sm font-semibold">
                    {booking.invoiceNumber || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Booking Type
                  </p>
                  <p className="text-sm">{booking.bookingType}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Parcel Type
                  </p>
                  <p className="text-sm">{booking.parcelType}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Weight
                  </p>
                  <p className="text-sm">{booking.weightKg} kg</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Source Station
                  </p>
                  <p className="text-sm">{booking.sourceStation}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Destination Station
                  </p>
                  <p className="text-sm">{booking.destinationStation}</p>
                </div>
              </div>
              {booking.notes && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Notes
                  </p>
                  <p className="text-sm">{booking.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipment Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Shipment Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Status
                  </p>
                  <StatusBadge status={booking.status} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Payment Status
                  </p>
                  <StatusBadge status={booking.paymentStatus} />
                </div>
              </div>
              {booking.railwayBooking && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Railway Booking
                  </p>
                  <p className="text-sm font-mono">
                    {booking.railwayBooking.label}
                  </p>
                </div>
              )}
              {booking.wagon && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Wagon
                  </p>
                  <p className="text-sm font-mono">{booking.wagon.label}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-accent p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Cost Price
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {formatPKR(booking.costPrice)}
                  </p>
                </div>
                <div className="rounded-lg bg-accent p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Selling Price
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {formatPKR(booking.sellingPrice)}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Profit
                  </p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPKR(booking.profit)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {booking.client ? (
                <>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Name
                    </p>
                    <p className="text-sm font-semibold">
                      {booking.client.label}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No client assigned
                </p>
              )}
            </CardContent>
          </Card>

          {/* Created By */}
          <Card>
            <CardHeader>
              <CardTitle>Created By</CardTitle>
            </CardHeader>
            <CardContent>
              {booking.createdBy ? (
                <p className="text-sm font-semibold">
                  {booking.createdBy.label}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Created At
                </p>
                <p className="text-sm">{formatDateTime(booking.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Updated At
                </p>
                <p className="text-sm">{formatDateTime(booking.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

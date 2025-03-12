import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  CreditCard,
  AlertCircle,
} from "lucide-react";

interface OrderTrackingProps {
  order: any;
}

export default function OrderTracking({ order }: OrderTrackingProps) {
  // Define the tracking steps based on order status
  const steps = [
    {
      id: "pending",
      title: "Order Placed",
      description: "Your order has been received",
      icon: <Package className="h-6 w-6" />,
      date: order.created_at,
      completed: true, // Always completed as the order exists
    },
    {
      id: "payment_confirmed",
      title: "Payment Confirmed",
      description: "Your payment has been verified",
      icon: <CreditCard className="h-6 w-6" />,
      date: order.payment_date,
      completed: [
        "payment_confirmed",
        "shipped",
        "delivered",
        "completed",
      ].includes(order.status),
    },
    {
      id: "shipped",
      title: "Order Shipped",
      description: order.tracking_number
        ? `Tracking: ${order.tracking_number}`
        : "Your order is on the way",
      icon: <Truck className="h-6 w-6" />,
      date: order.shipped_date,
      completed: ["shipped", "delivered", "completed"].includes(order.status),
    },
    {
      id: "delivered",
      title: "Order Delivered",
      description: "Your order has been delivered",
      icon: <CheckCircle className="h-6 w-6" />,
      date: order.delivered_date,
      completed: ["delivered", "completed"].includes(order.status),
    },
  ];

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Pending";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle cancelled orders
  if (order.status === "cancelled") {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" /> Order Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            This order was cancelled on {formatDate(order.updated_at)}.
            {order.cancellation_reason && (
              <span> Reason: {order.cancellation_reason}</span>
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-purple-600" /> Order Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line connecting steps */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex items-start gap-4">
                <div
                  className={`z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${step.completed ? "bg-purple-100" : "bg-gray-100"}`}
                >
                  <span
                    className={
                      step.completed ? "text-purple-600" : "text-gray-400"
                    }
                  >
                    {step.icon}
                  </span>
                </div>
                <div className="flex-1 pt-1.5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h3
                      className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}
                    >
                      {step.title}
                    </h3>
                    <div className="flex items-center mt-1 sm:mt-0">
                      <Clock
                        className={`h-4 w-4 mr-1 ${step.completed ? "text-purple-500" : "text-gray-400"}`}
                      />
                      <span
                        className={`text-sm ${step.completed ? "text-gray-600" : "text-gray-400"}`}
                      >
                        {formatDate(step.date)}
                      </span>
                    </div>
                  </div>
                  <p
                    className={`text-sm mt-1 ${step.completed ? "text-gray-600" : "text-gray-400"}`}
                  >
                    {step.description}
                  </p>

                  {step.id === "shipped" &&
                    step.completed &&
                    order.tracking_number && (
                      <div className="mt-2">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          Tracking: {order.tracking_number}
                        </Badge>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

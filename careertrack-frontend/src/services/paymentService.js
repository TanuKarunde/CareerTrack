
import { apiRequest } from "./api";

export const createPaymentOrder = (plan = "MONTHLY") => {
    return apiRequest(
        `/payments/create-order?plan=${encodeURIComponent(plan)}`,
        {
            method: "POST",
        }
    );
};

export const verifyPayment = (paymentDetails) => {
    return apiRequest("/payments/verify", {
        method: "POST",
        body: JSON.stringify({
            razorpayOrderId: paymentDetails.razorpay_order_id,
            razorpayPaymentId: paymentDetails.razorpay_payment_id,
            razorpaySignature: paymentDetails.razorpay_signature,
        }),
    });
};

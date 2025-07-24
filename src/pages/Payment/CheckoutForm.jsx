import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const CheckoutForm = ({ session }) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const amountInCents = Math.round(parseFloat(session.registrationFee) * 100); // convert to cents

    try {
      // Show loading while creating payment intent
      Swal.fire({
        title: "Processing Payment...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const { data } = await axiosInstance.post(
        "/api/payments/create-payment-intent",
        {
          registrationFee: amountInCents,
        }
      );

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        await Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: result.error.message,
        });
      } else if (result.paymentIntent.status === "succeeded") {
        await Swal.fire({
          icon: "success",
          title: "✅ Payment Successful!",
          text: "Your session is being booked...",
          showConfirmButton: false,
          timer: 1500,
        });

        // ⏳ Booking request
        const response = await axiosInstance.post(
          "/api/paid-sessions/booking",
          {
            paymentIntentId: result.paymentIntent.id,
            sessionId: session._id,
            studentEmail: user?.email,
            studentName: user?.displayName,
            tutorEmail: session.tutorEmail,
            tutorName: session.tutorName,
            registrationFee: session.registrationFee,
            sessionTitle: session.title,
            classStart: session.classStart,
            classEnd: session.classEnd,
          }
        );

        if (response.status !== 201) {
          await Swal.fire({
            icon: "error",
            title: "Booking Failed",
            text: "Payment succeeded, but booking failed. Please contact support.",
          });
        } else {
          await Swal.fire({
            icon: "success",
            title: "🎉 Session Booked!",
            text: "You can view it in your dashboard.",
            timer: 2000,
            showConfirmButton: false,
          });

          navigate("/dashboard/booked-sessions");
        }
      }
    } catch (error) {
      console.error("Payment error:", error.message);

      await Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: error.message || "Something went wrong during payment.",
      });
    }

    setProcessing(false);
  };

  const CARD_OPTIONS = {
    style: {
      base: {
        fontSize: "18px",
        color: "#32325d",
        letterSpacing: "0.025em",
        fontFamily: "Segoe UI, sans-serif",
        "::placeholder": {
          color: "#a0aec0",
        },
      },
      invalid: {
        color: "#e53e3e",
      },
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        💳 Enter Your Card Details
      </h2>

      <div className="p-4 border border-gray-300 rounded-xl bg-gray-50">
        <CardElement options={CARD_OPTIONS} />
      </div>

      <button
        className="btn btn-primary w-full mt-6"
        type="submit"
        disabled={!stripe || processing}
      >
        {processing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

export default CheckoutForm;

// PaymentPage.jsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router";
import CheckoutForm from "./CheckoutForm";

// ✅ Load Stripe outside the component (best practice)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const location = useLocation();
  const { session } = location.state || {};

  if (!parseFloat(session.registrationFee)) {
    return (
      <div className="text-center text-red-500">Invalid payment request.</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2>
        <span className="text-2xl font-serif font-semibold mb-4 underline">
          Pay for:
        </span>{" "}
        <span className="text-2xl font-serif">{session.title}</span>
      </h2>
      <p className="mb-4">
        Registration Fee: <strong>${session.registrationFee}</strong>
      </p>

      <Elements stripe={stripePromise}>
        <CheckoutForm session={session} />
      </Elements>
    </div>
  );
};

export default PaymentPage;

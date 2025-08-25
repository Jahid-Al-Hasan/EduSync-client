import { CreditCard, Shield, Lock, CheckCircle, Zap } from "lucide-react";

const PaymentInstruction = () => {
  const paymentFeatures = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Level Security",
      description:
        "Your payment information is encrypted and secure. We never store your card details on our servers.",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "PCI Compliant",
      description:
        "Stripe is certified PCI Service Provider Level 1, the most stringent certification in the industry.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Processing",
      description:
        "Payments are processed instantly. Get immediate confirmation and access to your booked sessions.",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Money-Back Guarantee",
      description:
        "Unsatisfied with a session? We offer a 24-hour refund policy for all paid sessions.",
    },
  ];

  const paymentSteps = [
    {
      step: 1,
      title: "Select Session",
      description: "Choose your preferred study session and click 'Book Now'",
    },
    {
      step: 2,
      title: "Enter Payment Details",
      description:
        "Securely enter your card information in the Stripe payment form",
    },
    {
      step: 3,
      title: "Instant Confirmation",
      description: "Receive immediate payment confirmation and session access",
    },
    {
      step: 4,
      title: "Start Learning",
      description: "Join your session and begin your learning journey",
    },
  ];

  return (
    <section id="payment-guide" className=" py-16 px-4 lg:px-0 bg-base-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Secure Payment Processing
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            We use Stripe, a globally trusted payment platform, to ensure your
            transactions are safe, secure, and hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Payment Steps */}
          <div>
            <h3 className="text-2xl font-bold mb-8">How to Pay</h3>
            <div className="space-y-6">
              {paymentSteps.map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary text-primary-content rounded-full flex items-center justify-center text-lg font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                    <p className="opacity-80">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Features */}
          <div>
            <h3 className="text-2xl font-bold mb-8">
              Why Your Payment is Safe
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentFeatures.map((feature, index) => (
                <div key={index} className="card bg-base-200 p-6">
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm opacity-80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Payment FAQs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-base-200 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">
                Is my card information safe?
              </h4>
              <p className="text-sm opacity-80">
                Yes! We use Stripe, which is PCI DSS compliant. Your card
                details are never stored on our servers.
              </p>
            </div>
            <div className="bg-base-200 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">Can I get a refund?</h4>
              <p className="text-sm opacity-80">
                Absolutely. We offer a 24-hour refund policy for all paid
                sessions if you're not satisfied.
              </p>
            </div>
            <div className="bg-base-200 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">
                Do you accept digital wallets?
              </h4>
              <p className="text-sm opacity-80">
                Currently, we support credit/debit cards. Digital wallet support
                is coming soon!
              </p>
            </div>
            <div className="bg-base-200 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">When will I be charged?</h4>
              <p className="text-sm opacity-80">
                Payment is processed immediately upon booking confirmation for
                paid sessions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentInstruction;

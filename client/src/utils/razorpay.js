export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount) => {
  // Convert amount to paise (multiply by 100)
  // const amountInPaise = Math.round(amount);
  
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/razorpay/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: amount }),
  });
  return response.json();
};

export const verifyRazorpayPayment = async (paymentData) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/razorpay/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });
  return response.json();
};

export const initializeRazorpayPayment = ({
  orderData,
  keyId,
  userData,
  onSuccess,
  onError
}) => {
  const options = {
    key: keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: "Green Grocer",
    description: "Payment for your order",
    order_id: orderData.id,
    handler: async function (response) {
      try {
        const verifyData = await verifyRazorpayPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        
        if (verifyData.verified) {
          onSuccess({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id
          });
        } else {
          onError(new Error('Payment verification failed'));
        }
      } catch (error) {
        onError(error);
      }
    },
    prefill: {
      name: userData?.name || "",
      email: userData?.email || "",
    },
    theme: {
      color: "#0bc175",
    },
    modal: {
      ondismiss: function() {
        // alert("Payment cancelled. You can try again when you're ready!");
      },
      escape: false,
      confirm_close: true,
      handleback: true,
    },
    retry: {
      enabled: false,
      max_count: 0,
    },
  };

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.on('payment.failed', function (response) {
    onError(response.error);
  });
  razorpayInstance.open();
};

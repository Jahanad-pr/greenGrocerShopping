import React, { useEffect, useState } from 'react';
import roz from '../../../../../assets/images/unnamed.png'
import coin from '../../../../../assets/images/gCoin.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { usePlaceOrderMutation, useUpdateOrderStatusMutation } from '../../../../../services/User/userApi';
import { toast } from 'react-hot-toast';
import { loadRazorpayScript, createRazorpayOrder, initializeRazorpayPayment } from '../../../../../utils/razorpay';
import { showToast,Tostify } from '../../../../parts/Toast/Tostify';
import HoverKing from '../../../../parts/buttons/HoverKing';

const OrderPayment = ({userData}) => {
  
  const [updateOrderStatus, { data: statusData }] =
  useUpdateOrderStatusMutation();
  const [placeOrder, { error, data }] = usePlaceOrderMutation();

  const [selectedMethod, setSelectedMethod] = useState('Razorpay');
  const [currentData, setCurrentData] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(false);

  const location = useLocation()
  const navigator = useNavigate()

  useEffect(() => {
    if(data){
      navigator('/user/success',{ state: { data:{...data,...location.state.add} } }) 
    } 
  }, [data])

  useEffect(() =>{
    if(statusData){ navigator('/user/success'),{ state: { data:{...data,...location.state.add} } } } 
  }, [statusData])

  useEffect(() => {
    if(location?.state?.order){
      console.log("Order data:", location.state.order);
      setCurrentData(location.state.order)
    }
  }, [location])

  const updateOrdersStatus = (statusData) => {
    updateOrderStatus(statusData).unwrap();
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsLoading(true);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load');
        return;
      }

      const orderData = await createRazorpayOrder(currentData.price);

      initializeRazorpayPayment({
        orderData,
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
        userData,
        onSuccess: async (paymentDetails) => {
          if(!location?.state?.retry){
            const orderData = {
              user: userData._id,
              delivery_address: currentData.address,
              payment_method: selectedMethod,
              coupon: currentData.coupon,
              items: currentData.items,
              price: {
                grandPrice: currentData.price,
                discountPrice: currentData.offerPrice,
                others:{
                  tax:location.state.add.taxes,
                  delivery:location.state.add.deliveryFee,
                  totel:location.state.add.totelProducts,
                }
              },
              order_id: generateOrderId(),
              time: Date.now(),
              total_quantity: currentData.items?.reduce((acc, data) => acc += data.quantity, 0),
              order_status: 'Processed',
              payment_status: 'completed',
              razorpay_payment_id: paymentDetails.razorpay_payment_id,
              razorpay_order_id: paymentDetails.razorpay_order_id
            };

            setOrderData(orderData)
  
            await placeOrder(orderData).unwrap();
            toast.success('Payment successful! Order placed.')

            navigator('/user/success',{ state: { data:{...orderData,...location.state.add} } });

          }else{
            updateOrdersStatus({
              id: location.state._id,
              value: 'Processed',
              // index,
            })
            // alert('payment success')
          }
        },
        onError: async(error) => {
          if(!location?.state?.retry){
          console.error('Payment error:', error);
          toast.error('Payment failed');
          const orderData = {
            user: userData._id,
            delivery_address: currentData.address,
            payment_method: selectedMethod,
            coupon: currentData.coupon,
            items: currentData.items,
            price: {
              grandPrice: currentData.price,
              discountPrice: currentData.offerPrice,
              others:{
                tax:location.state.add.taxes,
                delivery:location.state.add.deliveryFee,
                totel:location.state.add.totelProducts,
              }
            },
            order_id: generateOrderId(),
            time: Date.now(),
            total_quantity: currentData.items?.reduce((acc, data) => acc += data.quantity, 0),
            order_status: 'Pending',
            payment_status: 'pending',
            razorpay_payment_id: error?.metadata?.payment_id,
            razorpay_order_id: error?.metadata?.payment_id
          };
          setOrderData(orderData)
          await placeOrder(orderData).unwrap();
          toast.success('Payment filed! Order placed.');
          }else{
            showToast('payment failed','error')
          }
        }
      });
    } catch (error) {
      console.error('Razorpay payment error:', error);
      toast.error('Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const placeOrders = async () => {
    try {
      setIsLoading(true);
      
      if (selectedMethod === 'Razorpay') {
        await handleRazorpayPayment();
        return;
      }

      const orderData = {
        user: userData._id,
        delivery_address: currentData.address,
        payment_method: selectedMethod,
        coupon: currentData.coupon,
        items: currentData.items,
        price: {
          grandPrice: currentData.price,
          discountPrice: currentData.offerPrice,
          others:{
            tax:location.state.add.taxes,
            delivery:location.state.add.deliveryFee,
            totel:location.state.add.totelProducts,
          }
        },
        order_id: generateOrderId(),
        time: Date.now(),
        total_quantity: currentData.items?.reduce((acc, data) => acc += data.quantity, 0),
        order_status: 'Processed',
        payment_status: selectedMethod === 'Cash on Delivery' ? 'pending' : 'completed',
      };

      setOrderData(orderData)
      await placeOrder(orderData).unwrap();
      toast.success('Order placed successfully!');
      navigator('/user/success');
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethods = [
    // {
    //   id: 'UPI',
    //   name: 'UPI',
    //   icon: <img src={upi} alt="UPI" />,
    // },
    // {
    //   id: 'Net Banking',
    //   name: 'Net Banking',
    //   icon: <img src={netb} alt="Net Banking" />,
    // },
    {
      id: 'Razorpay',
      name: 'Razorpay',
      icon: <img className='w-40 h-40 object-cover' src={roz} alt="Razorpay" />,
    },
    // {
    //   id: 'Credit / Debit Card',
    //   name: 'Credit / Debit Card',
    //   icon: <img src={deb} alt="Card" />,
    // },
    { 
      id: 'Cash on Delivery',
      name: 'Cash on Delivery',
      icon: <img className='w-40 h-40 object-cover' src={'/box.svg'} alt="COD" />,
    },
    {
      id: 'Coin Wallet',
      name: 'Coin',
      icon: <img className='w-40 h-40 object-cover' src={coin} alt="Coin" />,
    },
  ];

  const generateOrderId = (length = 6) => {
    // Get the current timestamp
    const timestamp = Date.now().toString(); // Current time in milliseconds since Jan 1, 1970
    
    // Define the character set: uppercase letters and digits
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';

    // Generate the random part of the order ID
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomPart += characters[randomIndex];
    }

    // Combine timestamp and random part
    const orderId = `${timestamp}-${randomPart}`;
    return orderId;
  }

  return (
    <>
    <Tostify />
    <div className="md:max-w-[96%] w-full mx-auto bg-[#f2f2f2]">
      <div className="w-full h-full px-10 md:px-20 xl:px-40 overflow-scroll pb-60">
        <h1 onClick={()=>console.log(currentData.price)} className="text-[35px] font-bold mb-12">Payment</h1>

        <span className='inline-flex gap-12 flex-col lg:flex-row'>

        {/* Payment amount */}
        <div className="mb-8">

          <p className="text-[28px] font-bold ">Payment totel</p>
          <p className="text-[13px] opacity-45 mb-8">The payment you want to pay for this order <br />
          Ensure the details are correct</p>
          <div className="bg-gradient-to-b from-[#dcdcdc90] to-[#d9d9d970] px-16 py-8 rounded-[30px] rounded-br-[120px] inline-block">
            <div className="text-3xl font-bold text-green-700 font-mono">₹{currentData.price}</div>
            <div className="text-gray-400 text-[13px] font-medium">Grand Total</div>
          </div>
        </div>

         {/* deal informations */}
        <span className="flex flex-col">
          <p className="text-[28px] font-bold">Deal info</p>
          <p className="text-[13px] opacity-40 mb-8 max-w-[400px]">May happen slight changes according to your distunse the products</p>
        

          <span className="flex gap-16 text-[13px] items-center justify-between">
            <p className="text-[13px]">Arrive date</p>
            <p  className="opacity-65">{new Date().toDateString()}</p>
          </span>

          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Arrive time</p>
            <p  className="opacity-65">{new Date().toLocaleTimeString()}</p>
          </span>

          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Distens</p>
            <p  className="opacity-65">10</p>
          </span>

          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Duration</p>
            <p  className="opacity-65">3 Hourse</p>
          </span>

          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Cancel until</p>
            <p  className="opacity-65">Shipping</p>
          </span>
          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Return period</p>
            <p  className="opacity-65">24 hourse</p>
          </span>

          </span>

        </span>


        {/* Payment method selection */}
        <div className="mb-8">
          <p className="text-[28px] font-bold leading-none mt-20">Payment Method</p>
          <p className="text-[13px] opacity-45 mb-12">Choose the payment methode to place order</p>
          <div className="flex gap-4 flex-wrap">
              {paymentMethods.map((method) => (
                (method.name !== 'Cash on Delivery' || currentData.price <= 1000) &&
                (!location?.state?.retry || method.name === 'Razorpay') &&
                <div
                  key={method.id}
                  className={`
                  flex flex-col items-center p-6 min-w-[250px] justify-center rounded-[30px] pb-8 rounded-br-[120px] border-2 cursor-pointer transition-all relative
                  ${selectedMethod === method.id
                      ? 'border-[#6e827690] bg-[#6e827630]'
                      : 'border-gray-200 hover:border-gray-300'
                    } 
                `}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center absolute top-5 left-5
                      ${selectedMethod === method.id
                          ? 'border-[#6e8276]'
                          : 'border-gray-300'
                        }
                    `}
                    >
                      {selectedMethod === method.id && (
                        <div className="w-2 h-2 rounded-full bg-[#6e8276]" />
                      )}
                    </div>
                    {method.icon}
                  </div>
                  {
                    <div className={`text-[13px] pr-8 font-medium opacity-45 ${method.id === 'Cash on Delivery'&& '' }  ${method.name === 'Coin'&& 'translate-y-2' }`}>{method.name}</div>
                  }
                </div>
              ))}
          </div>
        </div>

        <span className='relative'>
        <HoverKing
                event={placeOrders} 
                // event={()=>navigate('/user/profile/address', { state: { items: location?.state?.items } })} 
                styles={'absolute border-0 left-0 rounded-full bg-[linear-gradient(to_left,#0bc175,#0f45ff)] font-bold'} 
                Icon={<i className="ri-arrow-right-line text-[30px] rounded-full text-white"></i>}
              >
              {isLoading ? 'Processing...' :selectedMethod==='Cash on Delivery'?'Place order':'Pay'}
              </HoverKing>
        </span>

      

      </div>
    </div>
    </>
  );
};

export default OrderPayment;
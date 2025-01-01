import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatedTooltip } from '../main/ui/AnimatedTooltip'
import { Timeline } from "../main/ui/Timeline"
import { motion } from 'framer-motion'
import HoverKing from '../../../parts/buttons/HoverKing'
import DeletePopup from '../../../parts/popups/DeletePopup'
import { useCancelOrderMutation, useReturnOrderMutation } from '../../../../services/User/userApi'

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@";
const NUMBER_CHARS = "0123456789";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;

const TextScramble = ({ text }) => {
    const [scrambledText, setScrambledText] = useState(text);
    const intervalRef = useRef(null);
    
    useEffect(() => {
        let pos = 0;
        
        intervalRef.current = setInterval(() => {
            const scrambled = text.split("")
                .map((char, index) => {
                    if (pos / CYCLES_PER_LETTER > index) {
                        return char;
                    }
                    if (char === ' ') return ' ';
                    const randomCharIndex = Math.floor(Math.random() * CHARS.length);
                    const randomChar = CHARS[randomCharIndex];
                    return randomChar;
                })
                .join("");
            
            setScrambledText(scrambled);
            pos++;
            
            if (pos >= text.length * CYCLES_PER_LETTER) {
                clearInterval(intervalRef.current);
                setScrambledText(text);
            }
        }, SHUFFLE_TIME);
        
        return () => clearInterval(intervalRef.current);
    }, [text]);
    
    return (
        <span style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
            {scrambledText}
        </span>
    );
};

const NumberScramble = ({ number }) => {
    const [scrambledText, setScrambledText] = useState(number.toString());
    const intervalRef = useRef(null);
    
    useEffect(() => {
        let pos = 0;
        const text = number.toString();
        
        intervalRef.current = setInterval(() => {
            const scrambled = text.split("")
                .map((char, index) => {
                    if (pos / CYCLES_PER_LETTER > index) {
                        return char;
                    }
                    if (char === '.' || char === ',') return char;
                    const randomCharIndex = Math.floor(Math.random() * NUMBER_CHARS.length);
                    const randomChar = NUMBER_CHARS[randomCharIndex];
                    return randomChar;
                })
                .join("");
            
            setScrambledText(scrambled);
            pos++;
            
            if (pos >= text.length * CYCLES_PER_LETTER) {
                clearInterval(intervalRef.current);
                setScrambledText(text);
            }
        }, SHUFFLE_TIME);
        
        return () => clearInterval(intervalRef.current);
    }, [number]);
    
    return (
        <span style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
            {scrambledText}
        </span>
    );
};

const formatDate = (dateString) => {
    try {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        return new Intl.DateTimeFormat('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Invalid Date';
    }
};

export default function OrderDetails({userData}) {

    const [cancelOrder, { data: cancelData }] = useCancelOrderMutation();
    const [returnOrder, { data: returnData }] = useReturnOrderMutation();

    const [currentPosition, setCurrentPosition] = useState(1)
    const [popOwner,setPopOwner] = useState('cancel')
    const [deleteData, setDeleteData] = useState(null);
    const [limit, setLimit] = useState(0)
    const [crrentOrder, setCreentOrder] = useState([])
    const [orderStatus, setOrderStatus] = useState('')
    const [popup, showPopup] = useState(false);


    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (location.state) {
            setCreentOrder(location.state)
            setOrderStatus(location.state?.order_status)
            setLimit(location.state?.items?.length)
        }
    }, [location])

    useEffect(()=>{
        if(cancelData){
            setOrderStatus('Cancelled')
        }
    },[cancelData])

    // cancel Order
    const handleCancel = (id, index) => {
        setPopOwner('cancel')
        setDeleteData({ id, index });
        showPopup(true);
    };


    // return Order
    const handleReturn = (id, index) => {
        setPopOwner('return')
        setDeleteData({ id, index });
        showPopup(true);
    };



    return (
        <>
        {popup && (
        <DeletePopup
        updater={popOwner==='cancel'?cancelOrder:returnOrder}
        deleteData={deleteData}
        showPopup={showPopup}
        action={popOwner==='cancel'?"Cancel order":"Return order"}
        isUser={true}
        />
        )}
        <motion.div 
            initial={{ opacity: 1, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className='md:w-[94%] bg-product overflow-scroll'
        >
            <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-[#5a52319c] mix-blend-screen backdrop-blur-3xl absolute w-[90%] h-full"
            />
            <div className="w-full 2xl:h-full backdrop-blur-3xl">
                <motion.div 
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="w-full mx-auto 2xl:px-20 px-12 h-[70%] lg:flex pt-6"
                >
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="lg:w-[20%] flex flex-col gap-1"
                    >
                        {crrentOrder.items &&
                            <>
                                <motion.p 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    onClick={() => console.log(crrentOrder?.items[currentPosition - 1]?.product?.salePrice)} 
                                    className='text-[45px] leading-none'
                                >
                                    <TextScramble text={crrentOrder?.items[currentPosition - 1]?.product?.name || ''} />
                                </motion.p>
                                <motion.p 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: .5 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className='text-[25px] leading-none opacity-0'
                                >
                                    <TextScramble text={crrentOrder?.items[currentPosition - 1]?.product?.description || ''} />
                                </motion.p>
                                <motion.p 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    className='opacity-65'
                                >
                                    Product from : {crrentOrder?.items[currentPosition - 1]?.product?.from}
                                </motion.p>
                                <motion.p 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className='text-[20px] opacity-45'
                                >
                                    {crrentOrder?.items[currentPosition - 1]?.quantity / (crrentOrder?.items[currentPosition - 1]?.quantity >= 1000 ? 1000 : 1)}
                                    {crrentOrder?.items[currentPosition - 1]?.quantity >= 1000 ? 'Kg' : 'g'}
                                </motion.p>
                            </>
                        }
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            className="flex w-full flex-wrap mt-8"
                        >
                            {crrentOrder?.items && <AnimatedTooltip setCurrentPosition={setCurrentPosition} items={crrentOrder?.items} />}
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="w-[60%] flex items-center flex-col"
                    >
                        <div style={{ transform: `translateX(-${100 * (currentPosition - 1)}%)` }} className={`w-full flex-1 flex items-center duration-1000`}>
                            {crrentOrder.items?.map((data, index) => (
                                <span key={index} className='min-w-[100%] flex justify-center'>
                                    <img 
                                    layoutId='id'
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                        style={{ transform: `translateY(-${Math.abs((currentPosition - (index + 1)) * 100)}px)` }} 
                                        className={`w-60 h-60 duration-500 object-cover`} 
                                        src={data.product.pics.one} 
                                        alt="" 
                                    />
                                    <img 
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                        className={`px-60 shadower ${currentPosition == index + 1 ? 'opacity-40' : 'opacity-0'} duration-500 absolute`} 
                                        src={data.product.pics.one} 
                                        alt="" 
                                    />
                                </span>
                            ))}
                        </div>
                        
                        {crrentOrder.items?.length > 1 &&
                            <div className="w-24 h-12 bg-gray-200 text-[30px] flex items-center justify-center rounded-full z-10">
                                <i style={{ opacity: currentPosition === 1 ? 0.2 : 1 }} onClick={() => setCurrentPosition(currentPosition > 1 ? currentPosition - 1 : currentPosition)} className="ri-arrow-left-s-fill duration-500"></i>
                                <i style={{ opacity: currentPosition === limit ? 0.5 : 1 }} onClick={() => setCurrentPosition(currentPosition < limit ? currentPosition + 1 : currentPosition)} className="ri-arrow-right-s-fill duration-500"></i>
                            </div>
                        }
                    </motion.div>


                    {crrentOrder.items &&
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="lg:w-[20%] flex lg:flex-col gap-1 relative pb-20 mt-14 lg:mt-0"
                        >
                            <span className='flex flex-col min-w-[50%] lg:min-w-[auto]'>

                            <span className='items-end gap-6'>
                                <motion.s 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                >
                                    <p className='text-[30px] leading-none opacity-45'>
                                        ₹ <NumberScramble number={(crrentOrder?.items[currentPosition - 1]?.quantity / 1000) * crrentOrder?.items[currentPosition - 1]?.product?.regularPrice} />
                                    </p>
                                </motion.s>
                                <motion.p 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className='text-[50px] leading-none font-bold'
                                >
                                    ₹ <NumberScramble number={(crrentOrder?.items[currentPosition - 1]?.quantity / 1000) * crrentOrder?.items[currentPosition - 1]?.product?.salePrice} />
                                </motion.p>


                            </span>
                                <span className='h-'></span>

                                <p className='text-[25px] capitalize'>{crrentOrder?.items[currentPosition - 1]?.product?.freshness}</p>
                                {  crrentOrder?.items[currentPosition - 1]?.product?.freshness==='Harvested' &&
                                <>
                                <p className='opacity-45 leading-none'>Harvested on:</p>
                                <p className='leading-none'>{formatDate(crrentOrder?.items[currentPosition - 1]?.product?.harvestedTime)}</p>
                                </>
                                
                                }
                                { crrentOrder?.items[currentPosition - 1]?.product?.freshness.toLowerCase()==='fresh' &&
                                    <p className='leading-none opacity-45 mt-2'>Once the customer confirms their order, the wood is cut specifically for that piece. This approach minimizes waste and ensures fresh, custom-prepared material for every order.</p>
                                    
                                }

                                <p className='text-[25px] mt-3 mb-2 '>Address</p>
                                <span className='opacity-65 leading-tight pr-10 font-mono'>

                                <p className=''>{crrentOrder?.delivery_address?.locationType} {crrentOrder?.delivery_address?.exactAddress}</p>
                                <p className=''>{crrentOrder?.delivery_address?.streetAddress}</p>
                                <p className=''>{crrentOrder?.delivery_address?.city?.toUpperCase()}, {'KERALA'}, {crrentOrder?.delivery_address?.pincode}</p>
                                </span>
                            { orderStatus!=='Cancelled' && orderStatus!=='Delivered' && orderStatus!=='Shipped' &&  
                            <div className=''>
                                <HoverKing event={()=>handleCancel(crrentOrder?._id, currentPosition)} styles={'absolute right-0 bottom-0 rounded-full border-0'} redish={true} Icon={<i className="ri-close-circle-line text-[30px] text-[white] rounded-full"></i>} >Cancel order</HoverKing>
                            </div>
                            }
                            </span>

                                {orderStatus === 'Delivered' &&
                                    <HoverKing event={() => handleReturn(crrentOrder?._id, currentPosition)} styles={'absolute bottom-24 rounded-full border-0'} redish={true} Icon={<i className="ri-arrow-go-back-line text-[30px] text-[white] rounded-full"></i>} >Return order</HoverKing>}

                                    <span className='flex flex-col'>
                                    
                                { orderStatus === 'Shipped' && 
                                <div className='flex flex-col gap-2'>
                                    <h1 className='text-[25px] leading-none'>Delivery Alert</h1>
                                    <p className='opacity-45 leading-tight'>
                                        Your order is out for delivery. Make sure to check your email for updates on your order status. If you have any concerns or questions, please feel free to reach out to us.
                                    </p>
                                </div>
                                }
                                { orderStatus !== 'Shipped' && orderStatus !== 'Delivered' &&
                                <div className='flex flex-col gap-2'>
                                    <h1 className='text-[25px] mt-5 leading-none '>Delivery Alert</h1>
                                    <p className='opacity-45 leading-tight'>
                                        Your order is yet to be shipped. Make sure to check your email for updates on your order status. If you have any concerns or questions, please feel free to reach out to us.
                                    </p>
                                </div>
                                }



                                <span className='flex items-center gap-6'>
                                <button onClick={() => navigate('/user/Order/Invoice', { state: { norma:true, data: crrentOrder } })} className=' flex justify-start group items-center font-bold rounded-full text-white my-4 bottom-0 right-3 bg-[linear-gradient(#b4c2ba,#789985)] overflow-hidden w-[70px] h-[70px] hover:scale-125 duration-500 group'>
                                    <i className="ri-article-line font-thin rounded-full min-w-[70px] text-[25px]  group-hover:-translate-x-full duration-500"></i>
                                    <i className="ri-arrow-right-line rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>
                                </button>
                                <p className='text-[20px] leading-none font-["lufga"]'>See the <br /> Invoice</p>
                                </span>
                                    </span>

                            <span className='flex-1'></span>
                            

                        </motion.div>
                    }
                </motion.div>  


                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="w-full h-[30%] lg:p-12 bg-[#792e2e00]"
                >
                    <div className="w-full h-full 2xl:flex xl:p-10 mt-10 lg:mt-0 justify-center items-center pb-40 lg:pb-0">
                        <motion.span 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className={`min-w-[300px] relative ${orderStatus === 'Pending' ?'pb-16':''} flex flex-col gap-2 2xl:gap-0 items-center justify-center 2xl:justify-normal py-8 2xl:py-0`}
                        >
                            <p onClick={()=>alert(orderStatus)} className='opacity-50 '>Order payment Method & Date</p>
                            <span className='text-[20px] font-bold'>
                                <span>
                                    {crrentOrder?.payment_method} : <span className={`${crrentOrder?.payment_status === 'completed' ? 'text-green-600' : crrentOrder?.payment_status === 'pending' ? 'text-orange-500' : 'text-red-500'}`}>
                                        {orderStatus==='cancelled' ? '':crrentOrder?.payment_status}</span>
                                </span>
                                <span className='opacity-75'>
                                <br></br>
                                    {formatDate(crrentOrder?.time)}
                                </span>
                            </span>
                            <p className='opacity-50'>Delivery ship to customer : </p>
                            <span className='text-[20px] font-bold'>
                                {crrentOrder?.delivery_address?.FirstName} {crrentOrder?.delivery_address?.LastName}
                            </span>
                            
                            { orderStatus === 'Pending' &&
                                // <p className='bg-green-500 px-10 py-2 mt-7 inline-block rounded-full text-[22px] hover:opacity-75 cursor-pointer'>Continue payment</p>
                                <HoverKing event={()=>navigate('/user/payment',{ state:{ retry:true, _id:crrentOrder._id, order:{ offerPrice:crrentOrder.price.discountPrice,address:crrentOrder.delivery_address,price:crrentOrder.price.grandPrice,deliveryMethod:crrentOrder.payment_method,items:crrentOrder.items,qnt:location?.state?.qnt,coupon:{ code:crrentOrder.coupon.code, amount: crrentOrder.coupon.amount,usage:userData?.couponApplyed[crrentOrder.coupon.code] || 0 } } } })} 
                                styles={'absolute -bottom-3 -left-3 rounded-full border-0 py-0'} Icon={<i className="ri-refund-2-fill text-[30px] text-[white] rounded-full"></i>} >Continue payment</HoverKing>
                            }

                        </motion.span>
                        <span className='w-20'></span>
                        <motion.span 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            className='flex items-center justify-center'
                        >
                            <div className="flex flex-row items-center overflow-scroll justify-center mb-8 w-full">
                                <div className="w-full overflow-scroll mt-8 flex items-center justify-center">
                                    <Timeline currentStatus={orderStatus} />
                                </div>
                            </div>
                        </motion.span>
                        <span className='w-20'></span>
                        <motion.span 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className='min-w-[300px] flex items-center justify-center flex-col pb-20 pt-10 2xl:pt-0 2xl:pb-0'
                        >
                            <p className='opacity-45'>TOTAL PAYMENT:</p>
                            <span className='text-[45px] leading-none font-bold'>
                                ₹ <NumberScramble number={parseFloat(crrentOrder?.price?.grandPrice).toFixed(2)} />
                            </span>
                        </motion.span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
        </>
    )
}

import React, { useEffect, useState } from "react";
import ProductQuantityPopup from "../popups/ProductQuantityPopup";
import { useNavigate } from "react-router-dom";
import { useUpdateCartITemMutation } from "../../../services/User/userApi";
import DeletePopup from '../popups/DeletePopup'
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function Carts({ data,setProductData,index,showToast }) {

  const [ updateCartITem, { data:dataDelete } ] = useUpdateCartITemMutation();


  const [options, setOptions] = useState([
    "100g",
    "250g",
    "500g",
    "1Kg",
    "2Kg",
    "5Kg",
    "10Kg",
    "25Kg",
    "50Kg",
    "75Kg",
    "100Kg",
    "custom",
    "200g",
    "750g",
    "3Kg",
    "4Kg",
    "6Kg",
    "7Kg",
    "8Kg",
    "9Kg"
  ]);

  // Custom content component for the toast
  const ToastContent = ({ title, message }) => (
    <div>
        <strong>{title}</strong>
        <div>{message}</div>
    </div>
);




  const [popup, showPopup] = useState(false);
  const [dPopup,setDPopup] = useState(false);
  const [deleteData,setDeleteData] = useState({});
  const [qnt, setQnt] = useState(null);
  const [stp, setStp] = useState(null);
  const [defaultQnt, setDefaultQnt] = useState(null);

  const  navigation = useNavigate()

  // Convert string quantity to number (e.g., "100g" -> 100, "1Kg" -> 1000)
  const convertToGrams = (valueer) => {
    // alert(value)
    const value = valueer.toString()
    if (value === "custom") return null;
    
    // Remove any spaces and convert to lowercase for consistent parsing
    const cleanValue = value.toLowerCase().replace(/\s+/g, '');
    
    // Extract the numeric part and unit
    const match = cleanValue.match(/^(\d+(?:\.\d+)?)(g|kg)?$/);
    if (!match) return null;
    
    const amount = parseFloat(match[1]);
    const unit = match[2] || 'g';
    
    // Convert to grams based on unit
    return unit === 'kg' ? Math.round(amount * 1000) : amount;
  };

  const deconvertToGrams = (value) => {
    // alert(typeof value)
    if (value >= 1000) {
      return `${value/1000} Kg`;
    } else {
      return `${value}g`;
    }
  }

  const onQuantityChange = (e,id) => {

    const { value } = e.target;
    // alert(convertToGrams('10Kg'))
    
    if(value === 'custom'){
      return showPopup(true);
    }
    
    setQnt(value);
    const gramsValue = convertToGrams(value);
    
    if (gramsValue !== null) {

      updateCartITem({id,action:'update',seletor:convertToGrams(value)})

      setProductData((prevItems) =>
        prevItems.map((item, indexo) =>
          indexo === index ? { ...item, quantity: gramsValue } : item
        )
      );
    }
  };

  const handleCustomQuantity = (newValue) => {
    showPopup(false);
    if (newValue) {
      // Add to options and set as selecteddeconvertToGrams
      setOptions(prev => [...prev, newValue]);
      updateCartITem({id:data?.product?._id,action:'update',seletor:convertToGrams(newValue)})
      setQnt(newValue);
      const gramsValue = convertToGrams(newValue);
    
    if (gramsValue !== null) {
      setProductData((prevItems) =>
        prevItems.map((item, indexo) =>
          indexo === index ? { ...item, quantity: gramsValue } : item
        )
      );
    }
    }
  };

  useEffect(() => {
    if (data?.quantity&&!stp) {
      const formattedQnt = deconvertToGrams(data.quantity);
      setQnt(formattedQnt);
      setDefaultQnt(formattedQnt);
    }
    // alert(deconvertToGrams(data.quantity))
    const quantity = data.product?.stock;
    const thresholds = [
      { value: 100, option: "100g" },
      { value: 250, option: "250g" },
      { value: 500, option: "500g" },
      { value: 1000, option: "1Kg" },
      { value: 2000, option: "2Kg" },
      { value: 5000, option: "5Kg" },
      { value: 10000, option: "10Kg" },
      { value: 25000, option: "25Kg" },
      { value: 50000, option: "50Kg" },
      { value: 75000, option: "75Kg" },
      { value: 100000, option: "100Kg" }
    ];
    
    if(!stp){
      
      setOptions(prevOptions => {
        return prevOptions.filter(option => {
          if (option === "custom") return true;
          const threshold = thresholds.find(t => t.option === option);
          return threshold ? threshold.value <= quantity : false;
        });
      });
      setStp(true)
    }
    if(!options.includes(deconvertToGrams(data?.quantity))){
      setOptions((prevData)=>[...prevData,deconvertToGrams(data?.quantity)])

    }
    
  }, [data])

  const removeItem = (productId)=>{
    setDPopup(true)
    // updateCartITem(productId)
    setDeleteData({id:productId})
    
    // setProductData((prevData)=>{
    //   console.log(prevData);
      
    //   return prevData.filter( data => data.product._id!==productId)  
    // })
  }
  
  useEffect(()=>{
    if(dataDelete){
      showToast(dataDelete,'success')
    }
  },[dataDelete])

  useEffect(() => {
    if (deleteData === data?.product?._id) {
      setDPopup(false)
      setProductData((prevData) =>
        prevData.filter((s) => s.product?._id !== data?.product?._id)
    )
    setDeleteData()
    // showToast('hsflkj','success')
    }
  }, [deleteData, data?.product?._id])

  
  
  return (
    <> 
    {dPopup && (
        <DeletePopup
          updater={updateCartITem} 
          deleteData={deleteData} 
          setDeleteData={setDeleteData}
          showPopup={setDPopup} 
          isUser={true}
          isCart={true}
        />
      )}
    { popup &&
      <ProductQuantityPopup 
        stock={data?.product?.stock} 
        options={options} 
        setOptions={setOptions}
        onClose={handleCustomQuantity}
        onSelect={onQuantityChange}
        showPopup={showPopup}
      />
    }
    <div className="py-8 hover:scale-[1.1] duration-500 md:max-w-64 md:min-w-56 min-w-44 max-w-44 relative ">
        <img className="w-24 h-24 object-cover mx-auto translate-y-[30%]" src={data?.product?.pics?.one} alt="" />

      <div className="w-full justify-center pb-10 flex items-center flex-col leading-none rounded-[30px] md:rounded-br-[120px] rounded-br-[100px]   bg-[linear-gradient(27deg,#00000010,#00000005)] pt-8 overflow-hidden">

      <i onClick={()=>removeItem(data?.product?._id)} className="ri-close-line p-[2px] py-1 bg-[#00000040] rounded-full absolute left-8 top-8 px-[5px]"></i>
        <p className="text-green-700 md:text-[24px] text-[13px] font-bold opacity-20 absolute w-0 rotate-90 left-4 top-32">{data?.product?.category?.name.toUpperCase()}</p>
        <h1 className=" md:text-[24px] text-[13px] font-bold leading-none py-2">{data?.product?.name}</h1>
      
        <p className="w-[calc(100%_-_64px)] text-center bg-[#00000010] font-bold py-[6px] my-2 mt-3 rounded-full">
          { defaultQnt &&
          <span className="ml-">
            <select 
              onChange={(e)=>onQuantityChange(e,data?.product?._id)}
              value={qnt || ''}
              defaultValue={convertToGrams(data?.quantity)}
              className="outline-none bg-transparent rounded-full custom-selectero font-thin text-black ml-"
            >
              {
                options.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))
              }
            </select>
          </span>
          }
        </p>
        {/* <p  className="w-[calc(100%_-_64px)] text-center py-[6px] bg-[#ffffff50] my-2 rounded-full">Buy now</p> */}
        
        <button onClick={() => navigation("/user/ordersummery", { state: { items: [{ product:data?.product,quantity:convertToGrams(qnt) }], qnt: qnt } })} className='flex justify-start items-center font-bold rounded-full text-white absolute bottom-3 -right-3 bg-[linear-gradient(#b4c2ba,#789985)] overflow-hidden w-[70px] h-[70px] hover:scale-125 duration-500 group scale-75 md:scale-100'>
        <img className='group-hover:-translate-x-full min-w-[70px] p-4 brightness-[100]  duration-500' src="/bag-2-1.svg" alt="" />
        {/* <i className="ri-shopping-bag-line font-thin rounded-full min-w-[70px] text-[25px]  group-hover:-translate-x-full duration-500"></i> */}
        <img className='group-hover:-translate-x-full min-w-[70px] p-5 brightness-[100]  duration-500' src="/arrow-right.svg" alt="" />
        </button>
      </div>
    </div>
    </>
  );
}

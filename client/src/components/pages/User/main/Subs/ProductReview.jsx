import React from "react";
import star from "../../../../../assets/images/star.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ProductReview() {

  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  return (
    <div className="w-[96%] h-full relative">
      <div className="w-full h-full flex">
        {/* product image nav------------------ */}
        <div className="flex-grow-[4] min-w-[30%] max-w-[30%] h-full bg-slate-400 items-center justify-center flex">
          <img className="w-[80%]" src={location?.state?.form?.pics[0]} alt="" />
        </div>

        {/* Product details------------ */}
        <div className="flex-grow-[3] max-w-[40%] h-full pt-3 pl-20">
          <div className="w-full h-full flex flex-col gap-5">
            <span>
              {/* Head */}

              <p className="text-[13px] font-medium my-5 flex gap-2">

              <span onClick={() => navigate('/user/home')} className="opacity-45 hover:opacity-70">/ Home</span>
              <span onClick={() => navigate('/user/Products')} className="opacity-45 hover:opacity-70">/ Products</span>
              <span onClick={() => navigate(-1)} className="opacity-45 hover:opacity-70">/ Vegetable</span>
              <span className="opacity-45 hover:opacity-70">/ {'hi'}</span>   </p>

              <h1 className="text-[30px] font-bold">Rate the Fruit</h1>

              {/* description */}
              <p className="opacity-45">
                When the customer confirms their order, the material (wood from
                the tree) will be cut specifically for that order. This ensures
                that each piece is custom-prepared only after the order is
                finalized, minimizing waste and ensuring the wood is fresh and
                tailored to the customer's specifications
              </p>
            </span>

            {/* stars and reviews */}
            <div className="inline-flex gap-5">
              <div className="inline-flex">
                <img className="w-8 h-8" src={star} alt="" />
                <img className="w-8 h-8" src={star} alt="" />
                <img className="w-8 h-8" src={star} alt="" />
                <img className="w-8 h-8" src={star} alt="" />
                <img className="w-8 h-8 grayscale" src={star} alt="" />
              </div>
            </div>

            {/* Head */}
            <h1 className="text-[30px] font-bold">Review the Product</h1>

            <span>
              {/* message */}
              <h1 className="text-[25px] font-bold">
                We'd love to hear your feedback!
              </h1>
              {/* description */}
              <p className="opacity-45">
                Before you submit your review, let us know how the product
                worked for you. Your feedback is important to us and helps other
                customers make informed decisions!
              </p>
            </span>

            {/* input for feedback */}
            <input
              className="w-full pb-10 py-3 px-5 bg-[linear-gradient(45deg,#f5efef,#f5efef)] rounded-2xl text-[13px]"
              type="text"
              placeholder="write your feedback"
            />

            <span>
              {/* message */}
              <h1 className="text-[25px] font-bold">
                Show us how the product worked for you!
              </h1>
              {/* description */}
              <p className="opacity-45">
                Upload a photo to share your real-life experience with this
                product. A picture helps others see the quality and feel
                confident in their choices!
              </p>
            </span>

            {/* photo selector */}
            <div className="w-full h-28 flex gap-5">
              <div className="h-28 w-36 bg-orange-100 rounded-2xl p-5">
                {/* <img src={banana} alt="" /> */}
              </div>
              <div className="h-28 w-36 border-[2px] border-gray-300 rounded-2xl grid place-items-center">
                <i className="ri-add-line text-[60px] font-light"></i>
              </div>
            </div>

            {/* description */}
            <p className="opacity-45">Every word is valueble !</p>

            {/* submit button */}
            <button className="px-16 py-[15px] bg-[linear-gradient(to_left,#0bc175,#ffb31e)] text-[13px] rounded-full text-white font-medium mt-2 w-full max-w-[300px]">
              Post your feedback
            </button>
          </div>
        </div>





        {/* reviews */}
        {/* <div className="flex-grow-[4] max-w-[35%] h-full pt-12 px-16 bg-gray-"> */}
          {/* Head */}
          {/* <h1 className="text-[30px] font-bold">Reviews</h1> */}

          {/* reviews list */}
          {/* <div className="w-full mt-8 h-full flex flex-col gap-20">
            <div className="w-full flex flex-col gap-5">
              <div className="flex gap-4">
                <img className="w-20 h-20" src={picr} alt="" />
                <p>
                  The banana I tried was perfectly ripe with a bright yellow
                  peel and no blemishes. The texture was smooth and creamy,
                  making it very easy to eat. It was sweet, but not too sugary,
                  with just the right hint of freshness. I also liked how easy
                  it was to peel and take on the go as a healthy snack. Overall,
                  bananas are a convenient and nutritious option, rich in
                  potassium, making them a great choice for a quick energy boost
                </p>
              </div> */}
              {/* stars and reviews */}
              {/* <div className="inline-flex gap-5 ml-24">
                <div className="inline-flex">
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5 grayscale" src={star} alt="" />
                </div>
              </div> */}

            {/* photos of review */}
              {/* <div className="w-full h-16 flex gap-5 ml-24">
              <div className="h-2full w-28 bg-orange-100 rounded-2xl p-1">
                <img className="h-full mx-auto" src={banana} alt="" />
              </div>
              <div className="h-full w-28 border-[2px] border-gray-300 rounded-2xl grid place-items-center">
              </div>
            </div>

            </div> */}
            {/* ------------------------------------------------ */}
            {/* <div className="h-full w-full flex flex-col gap-5">
              <div className="flex gap-4">
                <img className="w-16 h-16 rounded-full" src={'https://cdn.vectorstock.com/i/preview-1x/77/17/chef-avatar-icon-vector-32077717.webp'} alt="" />
                <p>
                This banana was just the right level of ripeness—soft, sweet, and full of flavor. It was perfect for mashing with a little ghee, creating a delicious and wholesome treat. The sweetness balanced well with the rich flavor of ghee, making it an ideal combination. Definitely a must-try for a quick and tasty snack!
                </p>
              </div> */}
              {/* stars and reviews */}
              {/* <div className="inline-flex gap-5 ml-24">
                <div className="inline-flex">
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5 grayscale" src={star} alt="" />
                  <img className="w-5 h-5 grayscale" src={star} alt="" />
                </div>
              </div> */}

            {/* photos of review */}
              {/* <div className="w-full h-16 flex gap-5 ml-24">
              <div className="h-2full w-28 bg-orange-100 rounded-2xl overflow-hidden">
                <img className="h-full w-full mx-auto" src={'https://www.foodandwine.com/thmb/vYzNap2vl-aT9uDO5WYcWj_l-Gw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/amazonfreebananas-em-86304874-2000-5a276309cf1944349fb55818c98c7b1b.jpg'} alt="" />
              </div>
              <div className="h-full w-28 border-[2px] border-gray-300 rounded-2xl grid place-items-center">
              </div>
            </div>

            </div>

          </div>

        </div> */}



      </div>
    </div>
  );
}

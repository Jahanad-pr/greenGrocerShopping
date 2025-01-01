import React, { useEffect, useState } from "react";
import BookmarkCard from "../../../parts/Cards/Bookmarks";
import { useGetBookmarkItemsMutation } from "../../../../services/User/userApi";
import EmptyState from "../../../parts/Main/EmptySatate";
import { useNavigate } from "react-router-dom";
import HoverKing from "../../../parts/buttons/HoverKing";

const LoadingAnimation = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-24">
        <div className="absolute w-full h-full border-8 border-gray-200 rounded-full"></div>
        <div className="absolute w-full h-full border-8 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
      <p className="text-lg font-medium text-gray-600">Loading your bookmarks...</p>
    </div>
  </div>
);

export default function Bookmark({ userData }) {
  const [getBookmarkItems, { data, isLoading }] = useGetBookmarkItemsMutation();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(()=>{
    setBookmarks(data?.items)
  },[data])

  useEffect(() => {
    if (userData) {
      getBookmarkItems().unwrap();
    }
  }, [userData, getBookmarkItems]);

  if (isLoading) return <LoadingAnimation />;

 

  return (
    <div className="w-[96%] h-full bg-[#f2f2f2]">
      <div className="w-full h-full px-0 overflow-y-scroll">
        <div className="w-full pt-16  px-10 md:px-40 pb-40">
          {bookmarks?.length > 0 && (
            <>
              <h1 className="text-[35px] font-bold">Favorites</h1>
              <p className="opacity-45 translate-y-[-9px] text-[20px] font-mono">{bookmarks.length} total items</p>
              <div className="w-full mt-10 h-full flex flex-wrap gap-5">
                {bookmarks.map((item, index) => (
                  <BookmarkCard userData={userData} setBookData={setBookmarks} data={item} key={index} />
                ))}
              </div>
            </>
          )}
          {bookmarks?.length === 0 && (
            <div className="w-full h-[60vh] flex items-center mt-20 pr-20 justify-center flex-col text-center gap-5 relative">
              <img className="h-[80%] filter-[brightness(0)]" src="/heart-remove.svg" alt="No categories" />
              <div className="flex flex-col gap-2">
                <h1 className="text-[30px] font-bold">Sorry, No Favorites</h1>
                <p className="opacity-45 text-[13px]">
                  Add your favorite products to bookmarks. <br />
                  You can quickly access them later.
                </p>
                <HoverKing
                  event={() => navigate("/user/products")}
                  styles="fixed bottom-36 left-1/2 -translate-x-[65%] rounded-full border-0 font-medium text-[16px] bg-white"
                  Icon={<i className="ri-arrow-drop-right-line text-[50px] text-white"></i>}
                >
                  Let's add your product
                </HoverKing>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';

const ImageZoomGallary = ({imageses}) => {

    

  const [showZoom, setShowZoom] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const zoomFactor = 3;

  const images = [
    { id: 1, src: imageses?.one, alt: "Product 1" },
    { id: 2, src: imageses?.two, alt: "Product 2" },
    { id: 3, src: imageses?.three, alt: "Product 3" }
  ];

  useEffect(()=>{
    handleImageClick(images[0])
  },[imageses])


  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    // Ensure the zoom window stays within bounds
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));

    setZoomPosition({ x: boundedX, y: boundedY });
  };

  return (
    <div className="flex-col gap-8">
     

        <span className='flex items-center justify-center pb-10 order-1'>
        {selectedImage && (
          <div
            className="w-96 h-96 overflow-hidden grid place-items-center transition-all duration-500 rounded-[50px] shadow-2xl"
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
            ref={imageRef}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full object-cover transition-all duration-500"
            />
          </div>
        )}

        {/* Zoom Window */}
        {selectedImage && showZoom && (
          <div className=" absolute left-[500px] translate-y-[30px] ml-8 w-60 h-60 overflow-hidden z-10">
            <div
              className="relative w-full h-full"
              style={{
                backgroundImage: `url(${selectedImage.src})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundSize: `${zoomFactor * 100}%`,
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>
        )}

        </span>

         {/* Thumbnails */}
      <div className="flex gap-4 order-2 items-center justify-center">
        {images.map((image) => (
          <div
            key={image.id}
            className="min-w-24 h-24 cursor-pointer overflow-hidden border-2 border-[#00000030] rounded-3xl shadow-2xl"
            onClick={() => handleImageClick(image)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-36full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Main Image Container */}
      <div className="relative">
      </div>
    </div>
  );
};

export default ImageZoomGallary;
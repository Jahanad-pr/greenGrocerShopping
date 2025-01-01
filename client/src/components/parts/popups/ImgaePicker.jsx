import { useState, useRef, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  FaUpload,
  FaWindowClose,
  FaTrash,
  FaPlus,
  FaCrop,
  FaSync,
  FaExchangeAlt,
  FaExclamationCircle,
} from "react-icons/fa";

// Error Popup Component
const ErrorPopup = ({ message, isVisible }) => {
  return (
    <div
      className={`
        fixed bottom-0 left-1/2 transform -translate-x-1/2
        bg-red-500 text-white px-6 py-3 rounded-t-lg
        flex items-center gap-2 shadow-lg z-50
        transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-[-80px]" : "translate-y-full"}
      `}
    >
      <FaExclamationCircle className="text-xl" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ImagePicker = ({ setImageUrls, showPopup, maxImages = 1, imageses,setChaged }) => {
  
  const [images, setImages] = useState(Array(maxImages).fill(null));
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [init, setInit] = useState({ 1: true, 2: true, 3: true });
  const [hasChanges, setHasChanges] = useState(false);
  const [crop, setCrop] = useState();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [error, setError] = useState({ show: false, message: "" });

  const aspect = 1;
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const imagerPopup = useRef(null);

  useEffect(() => {
    if (imageses) {
      setInit({ 1: false, 2: false, 3: false });
      setImages(imageses);
    }
  }, []);

  // Error timeout cleanup
  useEffect(() => {
    let timeoutId;
    if (error.show) {
      timeoutId = setTimeout(() => {
        setError({ show: false, message: "" });
      }, 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [error.show]);

  useEffect(() => {
    if (activeIndex !== null && currentImage) {
      setHasChanges(currentImage !== images[activeIndex]);
    } else {
      setHasChanges(false);
    }
  }, [currentImage, activeIndex, images]);

  const showError = (message) => {
    setError({ show: true, message });
  };

  const validateFile = (file) => {
    if (!file) {
      showError("Please select a file");
      return false;
    }

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      showError("Please select a valid image file (JPEG, PNG, GIF, or WEBP)");
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showError("Image size should be less than 5MB");
      return false;
    }

    return true;
  };

  const onImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImageSize({ width: naturalWidth, height: naturalHeight });

    // Calculate maximum size while maintaining aspect ratio
    const maxSize = 400;
    let width = naturalWidth;
    let height = naturalHeight;

    if (width > maxSize || height > maxSize) {
      if (width > height) {
        height = (height / width) * maxSize;
        width = maxSize;
      } else {
        width = (width / height) * maxSize;
        height = maxSize;
      }
    }

    setCrop(centerAspectCrop(width, height, aspect));
  };

  async function getCroppedImg(image, crop) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    // Draw the cropped area of the image onto the canvas
    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    // Return the base64 data URL
    return canvas.toDataURL("image/jpeg", 1); // Adjust quality if needed (0 to 1)
}


  const closeWindow = () => {
    if(images[maxImages-1]){
      setImageUrls(images);
      showPopup(false);
      setChaged(true)
    }else if(images[0]&&maxImages===1){
      setImageUrls(images);
      showPopup(false);
      setChaged(true)
    }
    else{
      setImageUrls();
      showPopup(false);
    }
    imagerPopup?.current?.classList.add("fadeOUT");
    setTimeout(() => {
      imagerPopup.current.style.display = "none";
      showPopup(false);
      setChaged(true)
      setActiveIndex(null);
      setCurrentImage(null);
      setShowCropper(false);
      setHasChanges(false);
      setCrop(undefined);
      setImageSize({ width: 0, height: 0 });
    }, 400);
  };

  const onClose = () => {
    setShowCropper(false);
    setHasChanges(false);
    setCrop(undefined);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      event.target.value = ""; // Reset input
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const newImages = [...images];
      newImages[activeIndex] = result;

      if (init[activeIndex + 1]) {
        setImages(newImages);
        setInit({ ...init, [activeIndex + 1]: false });
      }
      setCurrentImage(result);
      setHasChanges(true);
      setImageUrls(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const newImages = [...images];
      newImages[activeIndex] = result;
      setImages(newImages);
      setCurrentImage(result);
      setHasChanges(true);
      setImageUrls(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const deleteImage = () => {
    if (activeIndex !== null) {
      const newImages = [...images];
      newImages[activeIndex] = null;
      setCurrentImage(null);
      setImageUrls(newImages);
      setCurrentImage(null);
      setShowCropper(false);
      setHasChanges(false);
      setCrop(undefined);
    }
  };

  const handleImageClick = (index) => {
    setActiveIndex(index);
    setCurrentImage(images[index]);
    setShowCropper(false);
    setHasChanges(false);
    setCrop(undefined);
  };

  const handleCropClick = () => {
    setShowCropper(true);
  };

  const handleUpdateImage = async () => {
    if (imgRef.current && crop?.width && crop?.height) {
      const croppedImageUrl = await getCroppedImg(imgRef.current, crop);
      setCurrentImage(croppedImageUrl);
      setShowCropper(false);
      setHasChanges(true);
      setCrop(undefined);
    }
  };

  const handleSaveImage = () => {

    if ((currentImage && hasChanges && activeIndex !== null)) {
      const newImages = [...images];
      newImages[activeIndex] = currentImage;
      setImages(newImages);
      setImageUrls(newImages);
      setHasChanges(false);
    }
  };

  const handleReplaceClick = (index) => {
    setActiveIndex(index);
    setCurrentImage(images[index]);
    setShowCropper(false);
    fileInputRef.current?.click();
  };

  const hasUniqueValues = (obj) => {
    return obj[0]!==obj[1]&&obj[2]!==obj[1]&&obj[2]!==obj[0]&&obj
  };

  useEffect(() => {

    if (!hasUniqueValues(images) && images.length>0&&images[1]) {
      showError("Please select different image");
    }
  }, [images]);

  const finishSelector = () => {
    setImageUrls(images);
    showPopup(false);
    setChaged(true)
  };

  async function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Set cross-origin
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

    
  }
    // Usage
loadImage(images[0])
.then(img => getCroppedImg(img, crop))
.then(croppedImg => console.log(croppedImg))
.catch(error => '');


  return (
    <div
      ref={imagerPopup}
      className="w-screen h-screen fixed flex items-center justify-center backdrop-blur-xl bg-[#00000080] z-20 text-black flex-col gap-5 fadeIN"
    >
      <ErrorPopup message={error.message} isVisible={error.show} />

      <FaWindowClose
        onClick={closeWindow}
        className="text-white fixed right-10 top-10 opacity-40 md:text-[30px] text-[30px] cursor-pointer hover:opacity-100"
      />


      <div className="flex gap-4 mb-6">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div
              className={`w-32 h-32 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center overflow-hidden
                ${
                  activeIndex === index
                    ? "ring-4 ring-blue-500"
                    : "hover:ring-2 ring-white"
                }
                ${image ? "bg-gray-800" : "bg-gray-700"}`}
              onClick={() => handleImageClick(index)}
            >
              {image ? (
                <>
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"></div>
                </>
              ) : (
                <FaPlus className="text-white text-2xl opacity-50" />
              )}
            </div>
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="flex gap-6 overflow-hidden">
          <div
            className="drag-drop-area bg-[linear-gradient(#ffffff20,#9198e530)] border-2 border-gray-800 rounded-[20px] w-[400px] h-[400px] flex items-center justify-center relative overflow-hidden"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => !showCropper && fileInputRef.current?.click()}
          >
            {showCropper && currentImage ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <ReactCrop
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop)}
                  onComplete={(c) => setCrop(c)}
                  aspect={1}
                  className="max-w-[50%] min-w-full max-h-full"
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={currentImage}
                    onLoad={onImageLoad}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </ReactCrop>
              </div>
            ) : currentImage ? (
              <>
                <img
                  src={currentImage}
                  alt="Selected"
                  className="w-full h-full object-contain bg-gray-900"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReplaceClick(activeIndex);
                  }}
                  className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20 absolute top-10 right-10 bg-[#00000050]"
                >
                  <FaExchangeAlt className="text-[25px]" />
                  <input
                    type="file"
                    className="w-10 h-10 absolute right-0 top-0 opacity-0"
                    onChange={handleFileSelect}
                    accept="image/*"
                  />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <div className="text-white mb-4 text-6xl opacity-25">
                  <FaUpload />
                </div>
                <h1 className="font-bold text-[20px] text-white mb-2">
                  Choose Image {activeIndex + 1}
                </h1>
                <p className="text-white opacity-25">
                  Drag and drop an image here or click to select
                </p>
              </div>
            )}
            <input
              type="file"
              disabled={currentImage}
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*"
            />
          </div>

          {currentImage && !showCropper && (
            <div className="flex flex-col gap-4 justify-center">
              <button
                className={`px-10 py-3 rounded-[30px] flex items-center gap-3 text-white transition-all duration-300
                  ${
                    hasChanges
                      ? "bg-green-500 hover:opacity-90 cursor-pointer"
                      : "bg-green-500/30 cursor-not-allowed"
                  }`}
                onClick={handleSaveImage}
                disabled={!hasChanges}
              >
                <FaSync />
                Update Image
              </button>
              {  Array.isArray(currentImage)?!currentImage[0].startsWith('http'):!currentImage.startsWith('http') &&
                
              <button  onClick={handleCropClick}
                className="bg-blue-500 px-10 py-3 rounded-[30px] flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
              >
                <FaCrop />
                Crop Image
              </button>
              }
              <button
                className="bg-red-500 px-10 py-3 rounded-[30px] flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
                onClick={deleteImage}
              >
                <FaTrash />
                Remove Image
              </button>
              {  maxImages!==1 && images[0] && images[1] && images[2] && (
                <button
                  className="bg-[linear-gradient(to_left,#42f5d1,#3b82f6)] px-10 py-3 rounded-[30px] flex items-center justify-center font-medium gap-3 text-black hover:opacity-90 transition-opacity"
                  onClick={finishSelector}
                >
                  Continue
                </button>
              )}{  maxImages===1 && images[0]  && (
                <button
                  className="bg-[linear-gradient(to_left,#42f5d1,#3b82f6)] px-10 py-3 rounded-[30px] flex items-center justify-center font-medium gap-3 text-black hover:opacity-90 transition-opacity"
                  onClick={finishSelector}
                >
                  Continue
                </button>
              )}
              
            </div>
          )}

          {showCropper && (
            <div className="flex flex-col gap-4 justify-center">
              <button
                className={`px-10 py-3 rounded-[30px] flex items-center gap-3 text-white transition-all duration-300
                  ${
                    crop
                      ? "bg-[linear-gradient(45deg,#ff512f,#de2477)] hover:opacity-90 cursor-pointer"
                      : "bg-[linear-gradient(45deg,#ff512f30,#de247730)] cursor-not-allowed"
                  }`}
                onClick={handleUpdateImage}
                disabled={!crop}
              >
                <FaUpload />
                Apply Crop
              </button>
              <button
                className="bg-gray-500 px-10 py-3 rounded-[30px] flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
                onClick={onClose}
              >
                <FaWindowClose />
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePicker;

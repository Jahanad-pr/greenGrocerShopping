import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { removeBackground } from '../../../utils/removeBackground.js';

const ImageUploadPopup = ({ isOpen, onClose, onSave, maxImages = 3,urls=false, maxSizeMB = 5, showRemoveBg = false }) => {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [bgRemoved, setBgRemoved] = useState(false); // State to track background removal
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    setError('');
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return false;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Image size must be less than ${maxSizeMB}MB`);
      return false;
    }

    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return false;
    }

    return true;
  };

  /**
   * Sets initial images from props.urls if provided.
   * If maxImages is greater than 1, it adds additional images to the array.
   * Each image object has "original", "preview", and "cropped" properties,
   * with "original" and "cropped" set to empty objects and "preview" set
   * to the corresponding URL from props.urls. The "processed" property is set
   * to true.
   * @param {boolean} urls - Whether urls prop is provided
   * @param {number} maxImages - Maximum number of images allowed
   */
  useEffect(()=>{
    if (urls) {

      let newImages = [  {
        "original": {},
        "preview": urls[0],
        "cropped": {},
        "processed": true
      }]

      // setImages([
      
      //   {
      //     "original": {},
      //     "preview": urls[1],
      //     "cropped": {},
      //     "processed": true
      //   },
      //   {
      //     "original": {},
      //     "preview": urls[2],
      //     "cropped": {},
      //     "processed": true
      //   }
      // }

      if(maxImages>1){
        newImages.push(
            {
              "original": {},
              "preview": urls[1],
              "cropped": {},
              "processed": true
            })
      }

      if(maxImages>2){
        newImages.push(
            {
              "original": {},
              "preview": urls[2],
              "cropped": {},
              "processed": true
            })
      }

      setImages(newImages)

    }



  }, [urls])

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.add('border-green-500');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.remove('border-green-500');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.remove('border-green-500');
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;
    
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage({
          file,
          preview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (currentImage && cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        setImages(prev => [...prev, {
          original: currentImage.file,
          preview: URL.createObjectURL(blob),
          cropped: blob,
          processed: false
        }]);
        setCurrentImage(null);
        setCropper(null);
      });
    }
  };

  const handleRemoveBackgrounds = async () => {
    setIsProcessing(true);
    setProcessedCount(0);
    setError('');

    try {
      console.log('akdslfffffffffffffffffffffffffffffffffffffffffffffffffff');
      const processedImages = await Promise.all(
        images.map(async (img, index) => {
          try {
            
            const processedBlob = await removeBackground(img.cropped);
            setProcessedCount(prev => prev + 1);
            setBgRemoved(true);
            return {
              ...img,
              preview: URL.createObjectURL(processedBlob),
              cropped: processedBlob,
              processed: true
            };
          } catch (error) {
            console.log(error)
            console.error(`Error processing image ${index + 1}:`, error);
            return img;
          }
        })
      );

      setImages(processedImages);
       // Set background removal completed
    } catch (error) {
      setError('Failed to process some images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'GreenGrocer'); // Replace with your upload preset

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dzbem6tsk/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleFinalSave = async () => {
    const croppedImages = images.map(img => img.cropped);
    const uploadedUrls = await Promise.all(croppedImages.map(async (cropped) => {
      return await uploadToCloudinary(cropped);
    }));
    console.log({
      [0]:uploadedUrls[0]||urls[0],
      [1]:uploadedUrls[1]||urls[1],
      [2]:uploadedUrls[2]||urls[2]
    });
    onSave({
      [0]:uploadedUrls[0]||urls[0],
      [1]:uploadedUrls[1]||urls[1],
      [2]:uploadedUrls[2]||urls[2]
    });
    onClose();
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
      >
        <motion.div
          initial={{ scale: 0.4, opacity: 0, rotateX: 90, y: -60 }}
          animate={{ scale: [0.4, 1.1, 1], opacity: 1, rotateX: 0, y: 0 }}
          exit={{ scale: 0.4, opacity: 0, rotateX: -90, y: 60 }}
          transition={{ type: "spring", damping: 15, stiffness: 300, bounce: 0.4, duration: 0.6 }}
          style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
          className="relative p-5 px-12 max-w-[600px] min-w-[400px] pt-8 rounded-[30px] rounded-bl-[120px] backdrop-blur-2xl border border-white/20 shadow-xl bg-[linear-gradient(to_right,#ffffff20,#dc262640)]"
        >
          <span className='flex items-center justify-between mb-8'>
          <motion.h3 
          onClick={() => console.log(images)}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-medium text-white"
          >
            {currentImage ? 'Crop Image' : `Selected Images ${maxImages>1?'('+images.length+'/':''}${maxImages>1?maxImages+')':''}`}
          </motion.h3>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
            
          </span>
          {error && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30"
            >
              <p className="text-red-400 font-MyCustomFont text-sm">{error}</p>
            </motion.div>
          )}
          {isProcessing && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4 p-3 rounded-lg bg-blue-500/20 border border-blue-500/30"
            >
              <p className="text-blue-400 font-MyCustomFont text-sm">
                Processing images... ({processedCount}/{images.length})
              </p>
            </motion.div>
          )}
          {currentImage ? (
            <div className="space-y-4">
              <Cropper
                src={currentImage.preview}
                style={{ height: 400, width: '100%' }}
                aspectRatio={1}
                guides={true}
                onInitialized={(instance) => setCropper(instance)}
                className="rounded-xl overflow-hidden"
              />
              <div className="flex justify-end space-x-3">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors font-MyCustomFont"
                  onClick={() => {
                    setCurrentImage(null);
                    setCropper(null);
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="px-4 py-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors font-MyCustomFont"
                  onClick={handleSave}
                >
                  Add Image
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <span className='flex gap-3'>
                

                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    { 
                    <>
                      <img 
                        src={img.preview} 
                        alt={`Upload ${index + 1}`}
                        className={` h-40 object-cover rounded-[20px] ${img.processed?'bg-white/10':'bg-white'} `}
                      />

                    <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500/20 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    </>
                    }
                    {img.processed && maxImages > index  && (
                      <div className="absolute bottom-2 right-2 p-1 rounded-full bg-green-500/20 text-green-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
                </span>
                {images.length < maxImages && (
                  <div
                    ref={dropRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="h-60 w-full bg-blue-700/10 border-2 border-dashed border-gray-400 rounded-[30px] rounded-bl-[120px] flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-gray-300 font-MyCustomFont text-sm">Add Image</p>
                    <p className="text-gray-400 font-MyCustomFont text-xs mt-1">Max {maxSizeMB}MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                {images.length === maxImages && !isProcessing && showRemoveBg && !images[maxImages-1]?.processed && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    onClick={handleRemoveBackgrounds}
                    className="px-4 py-2 rounded-lg mt-5 mb-5 bg-white/10 text-white hover:bg-purple-500/30 transition-colors font-MyCustomFont"
                  >
                    Remove Backgrounds
                  </motion.button>
                )}
                { bgRemoved===true  || (!showRemoveBg && images?.length > 0) ?  ( // Show Save All button only after background removal
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={handleFinalSave}
                    className="px-4 py-2 rounded-lg mt-5 mb-5 bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors font-MyCustomFont"
                  >
                    {isProcessing ? 'Processing...' : maxImages > 1 ? 'Save All' : 'Save'}
                  </motion.button>
                ):''}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageUploadPopup;
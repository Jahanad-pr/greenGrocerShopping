export const removeBackground = async (imageBlob) => {
  const formData = new FormData();
  formData.append('image_file', imageBlob);
  
  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': '5C8shJECnnB7ZYcWwhkok5nx',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to remove background');
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

// export const removeBackground = async (imageBlob) => {
//   const API_URL = 'https://sdk.photoroom.com/v1/segment';
//   const API_KEY = '6feb44999cc2759b4eab702f7a756414abaaf2cd';

//   // Prepare the form data
//   const formData = new FormData();
//   formData.append('file', imageBlob);

//   try {
//     // Send the request to PhotoRoom API
//     const response = await fetch(API_URL, {
//       method: 'POST',
//       headers: {
//         'x-api-key': API_KEY,
//       },
//       body: formData,
//     });

//     // Handle non-successful responses
//     if (!response.ok) {
//       const errorDetails = await response.text(); // Optional: Fetch error details from response
//       throw new Error(`Failed to remove background: ${errorDetails}`);
//     }

//     // Return the processed image as a Blob
//     return await response.blob();
//   } catch (error) {
//     console.error('Error removing background:', error);
//     throw error;
//   }
// };



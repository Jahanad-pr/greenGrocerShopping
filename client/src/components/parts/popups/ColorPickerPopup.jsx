import { useEffect, useState } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { FaWindowClose } from "react-icons/fa";

export default function ColorPick({showPop,index,setColors,colors}) {
  const [color, setColor] = useColor("hex", "#561ecb");
  const [gradient, setGradient] = useState("");

  // Utility function to check if a color is light or dark
  function isColorDark(color) {
    let r, g, b;
  
    // If color is in hex format
    if (color && color.startsWith('#')) {
      const hex = color.replace('#', '');
      
      // Ensure hex is 6 characters long (for 3-color hex codes)
      if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else {
        return false; // Invalid hex format
      }
    }
    // If color is in rgb format (e.g., 'rgb(255, 255, 255)')
    else if (color && color.startsWith('rgb')) {
      const rgbValues = color.match(/\d+/g);
      if (rgbValues && rgbValues.length === 3) {
        [r, g, b] = rgbValues.map(Number);
      } else {
        return false; // Invalid rgb format
      }
    } else {
      return false; // Unsupported format
    }

    // Calculate brightness using the luminance formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return true if the color is dark, false if it's light
    return brightness < 128;
  }

  useEffect(() => {
    if(index==1){
        setGradient(`linear-gradient(135deg, ${color.hex},${colors?.secondary?colors?.secondary:'gray'})`);
        setColors((prevData)=>({...prevData,primary:color.hex}))
    }else{
        setGradient(`linear-gradient(135deg, ${colors?.primary?colors?.primary:'gray'}, ${color.hex})`);
        setColors((prevData)=>({...prevData,secondary:color.hex}))
    }

  }, [color]);

  return (
    <>
      <div className="absolute z-10 w-screen h-screen backdrop-blur-md bg-[#000000b0] flex items-center justify-center flex-col">
        <FaWindowClose onClick={()=>showPop(false)} className="absolute top-10 right-10 text-[30px] text-white opacity-45" />
        <div style={{ background: gradient, }} className="w-[30%] rounded-2xl p-1 max-w-[400px]" >
          <ColorPicker width={150} height={180} color={color} onChange={setColor} />
        </div>
        <span className="max-w-[400px] w-full flex px-2 pt-3 gap-3">
        <div style={{ borderColor: colors.secondary?colors.secondary:'gray' }} className=" border-2 px-3 text-white py-2 w-full max-w-[200px] flex items-center justify-center rounded-xl">{color.hex}</div>
        <div style={{backgroundColor:colors.primary?colors.primary:'gray',color:isColorDark(colors.primary)?'white':'black'}} onClick={()=>showPop(false)} className="text-white px-3 py-2 w-full max-w-[200px] flex items-center justify-center rounded-xl font-medium">Select</div>
        </span>
      </div>
    </>
  );
}

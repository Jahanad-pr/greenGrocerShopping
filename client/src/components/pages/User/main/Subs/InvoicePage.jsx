// src/components/pages/User/invoice/Invoice.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const InvoicePage = () => {

    const navigator = useNavigate()
    const location = useLocation()

    const [data, setData] = useState(location.state.data)

    useEffect(() => {
        setData(location.state.data);
    }, [location])

    const downloadInvoice = async (data) => {
        // Validation checks remain the same
        if (!data.price.others || !data.price.others.totel || !data.price.others.delivery || 
            !data.price.others.tax || !data.price.discountPrice || !data.price.grandPrice) {
            console.error("Price data is invalid:", data.price.others);
            return;
        }
    
        if (!Array.isArray(data.items) || data.items.length === 0) {
            console.error("Items data is invalid:", data.items);
            return;
        }
    
        // Create PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
        const { width, height } = page.getSize();
        
        // Embed fonts
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
        // Colors
        const primaryColor = rgb(0.47, 0.67, 0.47); // Sage green color
        const secondaryColor = rgb(0.94, 0.96, 0.94); // Light mint background
        const textColor = rgb(0.3, 0.3, 0.3);
        const tableHeaderColor = rgb(0.47, 0.67, 0.47);
    
        // White background
        page.drawRectangle({
            x: 0,
            y: 0,
            width: width,
            height: height,
            color: rgb(1, 1, 1),
        });
    
        // Add "INVOICE" header
        let currentY = height - 80;
        
        page.drawText('INVOICE', {
            x: 50,
            y: currentY,
            size: 24,
            font: helveticaBold,
            color: textColor,
        });
    
        // Order ID right below INVOICE
        currentY -= 30;
        
        page.drawText('Order ID:', {
            x: 50,
            y: currentY,
            size: 14,
            font: helvetica,
            color: textColor,
        });
    
        page.drawText(data.order_id, {
            x: 50,
            y: currentY - 25,
            size: 14,
            font: helveticaBold,
            color: textColor,
        });
    
        currentY -= 60;
    
        // Rest of the customer details
        page.drawText(`Customer Name: ${data.delivery_address.FirstName}`, {
            x: 50,
            y: currentY,
            size: 14,
            font: helvetica,
            color: textColor,
        });
    
        currentY -= 25;
    
        page.drawText(`Order Date: ${new Date(data.time).toLocaleDateString()}`, {
            x: 50,
            y: currentY,
            size: 14,
            font: helvetica,
            color: textColor,
        });
    
        currentY -= 25;
    
        page.drawText(`Total Amount: INR. ${data.price.grandPrice}`, {
            x: 50,
            y: currentY,
            size: 14,
            font: helvetica,
            color: textColor,
        });
    
        // Delivery Address box
        const addressBoxY = currentY - 150;
        page.drawRectangle({
            x: width - 300,
            y: addressBoxY,
            width: 250,
            height: 180,
            color: secondaryColor,
        });
    
        page.drawText('Delivery Address', {
            x: width - 280,
            y: addressBoxY + 150,
            size: 16,
            font: helveticaBold,
            color: textColor,
        });
    
        // Address details
        const addressLines = [
            data.delivery_address.streetAddress,
            data.delivery_address.landmark,
            `${data.delivery_address.city}`,
            'Kerala',
            `Pincode: ${data.delivery_address.pincode}`,
            `Phone: ${data.delivery_address.phone}`
        ];
    
        addressLines.forEach((line, index) => {
            page.drawText(line, {
                x: width - 280,
                y: addressBoxY + 120 - (index * 20),
                size: 12,
                font: helvetica,
                color: textColor,
            });
        });
    
        // Items table with matching UI style
        const tableTop = addressBoxY - 50;
        const tableHeaders = ['Item', 'Quantity', 'Price', 'Discount Price'];
        const columnWidths = [200, 100, 100, 100];
    
        // Table header
        page.drawRectangle({
            x: 40,
            y: tableTop,
            width: width - 80,
            height: 40,
            color: tableHeaderColor,
        });
    
        let headerX = 60;
        tableHeaders.forEach((header, index) => {
            page.drawText(header, {
                x: headerX,
                y: tableTop + 15,
                size: 12,
                font: helveticaBold,
                color: rgb(1, 1, 1),
            });
            headerX += columnWidths[index];
        });
    
        // Table rows
        let rowY = tableTop - 40;
        data.items.forEach((item, index) => {
            const x = 60;
            page.drawText(item.product.name, {
                x,
                y: rowY,
                size: 12,
                font: helvetica,
                color: textColor,
            });
    
            page.drawText(`${item.quantity / 1000} KG`, {
                x: x + columnWidths[0],
                y: rowY,
                size: 12,
                font: helvetica,
                color: textColor,
            });
    
            page.drawText(`INR. ${item.product.regularPrice}`, {
                x: x + columnWidths[0] + columnWidths[1],
                y: rowY,
                size: 12,
                font: helvetica,
                color: textColor,
            });
    
            page.drawText(`INR. ${(data.price.discountPrice / data.items.length).toFixed(2)}`, {
                x: x + columnWidths[0] + columnWidths[1] + columnWidths[2],
                y: rowY,
                size: 12,
                font: helvetica,
                color: textColor,
            });
    
            rowY -= 30;
        });
    
        // Summary section
        const summaryY = rowY - 50;
        page.drawRectangle({
            x: 40,
            y: summaryY - 160,
            width: width - 80,
            height: 180,
            color: secondaryColor,
        });
    
        page.drawText('Summary', {
            x: 60,
            y: summaryY,
            size: 16,
            font: helveticaBold,
            color: textColor,
        });
    
        const summaryItems = [
            { label: 'Total for Products', value: data.price.others.totel.toFixed(2) },
            { label: 'Delivery Charge', value: data.price.others.delivery.toFixed(2) },
            { label: 'Tax amount', value: data.price.others.tax.toFixed(2) },
            { label: 'Discount Amount', value: data.price.discountPrice.toFixed(2) },
            { label: 'Total Amount', value: data.price.grandPrice }
        ];
    
        summaryItems.forEach((item, index) => {
            page.drawText(item.label, {
                x: 60,
                y: summaryY - 30 - (index * 25),
                size: 12,
                font: helvetica,
                color: textColor,
            });
    
            page.drawText(`INR. ${item.value}`, {
                x: width - 140,
                y: summaryY - 30 - (index * 25),
                size: 12,
                font: index === summaryItems.length - 1 ? helveticaBold : helvetica,
                color: textColor,
            });
        });
    
        // Thank you message
        page.drawText('Thank you for shopping with us!', {
            x: width / 2 - 100,
            y: 50,
            size: 14,
            font: helvetica,
            color: textColor,
        });
    
        // Save and download
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${data.order_id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="md:w-[96%] min-h-screen bg-[#f2f2f2] overflow-x-hidden">
            <div className="w-full px-4 md:px-20 lg:px-80 flex flex-col items-center gap-5 fade-in pb-40">

                <div onClick={() => navigator(-1) }
                
                    className="flex top-3 left-3 items-center gap-1 cursor-pointer hover:text-blue-500 duration-300 absolute 2xl:left-40 2xl:top-8 group">
                    <i className='ri-arrow-left-s-fill inline-block text-[28px] relative left-0 duration-500 group-hover:-left-5'></i>
                    <p className='text-[13px]'>Back to Success Page</p>
                </div>

                {/* Header */}
                <h1 className="text-[30px] font-bold my-10 mt-16 slide-down">Order Invoice</h1>

                <div className="w-full bg-[linear-gradient(45deg,#ffffff90,#ffffff70)] backdrop-blur-sm rounded-[40px] p-8">
                    <div className="2xl:flex justify-between mb-8">
                        <div className="space-y-2 min-w-[250px]">
                            <div className="text-sm space-y-1">
                                <p className="text-[13px] opacity-75 mt-8 leading-8">Order ID: <br></br><span className="font-medium">{data?.order_id}</span></p>
                                <p className="text-[13px] opacity-75">Customer Name: <span className="font-medium">{data?.delivery_address?.FirstName}</span></p>
                                <p className="text-[13px] opacity-75">Order Date: <span className="font-medium">{`${new Date(data?.time).getMonth() + 1}-${new Date(data?.time).getDate()}-${new Date(data?.time).getFullYear()}`}</span></p>
                                <p className="text-[13px] opacity-75">Total Amount: <span className="font-bold text-[#3d7051]">₹{data?.price?.grandPrice}</span></p>
                            </div>
                        </div>

                        {/* Footer */}
                        <span className='inline-flex flex-col items-center gap-5 mt-8 2xl:mt-0 mb-12 2xl:mb-0'>
                            <button onClick={() => downloadInvoice(data)} className='mt-4 px-6 py-2 bg-[#657a6d] text-white rounded-full flex gap-5 cursor-pointer hover:opacity-60'>
                                <i className='ri-download-line font-bold'></i>
                                Download Invoice</button>
                            <p className='2xl:px-40 px-10 text-center'>Download Invoice in PDF,  Its may help you to track your order, and it help you to reduce the confusion in feature about the amount and further details</p>
                        </span>



                        <div className="text-sm bg-[linear-gradient(45deg,#50a05520,#3d705120)] p-6 rounded-[30px] flex">
                            <div className="space-y-1 opacity-75 flex gap-12">

                                <span>
                                    <p className="font-bold text-[13px] mb-3 text-[#3d7051]">Delivery Address</p>
                                    <p>{`${data?.delivery_address?.FirstName} ${data?.delivery_address?.LastName}`}</p>
                                    <p>{data?.delivery_address?.streetAddress}</p>
                                    <p>{data?.delivery_address?.landmark}</p>
                                    <p>{data?.delivery_address?.city}</p>
                                </span>
                                <span>
                                    <p>&nbsp;</p>
                                    <p>{data?.delivery_address?.state}</p>
                                    <p>Pincode: {data?.delivery_address?.pincode}</p>
                                    <p>Phone: {data?.delivery_address?.phone}</p>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-[30px]">
                        <table className="w-full text-[17px]">
                            <thead>
                                <tr className="2xl:px-40 bg-[linear-gradient(45deg,#50a05599,#657a6d)] text-white">
                                    <th className="py-4 px-6 text-left rounded-tl-[30px] 2xl:pl-20">Item</th>
                                    <th className="py-4 px-6 text-left">Quantity</th>
                                    <th className="py-4 px-6 text-left">Price</th>
                                    <th className="py-4 px-6 text-left rounded-tr-[30px]">Discount Price</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-[17px]">
                                {
                                    data?.items?.map((item, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50 duration-300">
                                            <td className="py-4 px-6 2xl:pl-20 ">{item.product.name}</td>
                                            <td className="py-4 px-6">{item.quantity / 1000} KG</td>
                                            <td className="py-4 px-6">₹{item.product.regularPrice * (item.quantity / 1000)}</td>
                                            <td className="py-4 px-6">₹{
                                                ((data.price?.discountPrice) / data.items.length || 0)}</td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="mt-8 bg-[linear-gradient(45deg,#50a05510,#3d705110)] p-6 rounded-[30px]">
                        <h2 className="font-bold text-[20px] mb-4 text-[#3d7051]">Summary</h2>
                        <div className="space-y-2 text-[16px]">
                            <div className="flex justify-between items-center">
                                <span className="opacity-75">Totel for Products</span>
                                <span className="font-medium">₹{data?.price?.others.totel.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="opacity-75">Delivery Charge</span>
                                <span className="font-medium">₹{data?.price?.others.delivery.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="opacity-75">Tax amount</span>
                                <span className="font-medium">₹{data?.price?.others.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="opacity-75">Discount Amount</span>
                                <span className="font-medium">₹{data?.price?.discountPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="font-bold text-[13px]">Total Amount</span>
                                <span className="font-bold text-[20px] text-[#3d7051]">₹{data?.price?.grandPrice}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-center mt-8 text-[16px] opacity-75">Thank you for shopping with us!</p>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;
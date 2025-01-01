const downloadInvoice = async (data) => {
    // Validate data
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
    const primaryColor = rgb(0.24, 0.44, 0.32); // #3D7051
    const secondaryColor = rgb(0.31, 0.48, 0.43); // #50A055
    const textColor = rgb(0.2, 0.2, 0.2);
    const lightGray = rgb(0.9, 0.9, 0.9);

    // Header section
    page.drawRectangle({
        x: 0,
        y: height - 120,
        width: width,
        height: 120,
        color: primaryColor,
    });

    page.drawText('INVOICE', {
        x: 50,
        y: height - 70,
        size: 36,
        font: helveticaBold,
        color: rgb(1, 1, 1),
    });

    // Invoice details
    page.drawText(`Invoice #: ${data.order_id}`, {
        x: 50,
        y: height - 140,
        size: 12,
        font: helveticaBold,
        color: textColor,
    });

    page.drawText(`Date: ${new Date(data.time).toLocaleDateString()}`, {
        x: 50,
        y: height - 160,
        size: 10,
        font: helvetica,
        color: textColor,
    });

    // Customer details section
    const customerSection = height - 220;
    page.drawText('Bill To:', {
        x: 50,
        y: customerSection,
        size: 12,
        font: helveticaBold,
        color: primaryColor,
    });

    page.drawText(`${data.delivery_address.FirstName} ${data.delivery_address.LastName}`, {
        x: 50,
        y: customerSection - 20,
        size: 10,
        font: helvetica,
        color: textColor,
    });

    // Address block
    const addressLines = [
        data.delivery_address.streetAddress,
        data.delivery_address.landmark,
        `${data.delivery_address.city}, ${data.delivery_address.state} - ${data.delivery_address.pincode}`,
        `Phone: ${data.delivery_address.phone}`
    ];

    addressLines.forEach((line, index) => {
        page.drawText(line, {
            x: 50,
            y: customerSection - 40 - (index * 15),
            size: 10,
            font: helvetica,
            color: textColor,
        });
    });

    // Items table
    const tableTop = customerSection - 120;
    const tableHeaders = ['Item', 'Quantity', 'Price', 'Discount'];
    const columnWidths = [250, 100, 100, 100];
    const startX = 45;

    // Table header background
    page.drawRectangle({
        x: startX - 5,
        y: tableTop - 5,
        width: width - 80,
        height: 30,
        color: secondaryColor,
    });

    // Draw headers
    let currentX = startX;
    tableHeaders.forEach((header, index) => {
        page.drawText(header, {
            x: currentX,
            y: tableTop + 5,
            size: 11,
            font: helveticaBold,
            color: rgb(1, 1, 1),
        });
        currentX += columnWidths[index];
    });

    // Draw items
    let currentY = tableTop - 30;
    data.items.forEach((item, index) => {
        // Alternate row background
        if (index % 2 === 0) {
            page.drawRectangle({
                x: startX - 5,
                y: currentY - 5,
                width: width - 80,
                height: 25,
                color: lightGray,
            });
        }

        currentX = startX;
        page.drawText(item.product.name, {
            x: currentX,
            y: currentY,
            size: 10,
            font: helvetica,
            color: textColor,
        });

        page.drawText(`${item.quantity / 1000} KG`, {
            x: currentX + columnWidths[0],
            y: currentY,
            size: 10,
            font: helvetica,
            color: textColor,
        });

        page.drawText(`₹${(item.product.regularPrice * (item.quantity / 1000)).toFixed(2)}`, {
            x: currentX + columnWidths[0] + columnWidths[1],
            y: currentY,
            size: 10,
            font: helvetica,
            color: textColor,
        });

        page.drawText(`₹${((data.price.discountPrice) / data.items.length || 0).toFixed(2)}`, {
            x: currentX + columnWidths[0] + columnWidths[1] + columnWidths[2],
            y: currentY,
            size: 10,
            font: helvetica,
            color: textColor,
        });

        currentY -= 30;
    });

    // Summary section
    const summaryY = currentY - 50;
    const summaryItems = [
        { label: 'Subtotal', value: data.price.others.totel.toFixed(2) },
        { label: 'Delivery Charge', value: data.price.others.delivery.toFixed(2) },
        { label: 'Tax', value: data.price.others.tax.toFixed(2) },
        { label: 'Discount', value: data.price.discountPrice.toFixed(2) },
    ];

    // Summary box
    page.drawRectangle({
        x: width - 250,
        y: summaryY - 20,
        width: 200,
        height: 120,
        color: lightGray,
    });

    summaryItems.forEach((item, index) => {
        page.drawText(item.label, {
            x: width - 230,
            y: summaryY - (index * 20),
            size: 10,
            font: helvetica,
            color: textColor,
        });

        page.drawText(`₹${item.value}`, {
            x: width - 100,
            y: summaryY - (index * 20),
            size: 10,
            font: helvetica,
            color: textColor,
        });
    });

    // Total
    page.drawRectangle({
        x: width - 250,
        y: summaryY - 60,
        width: 200,
        height: 30,
        color: primaryColor,
    });

    page.drawText('Total Amount', {
        x: width - 230,
        y: summaryY - 45,
        size: 12,
        font: helveticaBold,
        color: rgb(1, 1, 1),
    });

    page.drawText(`₹${data.price.grandPrice}`, {
        x: width - 100,
        y: summaryY - 45,
        size: 12,
        font: helveticaBold,
        color: rgb(1, 1, 1),
    });

    // Footer
    const footerY = 50;
    page.drawText('Thank you for your business!', {
        x: width / 2 - 70,
        y: footerY,
        size: 12,
        font: helveticaBold,
        color: primaryColor,
    });

    page.drawText('For any queries, please contact our support team', {
        x: width / 2 - 100,
        y: footerY - 20,
        size: 10,
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
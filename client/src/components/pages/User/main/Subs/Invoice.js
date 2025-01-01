import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const downloadInvoice = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Invoice', 14, 22);
    doc.setFontSize(12);
    doc.text(`Order ID: ${data.order_id}`, 14, 32);
    doc.text(`Customer Name: ${data.user?.username}`, 14, 42);
    doc.text(`Order Date: ${new Date(data?.time).toLocaleDateString()}`, 14, 52);
    doc.text(`Total Amount: ₹${data.price?.grandPrice}`, 14, 62);

    autoTable(doc, {  
        head: [['Item', 'Quantity', 'Price', 'Discount Price']],
        body: data.items?.map(item => [
            item.product.name,
            `${item.quantity / 1000} KG`,
            `₹${(item.product.regularPrice * (item.quantity / 1000)).toFixed(2)}`,
            `₹${((data.price.discountPrice) / data.items.length || 0).toFixed(2)}`
        ]),
        startY: 70,
    });

    doc.save('invoice.pdf');
};

export default downloadInvoice;

import React, { useEffect, useState } from 'react';
import { useGetAllOrdersMutation } from '../../../../services/Admin/adminApi';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import OrderDetailsPopup from '../../../parts/popups/OrderDetailsPopup';
import emptyStateImage from "../../../../assets/images/noCAtegory.png";

const SalesReport = () => {
  const [getAllOrders, { data }] = useGetAllOrdersMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateFilterType, setDateFilterType] = useState('range');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [specificDate, setSpecificDate] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateForInput = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  };

  const getPresetDates = (preset) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (preset) {
      case 'today':
        return {
          start: formatDateForInput(today),
          end: formatDateForInput(today)
        };
      case 'yesterday':
        return {
          start: formatDateForInput(new Date(today.getTime() - (24 * 60 * 60 * 1000))),
          end: formatDateForInput(new Date(today.getTime() - (24 * 60 * 60 * 1000)))
        };
      case 'thisWeek': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return {
          start: formatDateForInput(startOfWeek),
          end: formatDateForInput(today)
        };
      }
      case 'lastWeek': {
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        return {
          start: formatDateForInput(startOfLastWeek),
          end: formatDateForInput(endOfLastWeek)
        };
      }
      case 'thisMonth': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          start: formatDateForInput(startOfMonth),
          end: formatDateForInput(today)
        };
      }
      case 'lastMonth': {
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          start: formatDateForInput(startOfLastMonth),
          end: formatDateForInput(endOfLastMonth)
        };
      }
      case 'thisYear': {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        return {
          start: formatDateForInput(startOfYear),
          end: formatDateForInput(today)
        };
      }
      case 'lastYear': {
        const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
        return {
          start: formatDateForInput(startOfLastYear),
          end: formatDateForInput(endOfLastYear)
        };
      }
      case 'last7Days': {
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 6);
        return {
          start: formatDateForInput(last7Days),
          end: formatDateForInput(today)
        };
      }
      case 'last30Days': {
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 29);
        return {
          start: formatDateForInput(last30Days),
          end: formatDateForInput(today)
        };
      }
      default:
        return { start: '', end: '' };
    }
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    if (preset === 'custom') {
      setStartDate('');
      setEndDate('');
      setSpecificDate('');
      return;
    }
    
    const { start, end } = getPresetDates(preset);
    if (dateFilterType === 'range') {
      setStartDate(start);
      setEndDate(end);
    } else {
      setSpecificDate(start);
    }
  };

  useEffect(() => {
    (async () => {
      await getAllOrders().unwrap();
    })();
  }, []);

  // Filter and sort data
  const getFilteredData = () => {
    if (!data) return [];
    
    let filtered = [...data];

    // Apply date filter
    if (dateFilterType === 'range' && (startDate || endDate)) {
      filtered = filtered.filter(order => {
        const orderTimestamp = new Date(order.time);
        const orderDate = new Date(
          orderTimestamp.getFullYear(),
          orderTimestamp.getMonth(),
          orderTimestamp.getDate()
        );

        if (startDate && endDate) {
          const start = new Date(startDate + 'T00:00:00');
          const end = new Date(endDate + 'T23:59:59.999');
          return orderDate >= start && orderDate <= end;
        } else if (startDate) {
          const start = new Date(startDate + 'T00:00:00');
          return orderDate >= start;
        } else if (endDate) {
          const end = new Date(endDate + 'T23:59:59.999');
          return orderDate <= end;
        }
        return true;
      });
    } else if (dateFilterType === 'specific' && specificDate) {
      filtered = filtered.filter(order => {
        const orderTimestamp = new Date(order.time);
        const orderDate = new Date(
          orderTimestamp.getFullYear(),
          orderTimestamp.getMonth(),
          orderTimestamp.getDate()
        );
        
        const compareDate = new Date(specificDate + 'T00:00:00');
        const compareEndDate = new Date(specificDate + 'T23:59:59.999');
        
        return orderDate >= compareDate && orderDate <= compareEndDate;
      });
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.payment_method.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'amount':
          comparison = a.price.grandPrice - b.price.grandPrice;
          break;
        case 'latest':
          comparison = new Date(b.time) - new Date(a.time); 
          break;
        case 'oldest':
          comparison = new Date(a.time) - new Date(b.time);
          break;
        default:
          comparison = a.order_id.localeCompare(b.order_id);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  };

  const formatCurrency = (amount) => {
    return `\u20B9${amount.toFixed(2)}`;  // Using Unicode for Rupee symbol
  };

  // Get current items
  const filteredData = getFilteredData();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, specificDate, searchQuery, sortBy, sortOrder]);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map(order => ({
        'Order ID': order.order_id,
        'Date': formatDate(order.time),
        'Payment Method': order.payment_method,
        'Quantity': `${order.total_quantity/1000}Kg`,
        'Regular Price': formatCurrency(order.price.grandPrice + (order.price.discountPrice + (order.coupon?.amount || 0))),
        'Discount': formatCurrency(order.price.discountPrice + (order.coupon?.amount || 0)),
        'Order Status': order.order_status,
        'Payment Status': order.payment_status,
        'Total Payment': formatCurrency(order.price.grandPrice)
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');
    XLSX.writeFile(workbook, 'sales_report.xlsx');
  };

  const downloadCSV = () => {
    const csv = filteredData.map(order => [
      order.order_id,
      formatDate(order.time),
      order.payment_method,
      `${order.total_quantity/1000}Kg`,
      formatCurrency(order.price.grandPrice + (order.price.discountPrice + (order.coupon?.amount || 0))),
      formatCurrency(order.price.discountPrice + (order.coupon?.amount || 0)),
      order.order_status,
      order.payment_status,
      formatCurrency(order.price.grandPrice)
    ].join(',')).join('\n');

    const headers = ['Order ID', 'Date', 'Payment Method', 'Quantity', 'Regular Price', 'Discount', 'Order Status', 'Payment Status', 'Total Payment'].join(',');
    const blob = new Blob(['\ufeff' + headers + '\n' + csv], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    const formatPDFCurrency = (amount) => {
      return `INR ${amount.toFixed(2)}`;
    };
    
    // Add title
    doc.setFontSize(18);
    doc.text('Sales Report', 14, 22);
    
    // Add date range
    doc.setFontSize(11);
    const dateText = selectedPreset ? 
      `Date Range: ${selectedPreset}` : 
      (startDate && endDate ? 
        `Date Range: ${formatDate(new Date(startDate))} to ${formatDate(new Date(endDate))}` :
        'All Dates');
    doc.text(dateText, 14, 30);

    // Add table
    doc.autoTable({
      startY: 35,
      head: [['Order ID', 'Date', 'Payment Method', 'Quantity', 'Regular Price', 'Discount', 'Status', 'Total']],
      body: filteredData.map(order => [
        order.order_id,
        formatDate(order.time),
        order.payment_method,
        `${order.total_quantity/1000}Kg`,
        formatPDFCurrency(order.price.grandPrice + (order.price.discountPrice + (order.coupon?.amount || 0))),
        formatPDFCurrency(order.price.discountPrice + (order.coupon?.amount || 0)),
        `${order.order_status} / ${order.payment_status}`,
        formatPDFCurrency(order.price.grandPrice)
      ]),
      styles: { 
        fontSize: 8,
        font: 'helvetica'
      },
      headStyles: { 
        fillColor: [31, 173, 99],
        font: 'helvetica',
        fontStyle: 'bold'
      }
    });

    // Add totals
    const finalY = doc.lastAutoTable.finalY || 280;
    doc.setFont('helvetica');
    doc.setFontSize(10);
    doc.text('Summary:', 14, finalY + 10);
    doc.text(`Total Regular Price: ${formatPDFCurrency(filteredData.reduce((total, order) => 
      total + (order.price.grandPrice + (order.price.discountPrice + (order.coupon?.amount || 0))), 0
    ))}`, 14, finalY + 20);
    doc.text(`Total Discount: ${formatPDFCurrency(filteredData.reduce((total, order) => 
      total + (order.price.discountPrice + (order.coupon?.amount || 0)), 0
    ))}`, 14, finalY + 30);
    doc.text(`Total Payment: ${formatPDFCurrency(filteredData.reduce((total, order) => 
      total + order.price.grandPrice, 0
    ))}`, 14, finalY + 40);

    doc.save('sales_report.pdf');
  };

  const EmptyState = () => (
    <div className="w-full h-[60vh] flex items-center justify-center flex-col text-center gap-5">
      <img className="h-[70%]" src={emptyStateImage} alt="No orders" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">No Orders</h1>
        <p className="opacity-45">No orders found for the selected criteria</p>
      </div>
    </div>
  );

  return (
    <>
    <div className='w-[100%] bg-[#f2f2f2] rounded-tl-[50px] h-full mt-[100px] overflow-scroll'>
      <div className="w-full h-full">
        <div className="h-full w-full">
          <span className='w-full h-full flex flex-col px-20'>
            <div className="w-full overflow-scroll flex flex-col">
              {/* Overall Statistics */}

              <span className='flex w-full gap-5 items-center justify-center pt-6'>

              <div className="grid grid-cols-2 gap-4 w-1/2">
                <div className="bg-[#1fad631a] p-4 rounded-[20px]">
                  <div className="flex items-center gap-3">
                    <i className="ri-shopping-cart-2-line text-[24px] text-[#1fad63]"></i>
                    <div>
                      <p className="text-gray-600">Overall Orders</p>
                      <p className="text-[20px] font-bold">{data ? data.length : 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#1fad631a] p-4 rounded-[20px]">
                  <div className="flex items-center gap-3">
                    <i className="ri-money-dollar-circle-line text-[24px] text-[#1fad63]"></i>
                    <div>
                      <p className="text-gray-600">Overall Sales</p>
                      <p className="font-bold text-[20px]">
                        {data ? formatCurrency(data.reduce((total, order) => total + order.price.grandPrice, 0)) : formatCurrency(0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

               {/* Totals Section */}
              {filteredData.length > 0 && (
                    <div className="mr-24 w-1/2">
                      <div className="bg-[#0000000e] full rounded-[20px] py-3 px-6">
                        <div className="grid grid-cols-3 gap-8">
                          <div className="flex items-center gap-3">
                            <i className="ri-money-dollar-circle-line text-[20px] text-[#1fad63]"></i>
                            <div>
                              <p className="text-sm text-gray-600">Total Regular Price</p>
                              <p className="text-lg font-medium">
                                {formatCurrency(filteredData.reduce((total, order) => 
                                  total + (order.price.grandPrice + (order.price.discountPrice + (order.coupon?.amount || 0))), 0
                                ))}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <i className="ri-coupon-line text-[20px] text-[#1fad63]"></i>
                            <div>
                              <p className="text-sm text-gray-600">Total Discount</p>
                              <p className="text-lg font-medium text-red-500">
                                {formatCurrency(filteredData.reduce((total, order) => 
                                  total + (order.price.discountPrice + (order.coupon?.amount || 0)), 0
                                ))}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <i className="ri-wallet-3-line text-[20px] text-[#1fad63]"></i>
                            <div>
                              <p className="text-sm text-gray-600">Total Payment</p>
                              <p className="text-lg font-medium">
                                {formatCurrency(filteredData.reduce((total, order) => 
                                  total + order.price.grandPrice, 0
                                ))}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
              )}
              </span>



              {/* Search and Filter Section */}
              <div className="flex flex-col gap-4 mb-4">
                <div className="w-full flex items-center gap-5 flex-wrap pt-8 pb-2">
                  {/* Unified Date Selector */}
                  <h2 className="text-2xl font-bold">Sales report</h2>
                  <div className="bg-[#00000008] py-1 px-4 flex gap-4 rounded-full items-center">
                    <i className="ri-calendar-line text-[20px] text-[#1fad63]"></i>
                    <select 
                      className="bg-transparent outline-none custom-selecter"
                      value={selectedPreset || dateFilterType}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (['range', 'specific'].includes(value)) {
                          setDateFilterType(value);
                          setStartDate('');
                          setEndDate('');
                          setSpecificDate('');
                          setSelectedPreset('');
                        } else {
                          handlePresetChange(value);
                        }
                      }}
                    >
                      <option value="">Select date option</option>
                      {/* <option value="range">Date Range</option> */}
                      <option value="specific">Specific Date</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="thisWeek">This Week</option>
                      <option value="lastWeek">Last Week</option>
                      <option value="thisMonth">This Month</option>
                      <option value="lastMonth">Last Month</option>
                      <option value="thisYear">This Year</option>
                      <option value="lastYear">Last Year</option>
                      <option value="last7Days">Last 7 Days</option>
                      <option value="last30Days">Last 30 Days</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>

                  {/* Date Input Fields */}
                  {dateFilterType === 'range' ? (
                    <div className="bg-[#00000008] py-[10px] px-4 flex gap-4 rounded-full items-center">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setSelectedPreset('custom');
                        }}
                        className="bg-transparent outline-none"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setSelectedPreset('custom');
                        }}
                        className="bg-transparent outline-none"
                      />
                    </div>
                  ) : dateFilterType === 'specific' ? (
                    <div className="bg-[#00000008] py-[10px] px-4 flex gap-4 rounded-full items-center">
                      <input
                        type="date"
                        value={specificDate}
                        onChange={(e) => {
                          setSpecificDate(e.target.value);
                          setSelectedPreset('custom');
                        }}
                        className="bg-transparent outline-none"
                      />
                    </div>
                  ) : null}

                  {/* Search Field */}
                  <div className="bg-[#00000008] py-[10px] px-4 flex gap-4 rounded-full items-center">
                    <input
                      className="bg-transparent outline-none w-40"
                      type="text"
                      placeholder="Search here"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <i className="ri-search-2-line text-[20px] text-[#1fad63]"></i>
                  </div>

                  {/* Sort Selector */}
                  <div className="bg-[#00000008] py-1 px-4 flex gap-4 rounded-full items-center">
                    <i className="ri-align-left text-[20px] text-[#1fad63]"></i>
                    <select 
                      className="bg-transparent outline-none custom-selecter"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Order ID</option>
                      <option value="amount">Amount</option>
                      <option value="latest">Latest</option>
                      <option value="oldest">Oldest</option>
                    </select>
                  </div>

                  {/* Order Selector */}
                  <div className="bg-[#00000008] py-1 px-4 flex gap-4 rounded-full items-center">
                    <i className="ri-align-justify text-[20px] text-[#1fad63]"></i>
                    <select 
                      className="bg-transparent outline-none custom-selecter"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="h-[calc(100vh-250px)] overflow-auto relative">
                {currentItems.length > 0 ? (
                  <div className="relative">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-[linear-gradient(to_right,#1111,#f1f5f9)] backdrop-blur-xl">
                          <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600 rounded-l-full">Order ID</th>
                          <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">Time</th>
                          <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">Payment Method</th>
                          <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">Items Qty</th>
                          <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">Regular Price</th>
                          <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">Discount</th>
                          <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">Status</th>
                          <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600 rounded-r-full">Total Payment</th>
                        </tr>
                      </thead>
                      <tr><th>&nbsp;</th></tr>
                      <tbody className="overflow-scroll">
                        {currentItems.map((order) => (
                          <tr 
                            key={order.order_id} 
                            className="hover:bg-gray-200 cursor-pointer transition-all duration-200"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowPopup(true);
                            }}
                          >
                            <td className="px-3 py-2">
                              <p className="font-medium text-[13px]">{order.order_id}</p>
                            </td>
                            <td className="px-3 py-2">{formatDate(order.time)}</td>
                            <td className="px-3 py-2">{order.payment_method}</td>
                            <td className="px-3 py-2">{order.total_quantity/1000}Kg</td>
                            <td className="px-3 py-2 font-medium">{formatCurrency(order.price.grandPrice + (order.price.discountPrice+(order.coupon?.amount||0)))}</td>
                            <td className="px-3 py-2 text-red-500 font-bold">
                              {formatCurrency(order.price.discountPrice+(order.coupon?.amount||0))}</td>
                            <td className="px-3 py-2">
                              <div className="flex flex-col">
                                <span className="text-sm">Order: {order.order_status}</span>
                                <span className="text-sm text-gray-500">Payment: {order.payment_status}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 font-bold">{formatCurrency(order.price.grandPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination and Download Options */}
                    <span className='flex gap-8 absolute -bottom-24 border-2 border-gray-300 backdrop-blur-3xl items-center justify-center left-[45%] -translate-x-1/2 px-14 rounded-full py-2'>
                      {/* Pagination */}
                      {filteredData.length > 0 && (
                        <div className="flex gap-10 justify-between items-center mt-4 pb-4">
                          <div className="text-sm text-gray-600 text-nowrap">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
                          </div>

                          {[...Array(Math.ceil(filteredData.length / itemsPerPage))].length > 1 && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-full ${
                                  currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                Previous
                              </button>
                              {[...Array(Math.ceil(filteredData.length / itemsPerPage))].map((_, index) => (
                                <button
                                  key={index + 1}
                                  onClick={() => paginate(index + 1)}
                                  className={`px-3 py-1 rounded-full ${
                                    currentPage === index + 1
                                      ? 'bg-[#1fad631a] text-black'
                                      : 'bg-white text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {index + 1}
                                </button>
                              ))}
                              <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                                className={`px-3 py-1 rounded-full ${
                                  currentPage === Math.ceil(filteredData.length / itemsPerPage)
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                Next
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Download Options */}
                      {filteredData.length > 0 && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={downloadExcel}
                            className="px-4 py-2 bg-[#00000010] text-green-700 rounded-full hover:bg-green-200 flex items-center gap-2"
                          >
                            <i className="ri-file-excel-2-line"></i>
                            Excel
                          </button>
                          <button
                            onClick={downloadCSV}
                            className="px-4 py-2 bg-[#00000010] text-blue-700 rounded-full hover:bg-blue-200 flex items-center gap-2"
                          >
                            <i className="ri-file-text-line"></i>
                            CSV
                          </button>
                          <button
                            onClick={downloadPDF}
                            className="px-4 py-2 bg-[#00000010] text-red-700 rounded-full hover:bg-red-200 flex items-center gap-2"
                          >
                            <i className="ri-file-pdf-line"></i>
                            PDF
                          </button>
                        </div>
                      )}
                    </span>
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>

    {/* Order Details Popup */}
    {showPopup && (
      <OrderDetailsPopup
        showPopup={setShowPopup}
        order={selectedOrder}
      />
    )}
    </>
  );
};

export default SalesReport;

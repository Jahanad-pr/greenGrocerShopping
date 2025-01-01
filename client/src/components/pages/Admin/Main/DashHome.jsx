import React, { useState, useEffect } from 'react'
import picr from "../../../../assets/images/picr.png";
// import pic from "../../../../assets/images/image 32.png";
import ind from "../../../../assets/images/indicator.png";
import MainChart from '../../../parts/Main/MainChart';
import AngleCircle from '../../../parts/Main/AngleCircleChart';
import LineChart from '../../../parts/Main/LineChart';
import Recents from '../../../parts/Main/Recents';
// import { downloadSalesReport } from '../../../../services/Admin/salesApi';
import { useNavigate } from 'react-router-dom';
import { useGetAllOrdersMutation, useGetChartsDetailsMutation } from '../../../../services/Admin/adminApi';
import { motion, AnimatePresence } from 'framer-motion';
import StatisticPopup from '../../../parts/popups/StatisticPopup';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DashHome() {

  const [getChartsDetails, { data }] = useGetChartsDetailsMutation()
  const [getAllOrders, { data:recentOrders }] = useGetAllOrdersMutation();

  
  const [downloadFormat, setDownloadFormat] = useState('pdf');
  const mainChartRef = React.useRef(null);
  const lineChartRef = React.useRef(null);

  const downloadChart = (chartType) => {
    const chartRef = chartType === 'main' ? mainChartRef : lineChartRef;
    const chartContainer = chartRef.current;
    
    if (!chartContainer) return;
    
    if (downloadFormat === 'pdf') {
      html2canvas(chartContainer, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        width: chartContainer.offsetWidth,
        height: chartContainer.offsetHeight,
        useCORS: true,
        allowTaint: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate totals
        const totalSales = data.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
        const totalOrders = data.reduce((acc, curr) => acc + (curr.totalOrders || 0), 0);
        
        // Create PDF
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [1080, 720]
        });pic

        // Add title
        pdf.setFontSize(28);
        pdf.setTextColor(51, 51, 51);
        pdf.text(chartType === 'main' ? 'Sales Analysis Report' : 'Sales Trend Analysis', 50, 50);
        
        // Add company name
        pdf.setFontSize(16);
        pdf.setTextColor(102, 102, 102);
        pdf.text('Green Grocer Analytics', 50, 80);

        // Add date range
        const startDate = new Date(data[0]?.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const endDate = new Date(data[data.length - 1]?.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        pdf.text(`Period: ${startDate} - ${endDate}`, 50, 100);

        // Add generation timestamp
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        pdf.text(`Generated on: ${currentDate}`, 50, 120);

        // Add chart
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const chartWidth = pageWidth - 100;
        const chartHeight = 300;
        pdf.addImage(imgData, 'PNG', 50, 140, chartWidth, chartHeight);

        // Add summary section
        let yPos = chartHeight + 180;
        pdf.setFontSize(20);
        pdf.setTextColor(51, 51, 51);
        pdf.text('Sales Summary', 50, yPos);

        // Add summary table
        yPos += 40;
        pdf.setFontSize(16);
        pdf.setFillColor(245, 245, 245);
        pdf.rect(50, yPos - 25, 400, 35, 'F');

        pdf.text(`Total Revenue: INR ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 60, yPos);
        pdf.text(`Total Orders: ${totalOrders.toLocaleString()}`, 350, yPos);

        // Add footer
        pdf.setFontSize(12);
        pdf.setTextColor(128, 128, 128);
        pdf.text(' Green Grocer Analytics - Confidential Report', 50, pageHeight - 30);

        pdf.save(`${chartType === 'main' ? 'sales-analysis' : 'sales-trend'}-report.pdf`);
      });
    } else if (downloadFormat === 'csv') {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Date,Total Sales (INR),Orders\n";

      data.forEach(item => {
        csvContent += `${item.date},INR ${item.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })},${item.totalOrders}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${chartType === 'main' ? 'sales-analysis' : 'sales-trend'}-report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState('thisYear');
  const [showCustomDate, setShowCustomDate] = useState(false);
  // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [viewMode, setViewMode] = useState('category');

  useEffect(() => {
    (async()=>{ 
      await getAllOrders().unwrap() 
      await getChartsDetails(`filterby=salesPeriod&period=thisYear`).unwrap()
    })()
  },[])


  const navigate = useNavigate()

  const periodOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'lastWeek', label: 'Last Week' },
    { value: 'last7Days', label: 'Last 7 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'last30Days', label: 'Last 30 Days' },
    { value: 'last50Days', label: 'Last 50 Days' },
    { value: 'last100Days', label: 'Last 100 Days' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handlePeriodChange = async (e) => {
    const period = e.target.value;
    setSelectedPeriod(period);
    
    if (period === 'custom') {
      setShowCustomDate(true);
    } else {
      setShowCustomDate(false);
      await getChartsDetails(`filterby=salesPeriod&period=${period}`).unwrap();
    }
  };

  const handleCustomDateApply = async () => {
    await getChartsDetails(`filterby=salesPeriod&period=custom&startDate=${startDate}&endDate=${endDate}`).unwrap();
  };

  return (
    <>
      <div className='w-[75%] h-full pt-[86px] rounded-tl-3xl overflow-scroll'>
        <div className="w-full h-full flex">

          {/* container root */}
          <div className="h-full w-[100%] flex flex-wrap">

            <Analys />

            {/* profile pic section */}
            <div className="w-[50%] h-[35%] ">
              <div className="aspect-square h-full  rounded-full inline-flex relative gap-10 items-center">
                <img className="h-full object-cover absolute" src={picr} alt="" />
                <img className="h-full rounded-full" src='/ph-pic.jpg' alt="" />
                <span className='w-full flex flex-col gap-3 pt-8'>
                  <h1 className="text-[45px] font-bold leading-none  font-['Lufga']">Welcome Shalu</h1>
                  <p className="text-[13px] opacity-75">this is your world !</p>
                  <p className=" opacity-45">
                    An admin is a user with special access to manage and control the system,ities.
                  </p>

                </span>
              </div>
            </div>

            {/* chart section */}
            <div className="w-[50%] max-h-[55%] flex flex-col">
              <div className="w-full flex flex-col max-h-full rounded-3xl">
                <h1 className='text-[30px] ml-5 font-["Lufga"]'>Orders</h1>
                <MainChart
                setIsPopupOpen={setIsPopupOpen}
                isPopupOpen={isPopupOpen}
                data={data} 
                chartRef={mainChartRef} 
                downloadChart={() => downloadChart('main')} 
                downloadFormat={downloadFormat} 
                setDownloadFormat={setDownloadFormat} 
                /> 
              </div>
            </div>

            <LineCharts 
              data={data} 
              viewMode={viewMode} 
              selectedPeriod={selectedPeriod} 
              periodOptions={periodOptions} 
              startDate={startDate} 
              endDate={endDate} 
              handlePeriodChange={handlePeriodChange} 
              downloadFormat={downloadFormat} 
              setDownloadFormat={setDownloadFormat} 
              setViewMode={setViewMode} 
              showCustomDate={showCustomDate} 
              setStartDate={setStartDate} 
              setEndDate={setEndDate} 
              handleCustomDateApply={handleCustomDateApply} 
              chartRef={lineChartRef} 
              downloadChart={() => downloadChart('line')} 
            />

          </div>



        </div>

        {/* secondpage----------------------------------------------------------> */}

        <div className="w-full h-full">

          {/* Stats Containers */}
          <div className="w-full h-[55%] flex gap-5 ">
            {/* Top Products Container */}
          <TopProduct   navigate={navigate}  />

            {/* Top Categories Container */}
          <ToCollections  />
          </div>

          {/* profile deatail and message */}
          {/* <div className=" justify-center max-w-[50%] flex-1">



<AngleCircle />


</div> */}

          <h1 className='text-[30px] ml-5 font-["Lufga"] mb-4'>Sales report</h1>
          <p className='max-w-[700px] ml-5 mb-12 opacity-55'>
            Sales report is a comprehensive summary of all the sales made by your business. 
            It provides an overview of the sales data, including the total sales amount, 
            average sale amount, and the number of sales. 
            It also provides a detailed breakdown of the sales by product category, 
            product, and sales channel. 
            You can use this report to analyze your sales data and make informed decisions 
            about your business.
          </p>
          <button onClick={() => navigate('/admin/sales')} className='bg-blue-500 ml-5 hover:bg-blue-600 text-white px-8 py-3 rounded-full leading-none'>See the sales Report</button>


        </div>

        
        


      </div>
      <Recents page={'dash'} datas={recentOrders} />
    </ >

  )
}




function LineCharts({data, viewMode, selectedPeriod, periodOptions, startDate, endDate, handlePeriodChange, downloadFormat, setDownloadFormat, setViewMode, showCustomDate, setStartDate, setEndDate, handleCustomDateApply, chartRef, downloadChart}) {

  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const cancelHandler = () => {
    setIsPopupOpen(false);
  }

  const applyHandler = () => {
    if (selectedPeriod === 'custom') {
      handleCustomDateApply();
    }
    setIsPopupOpen(false);
  }

  return (
    <div className="w-[50%] max-h-[55%] flex flex-col pl-6">
      <div className="w-full flex flex-col">
        <div className="flex flex-col w-full">
          <div className="flex justify-between ">
            <h1 className='text-[30px] ml-5 font-["Lufga"]'>Earnings</h1>

            <div className="inline-flex gap-5 items-center rounded-full">
              <select 
                value={downloadFormat} 
                onChange={(e) => setDownloadFormat(e.target.value)} 
                className="p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 custom-selecter"
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </select>
            <button
              onClick={downloadChart}
              className="bg-[#ff8137] p-2 rounded-full hover:bg-[#ff9137] transition-colors"
            >
              <i className="ri-download-fill text-[22px] text-white"></i>
            </button>
            <button 
              onClick={() => setIsPopupOpen(true)}
              className="p-2 bg-gray-200 text-white rounded-full hover:bg-gray-600 transition-colors"
            > <i className="ri-settings-3-line text-[23px] text-black"></i>
            </button>
            </div>

            
          </div>
          <LineChart 
            data={data || []} 
            viewMode={viewMode} 
            selectedPeriod={selectedPeriod} 
            startDate={startDate} 
            endDate={endDate} 
            chartRef={chartRef} 
          />
        </div>

        <AnimatePresence>
          {isPopupOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='w-screen h-screen absolute left-0 top-0 bg-[#00000083] backdrop-blur-sm z-20 grid place-items-center text-white'
            >
              {/* Backdrop with blur */}
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
                onClick={cancelHandler}
              />

              <motion.div 
                initial={{ 
                  scale: 0.4,
                  opacity: 0,
                  rotateX: 90,
                  y: -60
                }}
                animate={{ 
                  scale: [0.4, 1.1, 1],
                  opacity: 1,
                  rotateX: 0,
                  y: 0
                }}
                exit={{ 
                  scale: 0.4,
                  opacity: 0,
                  rotateX: -90,
                  y: 60
                }}
                transition={{ 
                  type: "spring",
                  damping: 15,
                  stiffness: 300,
                  bounce: 0.4,
                  duration: 0.6
                }}
                style={{
                  transformPerspective: 1200,
                  transformStyle: "preserve-3d"
                }}
                className="w-full max-w-[550px] backdrop-blur-2xl py-10 bg-[linear-gradient(45deg,#00000080,#412524)] flex items-center justify-center flex-col gap-5 rounded-3xl px-10 relative z-10"
              >
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className='text-[25px] font-bold text-center leading-none'
                >
                  Chart Controls
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: .45 }}
                  transition={{ delay: 0.3 }}
                  className='opacity-45 translate-y-[-18px] text-center px-10 leading-none'
                >
                  Customize your chart view and settings
                </motion.p>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full flex flex-col gap-4 px-5"
                >
                  {/* Period Selector */}
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-2">Period</label>
                    <select 
                      value={selectedPeriod}
                      onChange={handlePeriodChange}
                      className="w-full p-3 bg-[#ffffff20] border border-white/20 rounded-xl text-white custom-selectero"
                    >
                      {periodOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-black text-white">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-2">View Mode</label>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode('category')}
                        className={`flex-1 p-3 rounded-xl transition-all ${
                          viewMode === 'category' 
                            ? 'bg-[linear-gradient(to_left,#7c165a,#dc262670)]' 
                            : 'border-2 border-red-900'
                        }`}
                      >
                        Categories
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode('total')}
                        className={`flex-1 p-3 rounded-xl transition-all ${
                          viewMode === 'total' 
                            ? 'bg-[linear-gradient(to_left,#7c165a,#dc262670)]' 
                            : 'border-2 border-red-900'
                        }`}
                      >
                        Total
                      </motion.button>
                    </div>
                  </div>

                  {/* Download Format */}
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">Download Format</label>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => downloadChart()}
                        className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                        title="Download Chart Data"
                      >
                        <i className="ri-download-fill text-[13px]"></i>
                      </motion.button>
                    </div>
                    <select 
                      value={downloadFormat} 
                      onChange={(e) => setDownloadFormat(e.target.value)}
                      className="w-full p-3 bg-[#ffffff20] border border-white/20 rounded-xl text-white"
                    >
                      <option value="svg" className="bg-black text-white">SVG</option>
                      <option value="png" className="bg-black text-white">PNG</option>
                      <option value="jpg" className="bg-black text-white">JPG</option>
                      <option value="csv" className="bg-black text-white">CSV</option>
                    </select>
                  </div>

                  {/* Custom Date Range */}
                  {selectedPeriod === 'custom' && (
                    <div className="w-full">
                      <label className="block text-sm font-medium mb-2">Custom Date Range</label>
                      <div className="flex space-x-2">
                        <input 
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="flex-1 p-3 bg-[#ffffff20] border border-white/20 rounded-xl text-white"
                        />
                        <input 
                          type="date" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="flex-1 p-3 bg-[#ffffff20] border border-white/20 rounded-xl text-white"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-full flex gap-3 px-5 mt-4"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelHandler} 
                    className="flex-1 border-2 border-red-900 rounded-2xl grid place-items-center text-[13px] font-medium py-3 text-white cursor-pointer"
                  >
                    Cancel
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={applyHandler} 
                    className="flex-1 bg-[linear-gradient(to_left,#7c165a,#dc262670)] rounded-2xl grid place-items-center font-medium text-[13px] py-3 cursor-pointer"
                  >
                    Confirm
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


    function TopProduct({navigate}) {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  const [getChartsDetails, { data:datas, isLoading }] = useGetChartsDetailsMutation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query;
        if (selectedPeriod === 'custom') {
          query = `filterby=topProducts&period=custom&startDate=${customStartDate}&endDate=${customEndDate}`;
        } else if (selectedPeriod === 'all-time') {
          query = `filterby=topProducts`;
        } else {
          query = `filterby=topProducts&period=${selectedPeriod}`;
        }
        await getChartsDetails(query).unwrap();
      } catch (error) {
        console.error('Error fetching top products:', error);
      }
    };

    if (selectedPeriod !== 'custom' || (customStartDate && customEndDate)) {
      fetchData();
    }
  }, [selectedPeriod, customStartDate, customEndDate]);

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      setSelectedPeriod('custom');
      setShowCustomDateModal(false);
    }
  };

  const periodOptions = [
    { value: 'today', label: "Today" },
    { value: 'yesterday', label: "Yesterday" },
    { value: 'thisWeek', label: "This Week" },
    { value: 'lastWeek', label: "Last Week" },
    { value: 'thisMonth', label: "This Month" },
    { value: 'lastMonth', label: "Last Month" },
    { value: 'thisYear', label: "This Year" },
    { value: 'lastYear', label: "Last Year" },
    { value: 'last7Days', label: "Last 7 Days" },
    { value: 'last10Days', label: "Last 10 Days" },
    { value: 'last15Days', label: "Last 15 Days" },
    { value: 'last30Days', label: "Last 30 Days" },
    { value: 'last50Days', label: "Last 50 Days" },
    { value: 'last100Days', label: "Last 100 Days" },
    { value: 'custom', label: "Custom Period" },
    { value: 'all-time', label: "All-Time" }
  ];

  return (
    <div className="flex-1 rounded-3xl  text-white p-5 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className='text-[22px] font-["Lufga"] text-gray-800'>Top Products</h2>
        <div className="flex items-center gap-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedPeriod(value);
              if (value === 'custom') {
                setShowCustomDateModal(true);
              }
            }}
            className="text-sm text-gray-500 font-medium px-4 custom-selectero py-2 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-blue-500"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* <button 
            onClick={() => navigate('/admin/sales')} 
            className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm transition-colors'
          >
            View All
          </button> */}
        </div>
      </div>

      {showCustomDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Select Custom Date Range</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input 
                type="date" 
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input 
                type="date" 
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowCustomDateModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full"
              >
                Cancel
              </button>
              <button 
                onClick={handleCustomDateSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-full"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-y-auto h-[calc(100%-60px)] pr-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          datas?.map((item, index) => (
            <div key={index} className="flex items-center justify-between mb-4 bg-gray-100 p-3 px-8 rounded-3xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 leading-none">
                <img 
                  src={item.productImage} 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium object-cover"
                  alt={item.productName}
                />
                <div>
                  <h3 className="font-medium text-gray-800 text-[20px] mb-1 leading-none">
                    {item?.productName}
                  </h3>
                  <p className="text-sm text-black opacity-45 leading-none text-[13px]">
                    {item.categoryName}
                  </p>
                </div>
              </div>
              <div className="text-right leading-none">
                <p className="font-semibold text-gray-800">₹{item.totalRevenue.toFixed(0)}</p>
                <p className="text-sm text-green-500 leading-none">{item.totalOrders} Orders</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

    function ToCollections({category, index}) {
      const [selectedPeriod, setSelectedPeriod] = useState('thisWeek');
      const [getChartsDetails, { data:datas, isLoading }] = useGetChartsDetailsMutation()

      useEffect(() => {
        const fetchData = async () => {
          try {
            const query = selectedPeriod === 'all-time' 
              ? `filterby=topCategories`
              : `filterby=topCategories&period=${selectedPeriod}`;
            await getChartsDetails(query).unwrap();
          } catch (error) {
            console.error('Error fetching top categories:', error);
          }
        };
        fetchData();
      }, [selectedPeriod]);

      return (
        <div className="flex-1 rounded-3xl  p-5 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className='text-[22px] font-["Lufga"] text-gray-800 leading-none'>Top Categories</h2>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm text-gray-500 font-medium px-4 py custom-selectero  bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="thisWeek">This Week</option>
              <option value="lastWeek">Last Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
              <option value="all-time">All Time</option>
            </select>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)] pr-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              datas?.map((category, index) => (
                <div key={index} className="flex items-center justify-between mb-4 bg-gray-100 p-3 px-5 rounded-3xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-8 rounded-full`}></span>
                    <div>
                      <h3 className="font-medium text-gray-800 leading-none mb-2 text-[20px]">{category.categoryName}</h3>
                      <p className="text-sm text-black opacity-45 leading-none">{category.totalOrders} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-700 leading-none">₹ {category.totalRevenue}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
        }



        function Analys({}) {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedStatistic, setSelectedStatistic] = useState(null);
  const [getChartsDetails, { data:datas, isLoading }] = useGetChartsDetailsMutation()

  useEffect(() => {
    (async()=>{ 
      await getChartsDetails(`filterby=overallAnalytics&period=${selectedPeriod}`).unwrap() 
    })()
  },[selectedPeriod])



  const periodOptions = [
    { value: 'today', label: "Today" },
    { value: 'yesterday', label: "Yesterday" },
    { value: 'thisWeek', label: "This Week" },
    { value: 'lastWeek', label: "Last Week" },
    { value: 'thisMonth', label: "This Month" },
    { value: 'lastMonth', label: "Last Month" },
    { value: 'thisYear', label: "This Year" },
    { value: 'lastYear', label: "Last Year" },
    { value: 'last7Days', label: "Last 7 Days" },
    { value: 'last30Days', label: "Last 30 Days" }
  ];

  // const StatisticPopup = ({ type, onClose }) => {
  //   // Function to format field names and values
  //   const formatFieldName = (key) => {
  //     // Remove camelCase and convert to Title Case
  //     return key
  //       .replace(/([A-Z])/g, ' $1')  // Insert space before capital letters
  //       .replace(/^./, function(str){ return str.toUpperCase(); })  // Capitalize first letter
  //   };

  //   // Function to format values (add currency, percentage, etc.)
  //   const formatValue = (key, value) => {
  //     // Check for specific formatting based on key
  //     if (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('price')) {
  //       return `₹${value}`;
  //     }
  //     if (key.toLowerCase().includes('percentage') || key.toLowerCase().includes('percent')) {
  //       return `${value}%`;
  //     }
  //     return value;
  //   };

  //   // Filter out unwanted keys and create formatted list
  //   const formattedFields = Object.entries(type || {})
  //     .filter(([key]) => {
  //       // Exclude these keys from display
  //       const excludedKeys = [
  //         'id', 
  //         'createdAt', 
  //         'updatedAt', 
  //         'deletedAt', 
  //         '__v', 
  //         '_id'
  //       ];
  //       return !excludedKeys.some(excluded => key.toLowerCase().includes(excluded));
  //     })
  //     .map(([key, value]) => ({
  //       label: formatFieldName(key),
  //       value: formatValue(key, value)
  //     }));

  //   return (
  //     <AnimatePresence>
  //       <motion.div 
  //         initial={{ opacity: 0 }}
  //         animate={{ opacity: 1 }}
  //         exit={{ opacity: 0 }}
  //         className='w-screen h-screen absolute left-0 top-0 bg-[#00000083] backdrop-blur-sm z-20 grid place-items-center text-white'
  //       >
  //         <motion.div
  //           initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
  //           animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
  //           exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
  //           transition={{ duration: 0.5 }}
  //           className="absolute inset-0"
  //           onClick={onClose}
  //         />

  //         <motion.div 
  //           initial={{ 
  //             scale: 0.4,
  //             opacity: 0,
  //             rotateX: 90,
  //             y: -60
  //           }}
  //           animate={{ 
  //             scale: 1,
  //             opacity: 1,
  //             rotateX: 0,
  //             y: 0
  //           }}
  //           exit={{ 
  //             scale: 0.4,
  //             opacity: 0,
  //             rotateX: 90,
  //             y: -60
  //           }}
  //           transition={{ 
  //             type: "spring", 
  //             stiffness: 300, 
  //             damping: 20 
  //           }}
  //           className="bg-white rounded-3xl p-8 w-[600px] shadow-2xl relative z-30"
  //         >
  //           <div className="flex justify-between items-center mb-6">
  //             <h2 className="text-2xl font-bold text-gray-800">
  //               {formattedFields.length > 0 ? `${formattedFields[0].label.split(' ')[0]} Details` : 'Details'}
  //             </h2>
  //             <button 
  //               onClick={onClose}
  //               className="text-gray-500 hover:text-gray-800 transition-colors"
  //             >
  //               ✕
  //             </button>
  //           </div>
            
  //           <div className="space-y-4">
  //             {formattedFields.map((item, index) => (
  //               <div 
  //                 key={index} 
  //                 className="flex justify-between items-center bg-gray-100 p-4 rounded-xl"
  //               >
  //                 <span className="text-gray-700 font-medium">{item.label}</span>
  //                 <span className="text-gray-900 font-bold">{item.value}</span>
  //               </div>
  //             ))}
  //           </div>
  //         </motion.div>
  //       </motion.div>
  //     </AnimatePresence>
  //   );
  // };

  const handleStatisticClick = (type) => {
    setSelectedStatistic(type);
  };

  return (<>
    <div className="w-[50%] max-h-[50%] flex flex-col relative ">
      <div className="flex justify-between items-center mb-4">
        <h1 className='text-[35px] ml-5 font-["Lufga"]'>Statistics</h1>
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="text-sm absolute left-5 bottom-5 custom-selectero text-gray-500 font-medium px-4 py-2 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-blue-500"
        >
          {periodOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="inline-flex justify-center absolute left-1/2 top-1/2 translate-x-[-30%] translate-y-[-46%] font-['lufga']">
        <div 
          className="w-48 h-48 bg-gradient-to-r p-2 from-[#3f9894] text-black to-[#784222] rounded-full cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handleStatisticClick(datas?.orders)}
        >
          <span className='rounded-full bg-white/80 w-full h-full  flex items-center justify-center flex-col leading-none'>
            <p className='text-[13px]  opacity-70'>Total Deals</p>
            <p className='text-[28px] font-bold font-mono'>{datas?.orders?.totalOrders || '0'}</p>
          </span>
        </div>

        <div 
          className="w-48 h-48 bg-gradient-to-l from-[#3f9894] p-2 to-[#5460c5] text-black rounded-full relative translate-x-[-50%] translate-y-[50%] cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handleStatisticClick(datas?.customers)}
        >
          <span className=' bottom-0 left-0 rounded-full flex bg-white/80 w-full h-full items-center justify-center flex-col leading-none'>
            <p className='text-[13px] text-center  opacity-70 mb-2'>Total <br /> Customers</p>
            <p className='text-[28px] font-bold'>{datas?.customers?.totalCustomers || '0'}</p>
          </span> 
        </div>

        <div 
          className="w-56 h-56 bg-gradient-to-r from-[#ae5c2d] p-2 to-[#383f80] rounded-full relative translate-x-[-100%] translate-y-[-20%] cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handleStatisticClick(datas?.orders)}
        >
          <div className='w-full h-full flex items-center bg-white/80 justify-center rounded-full flex-col leading-none'>
            <p className='text-[20px] text-center opacity-70 mb-3'>Total <br /> Revenue</p>
            <p className='text-[32px] font-bold font-mono'>₹ {datas?.orders.totalRevenue || '0'}</p>
          </div>
        </div>
      </div>
    </div>

    {selectedStatistic && (
      <StatisticPopup 
        type={selectedStatistic} 
        onClose={() => setSelectedStatistic(null)} 
      />
    )}
  </>);
}
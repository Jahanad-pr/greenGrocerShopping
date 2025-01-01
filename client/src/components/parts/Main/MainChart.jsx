import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetChartsDetailsMutation } from '../../../services/Admin/adminApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MainChart = ({setIsPopupOpen,
  isPopupOpen }) => {

  const [getChartsDetails, { data }] = useGetChartsDetailsMutation()

  useEffect(()=>{ (()=>{ if(data){ console.log(data) }  })() },[data])

  useEffect(()=>{ (async()=>{ await getChartsDetails(`filterby=salesPeriod&period=custom`).unwrap() })() },[])


  const [downloadFormat, setDownloadFormat] = useState('pdf');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState('thisWeek');
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [viewMode, setViewMode] = useState('category'); // 'category' or 'total'
  


  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'fruits',
        data: [0]
      },
      {
        name: 'vegetables',
        data: [0]
      }
    ],
    options: {
      chart: {
        width: "100%",
        height: "100%",
        type: 'area',
        toolbar: {
          show: false
        },
        padding: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0,
          stops: [0, 100, 100]
        }
      },
      colors: ['#FF7E5C', '#3549F8'],
      grid: {
        borderColor: '#90A4AE',
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        }
      },
      xaxis: {
        type: 'datetime',
        categories: [new Date().toISOString()],
        labels: {
          style: {
            colors: '#00000060',
            fontSize: '14px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#00000060',
            fontSize: '14px'
          }
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy'
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '14px',
      
        labels: {
          colors: '#00000060'
        }
      }
    }
  });

  const processChartData = (data, mode) => {
    if (!data || data.length === 0) return null;

    const dates = data.map(day => new Date(day.date).getTime());
    let series = [];
    let colors = [];

    if (mode === 'total') {
      const totalData = data.map(day => ({
        x: new Date(day.date).getTime(),
        y: day.categories.reduce((sum, cat) => sum + (cat.totalOrders || 0), 0)
      }));

      series = [{
        name: 'Total Orders',
        data: totalData
      }];
      colors = ['#22C55E']; // Green for total
    } else {
      // Get unique categories from all data
      const uniqueCategories = [...new Set(data.flatMap(day => 
        day.categories.map(cat => cat.categoryName)
      ))];

      // Generate colors for each category
      const categoryColors = {
        'fruits': '#FF7E5C',
        'vegetables': '#3549F8',
        'the others': '#22C55E'
      };

      // Create series for each category
      series = uniqueCategories.map(categoryName => {
        const categoryData = data.map(day => ({
          x: new Date(day.date).getTime(),
          y: day.categories.find(cat => 
            cat?.categoryName?.toLowerCase() === categoryName?.toLowerCase()
          )?.totalOrders || 0
        }));

        return {
          name: categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1),
          data: categoryData
        };
      });

      colors = uniqueCategories.map(category => 
        categoryColors[category?.toLowerCase()] || '#' + Math.floor(Math.random()*16777215).toString(16)
      );
    }

    const allValues = series.flatMap(s => s.data.map(d => d.y));
    const yAxisMax = Math.ceil(Math.max(...allValues) * 1.2);

    return { series, colors, dates, yAxisMax };
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const chartData = processChartData(data, viewMode);
      if (!chartData) return;

      setChartData(prev => ({
        ...prev,
        series: chartData.series,
        options: {
          ...prev.options,
          colors: chartData.colors,
          xaxis: {
            ...prev.options.xaxis,
            categories: chartData.dates,
            type: 'datetime',
            labels: {
              style: { colors: '#00000060', fontSize: '14px' },
              formatter: function(value, timestamp) {
                const date = new Date(timestamp);
                const today = new Date();
                return date.toDateString() === today.toDateString() 
                  ? 'Today'
                  : date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
              }
            }
          },
          yaxis: {
            ...prev.options.yaxis,
            min: 0,
            max: chartData.yAxisMax,
            tickAmount: 5,
            labels: {
              formatter: (value) => Math.round(value),
              style: { colors: '#00000060', fontSize: '14px' }
            }
          }
        }
      }));
    }
  }, [data, viewMode]);

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
      // Call API with selected period
      await getChartsDetails(`filterby=salesPeriod&period=${period}`).unwrap();
    }
  };

  const handleCustomDateApply = async () => {
    await getChartsDetails(`filterby=salesPeriod&period=custom&startDate=${startDate}&endDate=${endDate}`).unwrap();
  };

  const downloadChart = () => {
    const chart = document.querySelector('.apexcharts-canvas');
    
    if (downloadFormat === 'pdf') {
      const chartContainer = document.querySelector('.chart-container');
      
      // Set a white background and increase scale for better quality
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
        const totals = data.reduce((acc, day) => {
          day.categories.forEach(cat => {
            const categoryName = cat.categoryName.charAt(0).toUpperCase() + cat.categoryName.slice(1);
            if (!acc[categoryName]) {
              acc[categoryName] = {
                orders: 0,
                amount: 0,
                items: 0
              };
            }
            acc[categoryName].orders += cat.totalOrders || 0;
            acc[categoryName].amount += cat.totalAmount || 0;
            acc[categoryName].items += cat.totalItems || 0;
          });
          return acc;
        }, {});

        // Create PDF with larger format
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [1080, 720]
        });

        // Add title and period with adjusted positioning
        pdf.setFontSize(28);
        pdf.setTextColor(51, 51, 51);
        pdf.text('Sales Analytics Report', 50, 50);
        
        // Add company name or branding
        pdf.setFontSize(16);
        pdf.setTextColor(102, 102, 102);
        pdf.text('Green Grocer Analytics', 50, 80);
        
        pdf.setFontSize(14);
        const periodText = selectedPeriod === 'custom' 
          ? `Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
          : `Period: ${periodOptions.find(opt => opt.value === selectedPeriod)?.label}`;
        pdf.text(periodText, 50, 100);

        // Add current date with improved formatting
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        pdf.text(`Generated on: ${currentDate}`, 50, 120);

        // Calculate optimal chart dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const chartWidth = pageWidth - 100;  // Leave margins
        const chartHeight = 300;  // Fixed height for the chart

        // Add chart with improved positioning and size
        pdf.addImage(imgData, 'PNG', 50, 140, chartWidth, chartHeight);

        // Add totals table with improved styling
        let yPos = chartHeight + 180;
        pdf.setFontSize(20);
        pdf.setTextColor(51, 51, 51);
        pdf.text('Category Totals', 50, yPos);
        
        // Add table with borders and improved spacing
        yPos += 30;
        pdf.setFontSize(14);
        pdf.setTextColor(51, 51, 51);

        // Table headers with background
        const headers = ['Category', 'Orders', 'Revenue (INR)', 'Items'];
        const colWidths = [200, 150, 200, 150];
        let xPos = 50;
        
        // Add header background
        pdf.setFillColor(245, 245, 245);
        pdf.rect(xPos, yPos - 20, colWidths.reduce((a, b) => a + b, 0), 30, 'F');
        
        headers.forEach((header, i) => {
          pdf.text(header, xPos + 10, yPos);
          xPos += colWidths[i];
        });

        // Table rows with alternating background
        yPos += 30;
        Object.entries(totals).forEach(([category, stats], index) => {
          xPos = 50;
          
          // Add row background for even rows
          if (index % 2 === 0) {
            pdf.setFillColor(252, 252, 252);
            pdf.rect(xPos, yPos - 20, colWidths.reduce((a, b) => a + b, 0), 30, 'F');
          }
          
          pdf.text(category, xPos + 10, yPos);
          pdf.text(stats.orders.toLocaleString(), xPos + colWidths[0] + 10, yPos);
          pdf.text(`INR ${stats.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, xPos + colWidths[0] + colWidths[1] + 10, yPos);
          pdf.text(stats.items.toLocaleString(), xPos + colWidths[0] + colWidths[1] + colWidths[2] + 10, yPos);
          yPos += 30;
        });

        // Add grand totals with improved styling
        yPos += 20;
        pdf.setFillColor(240, 240, 240);
        pdf.rect(50, yPos - 20, colWidths.reduce((a, b) => a + b, 0), 35, 'F');
        
        pdf.setFontSize(16);
        pdf.setTextColor(51, 51, 51);
        const grandTotal = Object.values(totals).reduce((acc, curr) => ({
          orders: acc.orders + curr.orders,
          amount: acc.amount + curr.amount,
          items: acc.items + curr.items
        }), { orders: 0, amount: 0, items: 0 });

        pdf.text(`Total Orders: ${grandTotal.orders.toLocaleString()}`, 60, yPos);
        pdf.text(`Total Revenue: INR ${grandTotal.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 300, yPos);
        pdf.text(`Total Items: ${grandTotal.items.toLocaleString()}`, 600, yPos);

        // Add footer
        pdf.setFontSize(12);
        pdf.setTextColor(128, 128, 128);
        pdf.text(' Green Grocer Analytics - Confidential Report', 50, pageHeight - 30);

        pdf.save('green-grocer-analytics-report.pdf');
      });
    } else if (downloadFormat === 'svg' && chart) {
      const svg = chart.getElementsByTagName('svg')[0].outerHTML;
      const data = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chart-report.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (downloadFormat === 'png' && chart) {
      const canvas = document.createElement('canvas');
      const svg = chart.getElementsByTagName('svg')[0].outerHTML;
      const img = new Image();
      const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      img.onload = function () {
        canvas.width = chart.offsetWidth;
        canvas.height = chart.offsetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function (blob) {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'chart-report.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
      };
      img.src = url;
    } else if (downloadFormat === 'jpg') {
      const canvas = document.createElement('canvas');
      const svg = chart.getElementsByTagName('svg')[0].outerHTML;
      const img = new Image();
      const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      img.onload = function () {
        canvas.width = chart.offsetWidth;
        canvas.height = chart.offsetHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function (blob) {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'chart-report.jpg';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, 'image/jpeg', 1.0);
      };
      img.src = url;
    } else if (downloadFormat === 'csv') {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Date,Category,Orders,Revenue (INR),Items\n";

      data.forEach(day => {
        day.categories.forEach(category => {
          csvContent += `${day.date},${category.categoryName},${category.totalOrders || 0},INR ${(category.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })},${category.totalItems || 0}\n`;
        });
      });

      const encodedUri = encodeURI(csvContent);
      const a = document.createElement('a');
      a.setAttribute("href", encodedUri);
      a.setAttribute("download", "green-grocer-analytics-report.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="w-[100%] translate-y-[-25px]">
      <span className='flex'>
       {/* downloader */}
      <span className='flex-1'></span>
      <span className="inline-flex gap-5 items-center px-5 rounded-full">
        <select 
          value={downloadFormat} 
          onChange={(e) => setDownloadFormat(e.target.value)} 
          className="p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 custom-selecter"
        >
          <option value="pdf">PDF</option>
          <option value="svg">SVG</option>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="csv">CSV</option>
        </select>
        <button
          onClick={downloadChart}
          className="bg-[#ff8137] p-2 rounded-full hover:bg-[#ff9137] transition-colors"
        >
          <i className="ri-download-fill text-[22px] text-white"></i>
        </button>
      </span>

      {/* Chart Controls Button */}
      <button 
        onClick={() => setIsPopupOpen(true)}
        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
      >
        <i className="ri-settings-3-line text-[22px]"></i>
      </button>
      </span>

      <div className="chart-container">
        <ReactApexChart 
          options={chartData.options} 
          series={chartData.series} 
          type="area"
          height={400}
        />
      </div>
      
      {/* Chart Controls */}
      <span className='flex items-center space-x-4 justify-center'>
      </span>
      
      {/* Chart Controls Popup */}
    <PopupSelector   isPopupOpen={isPopupOpen} periodOptions={periodOptions} setIsPopupOpen={setIsPopupOpen} selectedPeriod={selectedPeriod} handlePeriodChange={handlePeriodChange} setViewMode={setViewMode} viewMode={viewMode} downloadFormat={downloadFormat} setDownloadFormat={setDownloadFormat} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} handleCustomDateApply={handleCustomDateApply}  />
    </div>
  );
};


function PopupSelector({ isPopupOpen, periodOptions, setIsPopupOpen, selectedPeriod, handlePeriodChange, option, setViewMode, viewMode, downloadFormat, e, setDownloadFormat, startDate, setStartDate, endDate, setEndDate, handleCustomDateApply }) {
  return (
    <>
      <AnimatePresence>
        {isPopupOpen && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className='fixed top-0 right-0 w-full z-40 flex items-center justify-center overflow-hidden'>
          <motion.div initial={{
            opacity: 0,
            backdropFilter: "blur(0px)"
          }} animate={{
            opacity: 1,
            backdropFilter: "blur(0px)"
          }} exit={{
            opacity: 0,
            backdropFilter: "blur(0px)"
          }} transition={{
            duration: 0.5
          }} className="absolute inset-0" onClick={() => setIsPopupOpen(false)} />

          <motion.div initial={{
            scale: 0.4,
            opacity: 0,
            rotateX: 90,
            y: -60
          }} animate={{
            scale: [0.4, 1.1, 1],
            opacity: 1,
            rotateX: 0,
            y: 0
          }} exit={{
            scale: 0.4,
            opacity: 0,
            rotateX: -90,
            y: 60
          }} transition={{
            type: "spring",
            damping: 15,
            stiffness: 300,
            bounce: 0.4,
            duration: 0.6
          }} style={{
            transformPerspective: 1200,
            transformStyle: "preserve-3d"
          }} className=" backdrop-blur-[15px] py-10  flex items-center justify-center flex-col gap-5 rounded-3xl px-10 relative z-50 border border-gray-200">
        
            <motion.div initial={{
              y: 20,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              delay: 0.4
            }} className="w-full flex flex-col gap-4 px-5">

            <i onClick={() => setIsPopupOpen(false)} className="ri-close-circle-line text-[30px] absolute duration-500 top-5 right-5 cursor-pointer text-[#ff8137]"></i>      

              <span className='flex gap-2'>

              {
                /* Period Selector */
              }
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">Period</label>
                <select value={selectedPeriod} onChange={handlePeriodChange} className="w-full p-3 bg-gray-100 border custom-selecter border-gray-300 rounded-xl text-gray-800 ">
                  {periodOptions.map(option => <option key={option.value} value={option.value} className="bg-black text-white">
                    {option.label}
                  </option>)}
                </select>
              </div>

              {
                /* View Mode Toggle */
              }
              <div className="w-1/2 inline">
                <label className="block text-sm font-medium mb-2">View Mode</label>
                <div className="flex space-x-2">
                  <motion.button whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} onClick={() => setViewMode('category')} className={`flex-1 p-3 rounded-full transition-all ${viewMode === 'category' ? 'bg-[#ff8137] text-white' : 'border-2 border-[#ff8137]'}`}>
                    Categories
                  </motion.button>
                  <motion.button whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} onClick={() => setViewMode('total')} className={`flex-1 p-3 rounded-full transition-all  ${viewMode === 'total' ? 'bg-[#ff8137] text-white' : 'border-2 border-[#ff8137]'}`}>
                    Total
                  </motion.button>
                </div>
              </div>
              </span>

            
              {
                /* Custom Date Range */
              }
              {selectedPeriod === 'custom' &&
              <>
                <label className="block text-sm font-medium leading-none">Custom Date Range</label>
              <div className="w-1/2 flex gap-2">
                <div className="flex space-x-2">
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="flex-1 p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800" />
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="flex-1 p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800" />
                </div>
              </div>
              </>
              }
            </motion.div>

          
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </>
  )
}


  export default MainChart;
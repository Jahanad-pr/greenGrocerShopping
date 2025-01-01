import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const LineChart = ({ 
  data = [], 
  viewMode = 'category',
  activeSeries = {
    'Fruits Sales': true,
    'Vegetables Sales': true
  },
  chartRef
}) => {
  const processChartData = (data, mode) => {
    if (!data || data === 0) return null;

    if (mode === 'total') {
      const totalData = data?.map(item => ({
        x: new Date(item.date).getTime(),
        y: item?.categories?.reduce((sum, cat) => sum + (cat.totalAmount || 0), 0)
      }));

      return [{
        name: 'Total Sales',
        data: totalData
      }];
    } else {
      const uniqueCategories = [...new Set(data.flatMap(day => 
        day.categories.map(cat => cat.categoryName)
      ))];

      return uniqueCategories.map(categoryName => {
        const categoryData = data.map(item => ({
          x: new Date(item.date).getTime(),
          y: item.categories.find(cat => 
            cat.categoryName?.toLowerCase() === categoryName?.toLowerCase()
          )?.totalAmount || 0
        }));

        return {
          // name: categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1),
          data: categoryData
        };
      });
    }
  };

  const chartData = useMemo(() => processChartData(data, viewMode), [data, viewMode]);

  const options = {
    chart: {
      type: 'line',
      height: 380,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true
      }
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM',
          day: 'dd'
        },
        style: {
          colors: '#00000060',
          fontSize: '14px'
        },
        formatter: function(value, timestamp) {
          const date = new Date(timestamp);
          return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        }
      },
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#00000060',
          fontSize: '14px'
        },
        formatter: (value) => `₹${value.toFixed(2)}`
      }
    },
    grid: {
      show: false
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: viewMode === 'total' 
          ? ['#22C55E']
          : ['#FF7E5C', '#3549F8'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      }
    },
    tooltip: {
      x: {
        format: 'dd MMM'
      },
      y: {
        formatter: (value) => `₹${value.toFixed(2)}`
      }
    },
    markers: {
      size: 4,
      colors: viewMode === 'total' 
        ? ['#22C55E']
        : ['#FF7E5C', '#3549F8'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8
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
  };

  return (
    <div className='rounded-3xl w-full h-[450px] p-4'>
      <div className='w-full h-full -z-10' ref={chartRef}>
        <ReactApexChart 
          options={options} 
          series={chartData} 
          type="line" 
          height={400}
          width="100%"
        />
      </div>
    </div>
  );
}

export default LineChart;
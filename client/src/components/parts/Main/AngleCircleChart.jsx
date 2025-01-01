import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
  const [chartData] = React.useState({
    series: [76, 67, 61, 90],
    options: {
      chart: {
        height: 390,
        type: 'radialBar',
        background: '#ffffff',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          track: {
            background: '#f8fafc',
            strokeWidth: '100%',
            margin: 5,
            dropShadow: {
              enabled: false
            }
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            }
          },
          barLabels: {
            enabled: true,
            useSeriesColors: true,
            offsetX: -12,
            offsetY: 6,
            fontSize: '16px',
            formatter: (seriesName, opts) => {
              return seriesName + ": " + opts.w.globals.series[opts.seriesIndex];
            },
          },
          strokeWidth: 12,  // Thickness of the progress bars
          lineCap: 'round',  // Rounded ends
          distributed: true,  // Enable individual styling
          pathRadius: 'smooth',  // Smooth curve
        }
      },
      stroke: {
        lineCap: 'round',
        curve: 'smooth',
      },
      colors: ['#FF4B4B', '#FF7676', '#4B83FF', '#1A4BFF'],
      labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          gradientToColors: ['#FF7676', '#FF9B9B', '#1A4BFF', '#0A2999'],
          stops: [0, 100]
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            show: false
          }
        }
      }],
      tooltip: {
        enabled: true,
        style: {
          fontSize: '14px'
        },
        y: {
          formatter: (value) => `${value}%`
        }
      },
      states: {
        hover: {
          filter: {
            type: 'lighten',
            value: 0.15,
          }
        },
        active: {
          filter: {
            type: 'darken',
            value: 0.15,
          }
        }
      }
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto rounded-lg">
      <div id="chart" className="relative h-full px-4">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="radialBar"
          height={300}
        />
        {/* Custom center dot */}
        {/* <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-blue-600 
          ring-2 ring-white/50"
        /> */}
      </div>
      {/* <div id="html-dist" className="mt-4"></div> */}
    </div>
  );
};

export default ApexChart;
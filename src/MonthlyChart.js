import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MonthlyChart = ({ data = null }) => {
  // 기본 샘플 데이터
  const defaultData = {
    labels: ['7월', '8월', '9월', '10월', '11월', '12월'],
    datasets: [
      {
        label: '평가 생성 수',
        data: [3, 4, 5, 9, 7, 0],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#667eea',
        pointHoverBorderWidth: 3,
      }
    ]
  };

  const chartData = data || defaultData;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `평가 ${context.parsed.y}개 생성`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2,
          font: {
            size: 12
          },
          color: '#7f8c8d'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          font: {
            size: 13,
            weight: '500'
          },
          color: '#2c3e50'
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    }
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyChart;

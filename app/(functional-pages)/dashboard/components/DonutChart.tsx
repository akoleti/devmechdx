'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { TooltipItem } from 'chart.js';

interface DonutChartProps {
  data: number[];
  labels: string[];
  colors: string[];
  centerText?: {
    value: string;
    label: string;
  };
  type?: 'standard' | 'efficiency';
}

const DonutChart = ({ 
  data, 
  labels, 
  colors, 
  centerText,
  type = 'standard'
}: DonutChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      // Create new chart
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderWidth: 0,
              borderRadius: 4,
              hoverOffset: 5,
            },
          ],
        },
        options: {
          cutout: '70%',
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: (context: TooltipItem<'doughnut'>) => {
                  const label = context.label || '';
                  const value = context.formattedValue;
                  const dataArray = context.chart.data.datasets[0].data as number[];
                  const total = dataArray.reduce((a, b) => a + b, 0);
                  const percentage = Math.round(((context.raw as number) / total) * 100);
                  
                  if (type === 'efficiency') {
                    return `${label}: ${value} (${percentage}%)`;
                  }
                  
                  return `${label}: ${value}`;
                }
              }
            }
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels, colors, type]);

  return (
    <div className="relative flex justify-center">
      <div className="w-64 h-64 relative">
        <canvas ref={chartRef} />
        {centerText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-lg font-bold">{centerText.value}</div>
              <div className="text-sm">{centerText.label}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutChart; 
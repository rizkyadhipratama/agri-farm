"use client";

import { useRef, useEffect } from "react";

interface BarChartItem {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartItem[];
  gradientFrom: string;
  gradientTo: string;
  formatValue?: (value: number) => string;
  height?: number;
}

export default function BarChart({ data, gradientFrom, gradientTo, formatValue, height = 200 }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = height;
    const rightPad = 80;
    const leftPad = 60;
    const topPad = 10;
    const bottomPad = 24;
    const chartW = w - leftPad - rightPad;
    const chartH = h - topPad - bottomPad;

    const maxValue = Math.max(...data.map((d) => d.value), 1);

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = topPad + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(leftPad, y);
      ctx.lineTo(w - rightPad, y);
      ctx.stroke();
    }

    const barCount = data.length;
    const totalGap = chartW * 0.35;
    const gap = totalGap / (barCount + 1);
    const barWidth = (chartW - totalGap) / barCount;

    data.forEach((item, i) => {
      const barH = (item.value / maxValue) * chartH;
      const x = leftPad + gap + i * (barWidth + gap);
      const y = topPad + chartH - barH;

      // Bar gradient
      const grad = ctx.createLinearGradient(0, y, 0, topPad + chartH);
      grad.addColorStop(0, gradientFrom);
      grad.addColorStop(1, gradientTo);

      ctx.beginPath();
      const r = Math.min(barWidth / 4, 4);
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barWidth - r, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
      ctx.lineTo(x + barWidth, topPad + chartH);
      ctx.lineTo(x, topPad + chartH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Label
      ctx.fillStyle = "#6b7280";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.label, x + barWidth / 2, topPad + chartH + 16);

      // Value on right
      ctx.fillStyle = "#374151";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(formatValue ? formatValue(item.value) : String(item.value), w - 4, y + 4);
    });
  }, [data, height, formatValue, gradientFrom, gradientTo]);

  if (data.length === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height }}
    />
  );
}

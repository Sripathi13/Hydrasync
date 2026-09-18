import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TelemetryReading } from '../../types/hydrasync.ts';

interface PressureChartProps {
  data: TelemetryReading[];
  height?: number;
}

export const PressureChart: React.FC<PressureChartProps> = ({ data, height = 280 }) => {
  return (
    <div className="w-full h-full min-h-[260px]">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="timestamp"
            stroke="#94a3b8"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            unit=" bar"
            domain={[1.5, 7.5]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderColor: '#cbd5e1',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
          />
          <ReferenceLine y={3.5} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Low Threshold (3.5 bar)', fill: '#f43f5e', fontSize: 10, position: 'insideBottomRight' }} />
          <Line
            type="monotone"
            dataKey="pressureA"
            name="Section A"
            stroke="#0284c7"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="pressureB"
            name="Section B"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="pressureC"
            name="Section C"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="pressureD"
            name="Section D"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

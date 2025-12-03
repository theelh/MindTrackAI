import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Imports Recharts
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { BreadcrumbItem } from "@/types";

interface EmotionAnalysis {
  date: string;
  entries: number;
  emotion_label: string | null;
  confidence: number | null;
  model_used: string | null;
}

interface Props {
  data: EmotionAnalysis[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Analytics',
        href: '/emotion/analytics',        
    },
];

const AnalyticsPage: React.FC<Props> = ({ data }) => {
  const totalEntries = data.reduce((sum, item) => sum + item.entries, 0);
  const maxEntries = Math.max(...data.map((d) => d.entries), 1);
  const avgEntries = (totalEntries / data.length).toFixed(1);

  // Map emotions to numeric values for chart  
  const maxConfidence = Math.max(...data.map(d => d.confidence ?? 0), 1);
  const maxEmotion = 3; // because emotionValue ranges from -3 to 3

  // Convert emotion map
  const emotionMap: Record<string, number> = {
    joy: 3,
    happy: 3,
    positive: 2,
    neutral: 1,
    sad: -1,
    fear: -2,
    anger: -3,
  };

  // Prepare normalized chart data
  const chartData = data.map(d => {
    const emotionValue = d.emotion_label
      ? emotionMap[d.emotion_label.toLowerCase()] ?? 0
      : 0;

    return {
      date: d.date,
      entriesNorm: (d.entries / maxEntries) * 100,
      confidenceNorm: ((d.confidence ?? 0) / maxConfidence) * 100,
      emotionNorm: ((emotionValue + maxEmotion) / (2 * maxEmotion)) * 100, // shift -3..3 to 0..6, then scale to 0..100
    };
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Analytics" />

      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Your Progress & Emotions</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">{totalEntries}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average per Day</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{isNaN(Number(avgEntries)) ? 0 : Number(avgEntries)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Max Entries in a Day</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{maxEntries}</p>
            </CardContent>
          </Card>
        </div>

        {/* Entries Over Time (progress bars) */}
        <Card>
          <CardHeader>
            <CardTitle>Entries Over Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.map((d) => (
              <div key={d.date} className="flex items-center gap-4">
                <span className="w-24 text-sm">{d.date}</span>
                <div className="flex-1 bg-gray-200 h-4 rounded overflow-hidden">
                  <div
                    className="bg-indigo-600 h-4 rounded"
                    style={{ width: `${(d.entries / maxEntries) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-sm text-right">{d.entries}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Combined Analytics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Mood & Activity Trends</CardTitle>
          </CardHeader>

          <CardContent>
            <div style={{ width: "100%", height: 380 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v.toFixed(0)}%`} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="entriesNorm"
                    name="Entries"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={true}
                  />

                  <Line
                    type="monotone"
                    dataKey="confidenceNorm"
                    name="Confidence"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={true}
                  />

                  <Line
                    type="monotone"
                    dataKey="emotionNorm"
                    name="Emotion Trend"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              All metrics are normalized to 0–100% to visualize trends together.
            </p>
          </CardContent>
        </Card>

        {/* Detailed Emotion Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Emotion Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Entries</TableHead>
                  <TableHead>Emotion Label</TableHead>
                  <TableHead>Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((d) => (
                  <TableRow key={d.date}>
                    <TableCell>{d.date}</TableCell>
                    <TableCell>{d.entries}</TableCell>
                    <TableCell>{d.emotion_label || "-"}</TableCell>
                    <TableCell>{d.confidence !== null ? (d.confidence * 100).toFixed(1) + "%" : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;

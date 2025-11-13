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

const AnalyticsPage: React.FC<Props> = ({ data }) => {
  const totalEntries = data.reduce((sum, item) => sum + item.entries, 0);
  const maxEntries = Math.max(...data.map((d) => d.entries), 1);
  const avgEntries = (totalEntries / data.length).toFixed(1);

  return (
    <AppLayout>
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
              <p className="text-3xl font-bold text-green-600">{avgEntries}</p>
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

        {/* Progress Bars */}
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
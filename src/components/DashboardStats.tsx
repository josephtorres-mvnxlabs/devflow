
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, BarChartHorizontal, LineChart } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const cycleTimeData = [
  { name: "Jan", time: 12 },
  { name: "Feb", time: 14 },
  { name: "Mar", time: 11 },
  { name: "Apr", time: 8 },
  { name: "May", time: 9 },
  { name: "Jun", time: 7 },
  { name: "Jul", time: 8 }
];

const estimationAccuracyData = [
  { name: "Alex", estimated: 15, actual: 12 },
  { name: "Maria", estimated: 8, actual: 11 },
  { name: "Tyler", estimated: 6, actual: 5 },
  { name: "Sam", estimated: 12, actual: 14 },
  { name: "Jamie", estimated: 10, actual: 10 }
];

const deliveredTasksData = [
  { name: "Alex", value: 27 },
  { name: "Maria", value: 22 },
  { name: "Tyler", value: 18 },
  { name: "Sam", value: 24 },
  { name: "Jamie", value: 16 }
];

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#10B981', '#F59E0B'];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Cycle Time Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Delivery Cycle Time
          </CardTitle>
          <CardDescription>Average days from start to completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={cycleTimeData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <Tooltip />
                <Area type="monotone" dataKey="time" stroke="#7E69AB" fillOpacity={1} fill="url(#colorTime)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Estimation Accuracy */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Estimation Accuracy
          </CardTitle>
          <CardDescription>Estimated vs. actual days per developer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={estimationAccuracyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="estimated" fill="#9b87f5" name="Estimated" />
                <Bar dataKey="actual" fill="#F59E0B" name="Actual" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Delivered */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BarChartHorizontal className="h-4 w-4 mr-2" />
            Tasks Delivered
          </CardTitle>
          <CardDescription>Total tasks completed per developer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                layout="vertical"
                data={deliveredTasksData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={50} />
                <Tooltip />
                <Bar dataKey="value" name="Tasks">
                  {deliveredTasksData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

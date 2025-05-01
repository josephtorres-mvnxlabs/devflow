
import * as React from "react";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Reports = () => {
  // Sample data for charts
  const developerPerformance = [
    { name: 'Alex J.', estimatedDays: 12, actualDays: 10, tasks: 8 },
    { name: 'Maria G.', estimatedDays: 15, actualDays: 13, tasks: 6 },
    { name: 'Sam W.', estimatedDays: 8, actualDays: 9, tasks: 5 },
    { name: 'Tyler S.', estimatedDays: 10, actualDays: 7, tasks: 7 },
    { name: 'Jamie L.', estimatedDays: 14, actualDays: 16, tasks: 9 },
  ];

  const epicProgress = [
    { name: 'Authentication', completed: 8, remaining: 2, total: 10 },
    { name: 'Performance', completed: 5, remaining: 7, total: 12 },
    { name: 'ML Features', completed: 3, remaining: 6, total: 9 },
  ];

  const taskStatusData = [
    { name: 'To Do', value: 12, color: '#8E9196' },
    { name: 'In Progress', value: 8, color: '#F59E0B' },
    { name: 'Done', value: 15, color: '#10B981' },
  ];

  const timelineData = [
    { day: 'Mon', auth: 4, perf: 2, ml: 1 },
    { day: 'Tue', auth: 3, perf: 3, ml: 2 },
    { day: 'Wed', auth: 5, perf: 1, ml: 3 },
    { day: 'Thu', auth: 2, perf: 4, ml: 3 },
    { day: 'Fri', auth: 4, perf: 3, ml: 2 },
  ];

  const COLORS = ['#8E9196', '#F59E0B', '#10B981'];

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Reports</h1>
            <p className="text-muted-foreground">
              Visualize project progress, performance, and resource allocation
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="lastMonth">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastWeek">Last Week</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Developer Performance</TabsTrigger>
            <TabsTrigger value="epics">Epic Progress</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Task Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {taskStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Epic Progress Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={epicProgress}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
                        <Bar dataKey="remaining" stackId="a" fill="#8E9196" name="Remaining" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Developer Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={developerPerformance}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="estimatedDays" fill="#9b87f5" name="Estimated Days" />
                      <Bar dataKey="actualDays" fill="#1EAEDB" name="Actual Days" />
                      <Bar dataKey="tasks" fill="#D6BCFA" name="Tasks Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="epics">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Epic Progress Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={epicProgress}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" fill="#10B981" name="Completed Tasks" />
                      <Bar dataKey="remaining" fill="#8E9196" name="Remaining Tasks" />
                      <Bar dataKey="total" fill="#9b87f5" name="Total Tasks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Task Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={timelineData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="auth" stroke="#9b87f5" name="Authentication" />
                      <Line type="monotone" dataKey="perf" stroke="#1EAEDB" name="Performance" />
                      <Line type="monotone" dataKey="ml" stroke="#D6BCFA" name="ML Features" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;

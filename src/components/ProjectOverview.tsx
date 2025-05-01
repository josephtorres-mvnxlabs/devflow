
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProjectOverview() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>Current active epics and their progress</CardDescription>
          </div>
          <Badge>Apr 15 - Jun 30</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="epics" className="w-full">
          <TabsList>
            <TabsTrigger value="epics">Epics</TabsTrigger>
            <TabsTrigger value="bottlenecks">Bottlenecks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="epics">
            <div className="space-y-6">
              <EpicProgressItem 
                title="User Authentication System Overhaul"
                description="Modernize our authentication system with biometric options"
                progress={45}
                tasks={{total: 8, completed: 3}}
                status="in-progress"
                assignees={["AJ", "MG", "SW", "RC"]}
              />
              
              <EpicProgressItem 
                title="Performance Optimization Initiative"
                description="Improve application performance across web and mobile platforms"
                progress={75}
                tasks={{total: 12, completed: 9}}
                status="in-progress"
                assignees={["TS", "MG", "JL"]}
              />
              
              <EpicProgressItem 
                title="ML-Driven Recommendations"
                description="Enhance product recommendations with machine learning algorithms"
                progress={20}
                tasks={{total: 10, completed: 2}}
                status="at-risk"
                assignees={["JL", "AJ"]}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="bottlenecks">
            <div className="space-y-4">
              <Card className="border-l-4 border-devops-red">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">ML Model Training Infrastructure</h3>
                      <p className="text-sm text-muted-foreground">
                        Blocked by cloud resource limitations
                      </p>
                    </div>
                    <Badge variant="destructive">Blocked</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-devops-yellow">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Biometric Authentication API</h3>
                      <p className="text-sm text-muted-foreground">
                        Awaiting security approval
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-devops-yellow/20 text-devops-yellow border-devops-yellow">
                      Waiting
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface EpicProgressItemProps {
  title: string;
  description: string;
  progress: number;
  tasks: {
    total: number;
    completed: number;
  };
  status: "completed" | "in-progress" | "at-risk" | "blocked";
  assignees: string[];
}

function EpicProgressItem({ 
  title, 
  description, 
  progress, 
  tasks, 
  status, 
  assignees 
}: EpicProgressItemProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return <Badge className="bg-devops-green">Completed</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-devops-yellow/20 text-devops-yellow border-devops-yellow">In Progress</Badge>;
      case "at-risk":
        return <Badge variant="destructive" className="bg-orange-600 border-orange-600">At Risk</Badge>;
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {getStatusBadge()}
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>{tasks.completed} of {tasks.total} tasks completed</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="flex -space-x-2 mt-2">
        {assignees.map((initials, i) => (
          <div 
            key={i}
            className="w-6 h-6 rounded-full bg-devops-purple-light flex items-center justify-center text-white text-xs ring-2 ring-background"
          >
            {initials}
          </div>
        ))}
      </div>
    </div>
  );
}

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "inProgress" | "done";
  estimation: number;
  actual?: number;
  assignee: {
    name: string;
    avatar?: string;
    initials: string;
  };
  epic: string;
}

const SAMPLE_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Set up biometric authentication API",
    description: "Implement the backend API for biometric authentication",
    status: "todo",
    estimation: 3,
    assignee: {
      name: "Alex Johnson",
      initials: "AJ"
    },
    epic: "User Authentication System Overhaul"
  },
  {
    id: "task-2",
    title: "Create mobile UI for biometric prompts",
    description: "Design and implement the UI for fingerprint and face recognition",
    status: "inProgress",
    estimation: 2,
    actual: 1,
    assignee: {
      name: "Maria Garcia",
      initials: "MG"
    },
    epic: "User Authentication System Overhaul"
  },
  {
    id: "task-3",
    title: "Deploy CDN optimization for assets",
    description: "Configure CDN to improve page load times globally",
    status: "done",
    estimation: 1,
    actual: 0.5,
    assignee: {
      name: "Tyler Smith",
      initials: "TS"
    },
    epic: "Performance Optimization Initiative"
  },
  {
    id: "task-4",
    title: "Implement security monitoring for biometric auth",
    description: "Set up monitoring and alerting for biometric authentication",
    status: "todo",
    estimation: 2,
    assignee: {
      name: "Sam Wong",
      initials: "SW"
    },
    epic: "User Authentication System Overhaul"
  },
  {
    id: "task-5",
    title: "Refactor product recommendation algorithm",
    description: "Improve recommendation accuracy by 15%",
    status: "inProgress",
    estimation: 5,
    actual: 3,
    assignee: {
      name: "Jamie Lee",
      initials: "JL"
    },
    epic: "ML-Driven Recommendations"
  },
  {
    id: "task-6",
    title: "Design password-less email flow",
    description: "Create UX designs for the password-less authentication",
    status: "done",
    estimation: 1,
    actual: 1,
    assignee: {
      name: "Robin Chen",
      initials: "RC"
    },
    epic: "User Authentication System Overhaul"
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case "todo":
      return "bg-devops-gray/20";
    case "inProgress":
      return "bg-devops-yellow/20 border-devops-yellow";
    case "done":
      return "bg-devops-green/20 border-devops-green";
    default:
      return "bg-devops-gray/20";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "todo":
      return "To Do";
    case "inProgress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return status;
  }
}

export function KanbanBoard() {
  return (
    <div className="w-full animate-fade-in">
      <Tabs defaultValue="kanban" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Epic: User Authentication System Overhaul
            </Badge>
          </div>
        </div>
        
        <TabsContent value="kanban" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">TO DO</h3>
                <Badge variant="outline" className="text-xs">
                  {SAMPLE_TASKS.filter(t => t.status === "todo").length}
                </Badge>
              </div>
              <div className="kanban-column">
                {SAMPLE_TASKS
                  .filter(task => task.status === "todo")
                  .map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                }
              </div>
            </div>
            
            {/* In Progress Column */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">IN PROGRESS</h3>
                <Badge variant="outline" className="text-xs">
                  {SAMPLE_TASKS.filter(t => t.status === "inProgress").length}
                </Badge>
              </div>
              <div className="kanban-column">
                {SAMPLE_TASKS
                  .filter(task => task.status === "inProgress")
                  .map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                }
              </div>
            </div>
            
            {/* Done Column */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">DONE</h3>
                <Badge variant="outline" className="text-xs">
                  {SAMPLE_TASKS.filter(t => t.status === "done").length}
                </Badge>
              </div>
              <div className="kanban-column">
                {SAMPLE_TASKS
                  .filter(task => task.status === "done")
                  .map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                }
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <div className="space-y-3">
            {SAMPLE_TASKS.map(task => (
              <TaskCard key={task.id} task={task} listView />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  listView?: boolean;
}

function TaskCard({ task, listView }: TaskCardProps) {
  return (
    <Card className={`task-card ${listView ? 'flex justify-between items-center' : ''}`}>
      <div className="w-full">
        <div className={`flex ${listView ? 'items-center' : 'flex-col space-y-2'}`}>
          <div className={`${listView ? 'flex-1' : 'w-full'}`}>
            <h4 className="font-medium">{task.title}</h4>
            {!listView && task.description && (
              <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
            )}
          </div>
          
          <div className={`flex ${listView ? 'items-center space-x-4' : 'justify-between mt-3'}`}>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={task.status === "done" ? "outline" : "outline"} 
                className={`text-xs ${task.status === "done" ? "bg-devops-green/20 text-devops-green border-devops-green" : ""}`}
              >
                {getStatusLabel(task.status)}
              </Badge>
              {task.status === "done" && task.actual !== undefined && (
                <span className={`text-xs ${task.actual <= task.estimation ? 'text-devops-green' : 'text-devops-red'}`}>
                  {task.actual} / {task.estimation} days
                </span>
              )}
              {task.status !== "done" && (
                <span className="text-xs text-muted-foreground">
                  Est: {task.estimation} days
                </span>
              )}
            </div>
            
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-devops-purple-light text-white">
                {task.assignee.initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </Card>
  );
}

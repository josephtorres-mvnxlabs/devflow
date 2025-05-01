
import * as React from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { KanbanBoard } from "@/components/KanbanBoard";
import { MainLayout } from "@/components/MainLayout";
import { NewRequestForm } from "@/components/NewRequestForm";
import { ProjectOverview } from "@/components/ProjectOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TaskSubmissionForm } from "@/components/TaskSubmissionForm";

const Index = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Welcome to DevFlow</h1>
        <p className="text-muted-foreground">
          The AI-empowered DevOps platform that simplifies product development workflows
        </p>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="newRequest">New Request</TabsTrigger>
          </TabsList>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-devops-purple hover:bg-devops-purple-dark">
                <Plus className="h-4 w-4 mr-1" />
                New Product Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <TaskSubmissionForm 
                onSuccess={() => setOpen(false)} 
                onCancel={() => setOpen(false)}
                isProductIdea={true} 
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <TabsContent value="dashboard">
          <div className="space-y-6">
            <DashboardStats />
            <ProjectOverview />
          </div>
        </TabsContent>
        
        <TabsContent value="tasks">
          <KanbanBoard />
        </TabsContent>
        
        <TabsContent value="newRequest">
          <Card>
            <CardContent className="pt-6">
              <NewRequestForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Index;

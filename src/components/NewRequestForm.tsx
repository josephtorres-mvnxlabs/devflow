
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export function NewRequestForm() {
  const [prompt, setPrompt] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [aiResponse, setAiResponse] = React.useState<any>(null);
  const { toast } = useToast();

  const processRequest = () => {
    if (prompt.trim().length === 0) {
      toast({
        title: "Error",
        description: "Please enter your request",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    
    // Simulate AI processing with a progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          // Mock AI-generated response
          setAiResponse({
            epic: {
              title: "User Authentication System Overhaul",
              description: "Modernize our authentication system with biometric options and improved security while simplifying the user experience."
            },
            features: [
              {
                title: "Biometric Authentication Integration",
                description: "As a user, I want to use my fingerprint or face recognition to log in so that I don't need to remember passwords."
              },
              {
                title: "Password-less Login Flow",
                description: "As a user, I want to log in without typing a password so that I can access the system more quickly."
              }
            ],
            tasks: [
              {
                title: "Set up biometric authentication API",
                estimation: 3,
                role: "Backend Developer"
              },
              {
                title: "Create mobile UI for biometric prompts",
                estimation: 2,
                role: "Frontend Developer"
              },
              {
                title: "Implement security monitoring for biometric auth",
                estimation: 2,
                role: "Security Engineer"
              },
              {
                title: "Design password-less email flow",
                estimation: 1,
                role: "UX Designer"
              }
            ],
            ai_suggestions: [
              "Auto-generate security test cases",
              "Create UX copy for onboarding flow",
              "Generate API documentation"
            ]
          });
          toast({
            title: "Processing complete",
            description: "Your request has been transformed into workable items."
          });
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    return () => clearInterval(interval);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-semibold mb-2">New AI Request</h2>
        <p className="text-muted-foreground">
          Describe your product feature or idea in natural language, and our AI will transform it into structured work items.
        </p>
      </div>
      
      <Textarea
        placeholder="Example: We need a new user authentication system that supports biometric login and passwordless options. It should work across our mobile app and website, while meeting security compliance requirements."
        className="min-h-[150px] text-base"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isProcessing}
      />
      
      {isProcessing ? (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Processing your request...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      ) : (
        <Button 
          onClick={processRequest} 
          className="bg-devops-purple hover:bg-devops-purple-dark"
          disabled={isProcessing}
        >
          Transform with AI
        </Button>
      )}

      {aiResponse && (
        <Tabs defaultValue="epic" className="mt-8">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="epic">Epic</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="ai">AI Assist</TabsTrigger>
          </TabsList>
          
          <TabsContent value="epic">
            <Card className="epic-card">
              <h3 className="text-xl font-semibold mb-2">{aiResponse.epic.title}</h3>
              <p className="text-muted-foreground">{aiResponse.epic.description}</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="features">
            <div className="space-y-4">
              {aiResponse.features.map((feature: any, index: number) => (
                <Card key={index} className="feature-card">
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <div className="space-y-3">
              {aiResponse.tasks.map((task: any, index: number) => (
                <div key={index} className="task-card">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge variant="outline">{task.role}</Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-muted-foreground">Estimation:</span>
                    <Badge variant="secondary">{task.estimation} days</Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ai">
            <Card className="p-4">
              <h3 className="font-medium mb-3">AI Assistance</h3>
              <div className="space-y-2">
                {aiResponse.ai_suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      Generate
                    </Button>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

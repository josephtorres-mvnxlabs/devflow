
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { taskApi, epicApi, userApi } from "@/services/api";
import { mapTaskFormToDatabase } from "@/services/formMapper";
import { useQuery } from "@tanstack/react-query";
import { Epic, User } from "@/models/database";

const taskFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  epic: z.string().optional(),
  assignee: z.string().optional(),
  estimation: z.coerce.number().min(0).default(1),
  priority: z.enum(["low", "medium", "high"]),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

const defaultValues: Partial<TaskFormValues> = {
  priority: "medium",
  estimation: 1,
};

interface TaskSubmissionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isProductIdea?: boolean;
}

export function TaskSubmissionForm({ onSuccess, onCancel, isProductIdea = false }: TaskSubmissionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch epics for dropdown
  const { data: epics } = useQuery({
    queryKey: ['epics'],
    queryFn: epicApi.getAll,
    placeholderData: [] as Epic[]
  });

  // Fetch team members for dropdown
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAll,
    placeholderData: [] as User[]
  });

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, you'd get the user ID from auth context
      const userId = "current-user-id"; 
      
      // Convert form data to database model - ensure all required fields are present
      const taskData = mapTaskFormToDatabase({
        title: data.title,
        description: data.description,
        epic: data.epic,
        assignee: data.assignee,
        estimation: data.estimation,
        priority: data.priority
      }, userId, isProductIdea);
      
      // Submit to API
      await taskApi.create(taskData);
      
      const successMessage = isProductIdea 
        ? `Product idea "${data.title}" has been created and will be curated to an epic.`
        : `Task "${data.title}" has been created successfully.`;
      
      toast({
        title: isProductIdea ? "Product idea created" : "Task created",
        description: successMessage,
      });
      
      console.log(isProductIdea ? "Product idea submitted:" : "Task submitted:", data);
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      toast({
        title: "Error",
        description: `Failed to create ${isProductIdea ? "product idea" : "task"}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">
          {isProductIdea ? "Create New Product Idea" : "Create New Task"}
        </h2>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isProductIdea ? "Product Idea Title" : "Task Title"}</FormLabel>
              <FormControl>
                <Input placeholder={isProductIdea ? "Enter product idea title" : "Enter task title"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={isProductIdea 
                    ? "Describe your product idea in detail. What problem does it solve? Who is it for?" 
                    : "Describe the task in detail"
                  } 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              {isProductIdea && (
                <FormDescription>
                  Great product ideas clearly define the problem, target audience, and proposed solution
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isProductIdea ? (
            <FormField
              control={form.control}
              name="epic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Epic</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an epic or create new" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new">+ Create new epic</SelectItem>
                      {epics?.map((epic) => (
                        <SelectItem key={epic.id} value={epic.id}>
                          {epic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select an existing epic or create a new one
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="epic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Epic</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an epic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {epics?.map((epic) => (
                        <SelectItem key={epic.id} value={epic.id}>
                          {epic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The epic this task belongs to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="assignee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignee</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to team member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isProductIdea ? "Estimated Size (days)" : "Estimation (days)"}
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    placeholder={isProductIdea ? "Estimated effort in days" : "Estimated completion days"}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-devops-purple hover:bg-devops-purple-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : isProductIdea ? "Submit Product Idea" : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

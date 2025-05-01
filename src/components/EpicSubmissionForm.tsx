
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { epicApi } from "@/services/api";
import { mapEpicFormToDatabase } from "@/services/formMapper";

const epicFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  estimation: z.coerce.number().min(1).default(14),
});

type EpicFormValues = z.infer<typeof epicFormSchema>;

const defaultValues: Partial<EpicFormValues> = {
  estimation: 14,
};

interface EpicSubmissionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EpicSubmissionForm({ onSuccess, onCancel }: EpicSubmissionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<EpicFormValues>({
    resolver: zodResolver(epicFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: EpicFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, you'd get the user ID from auth context
      const userId = "current-user-id"; 
      
      // Convert form data to database model - ensure all required fields are present
      const epicData = mapEpicFormToDatabase({
        title: data.title,
        description: data.description,
        estimation: data.estimation
      }, userId);
      
      // Submit to API
      await epicApi.create(epicData);
      
      // Show success toast
      toast({
        title: "Epic created",
        description: `Epic "${data.title}" has been created successfully.`,
      });
      
      console.log("Epic submitted:", data);
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create epic:", error);
      toast({
        title: "Error",
        description: "Failed to create epic. Please try again.",
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
        <h2 className="text-2xl font-bold mb-4">Create New Epic</h2>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Epic Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter epic title" {...field} />
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
                  placeholder="Describe the epic and its goals" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide a clear description of what this epic aims to achieve
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Duration (days)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  placeholder="Estimated completion time in days"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 14)} 
                />
              </FormControl>
              <FormDescription>
                Approximate time needed to complete all tasks in this epic
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-devops-purple hover:bg-devops-purple-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Epic'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

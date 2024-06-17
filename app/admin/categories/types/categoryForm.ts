import { Category } from "@/types/category";
import { MessagePrompt } from "@/types/common";

export type CategoryFormTypes = {
  //parent: number;
  //name: string;
  //slug: string;
  //description: string;

  id: number;
  alertPrompt: MessagePrompt | null;
  isProcessing: boolean;
  //hasSlugManuallyChanged: boolean;
  useForm: any;
}
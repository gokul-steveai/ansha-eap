import { Post } from "@/serverActions/crudPosts";


export type NavItemsType = {
    title: string;
    link: string;
    icon?: React.ReactNode;
    subitems?: NavItemsType[];
  };

  export type User = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    created_at: string;
    updated_at?: string;
  }

  export type DailyActivity = {
    id: string;
    user_id: string;
    reading_minutes: number;
    video_minutes: number;
    writing_minutes: number;
    task_minutes: number;
    created_at: string;
    updated_at: string;
  }

  export type DailyCheckinQA = { question_id: string; answer: number };
  export type DailyCheckIn = {
    id: string;
    user_id: string;
    responses: DailyCheckinQA[];
    created_at: string;
    updated_at: string;
  };


  export type ActionText = "read" | "watch" | "view"
  export type PartialPost = (Partial<Post> & { category?: string});

  export type MultiSelectOption  = {
  value: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}
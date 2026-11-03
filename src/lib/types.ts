export type BookStatus =
  | "draft"
  | "preview_ready"
  | "awaiting_payment"
  | "paid"
  | "generating"
  | "ready"
  | "failed";

export type Gender = "menino" | "menina" | "neutro";

export interface ChildInfo {
  name: string;
  age: number;
  gender: Gender;
  hairColor?: string;
  hairType?: string;
  hairLength?: string;
  skinTone?: string;
  eyeColor?: string;
  glasses?: boolean;
  favoriteColor?: string;
  likes?: string;
}

export interface Companion {
  kind: "pessoa" | "pet" | "brinquedo";
  name: string;
  relation: string;
  description: string;
}

export interface BookInput {
  child: ChildInfo;
  companions: Companion[];
  themeId: string;
  customIdea?: string;
  valueId: string;
  styleId: string;
  dedication?: string;
  planId: string;
  buyer: { name: string; email: string; whatsapp?: string };
  consent: boolean;
  photoConsent: boolean;
}

export interface BookRow {
  id: string;
  created_at: string;
  status: BookStatus;
  user_id: string | null;
  buyer_name: string;
  buyer_email: string;
  buyer_whatsapp: string | null;
  plan_id: string;
  price_cents: number;
  pages_total: number;
  pages_done: number;
  child: ChildInfo & { appearanceFromPhoto?: string };
  companions: Companion[];
  theme_id: string;
  custom_idea: string | null;
  value_id: string;
  style_id: string;
  dedication: string | null;
  photo_path: string | null;
  title: string | null;
  synopsis: string | null;
  character_sheet: string | null;
  cover_prompt: string | null;
  cover_url: string | null;
  cover_attempts: number;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  paid_at: string | null;
  ready_at: string | null;
  error: string | null;
}

export interface PageRow {
  id: string;
  book_id: string;
  page_number: number;
  text: string;
  scene: string;
  image_url: string | null;
  status: "pending" | "done" | "failed";
  attempts: number;
}

export interface StepResult {
  status: BookStatus;
  coverUrl: string | null;
  pagesDone: number;
  pagesTotal: number;
  busy?: boolean;
  error?: string | null;
}

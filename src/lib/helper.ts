import { DailyCheckinQA, MultiSelectOption } from "@/types";

export function slugifyName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')         // remove non-word characters
      .replace(/\s+/g, '-')             // replace spaces with hyphens
      .replace(/--+/g, '-');            // collapse multiple hyphens
  }
  
  export function unslugifyName(slug: string): string {
    return slug
      .replace(/-/g, ' ')           // replace hyphens with spaces
      .replace(/\b\w/g, (c) => c.toUpperCase()) // optional: capitalize first letters
      .trim();
  }
  

  export function truncateText(text: string, maxChars: number, ending = '…'): string {
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars).trimEnd() + ending;
  }

  export function formatDuration(hours: number, minutes: number): string {
    const h = hours > 0 ? `${hours}h` : "";
    const m = minutes > 0 ? `${minutes}m` : "";
    return `${h} ${m}`.trim() || "0m";
  }

  export function formatAsTime(hours: number, minutes: number): string {
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }

  
  export const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, ""); // remove all tags
  }
  
export const htmlToPlainText = (html: string): string => {
  return html
    // Convert block-level tags to line breaks
    .replace(/<\/(h1|h2|h3|h4|h5|h6|p|div|blockquote)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    // Remove all other tags
    .replace(/<[^>]+>/g, "")
    // Decode common named entities
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    // ✅ Decode decimal entities: &#8216; → ‘
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    // ✅ Decode hex entities: &#x2019; → ’
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    // Collapse multiple line breaks/spaces
    .replace(/\n{2,}/g, "\n")
    .trim();
};



//threshold
//   0-40%:
// 41-70%:
// 71-100%:

export const getDailyCheckinsOverall = (entry: DailyCheckinQA[]) => {
  const maxPerQuestion = 5;

  const total = entry.reduce((acc, cur) => {
    let score = Number(cur.answer);
    if (cur.question_id === "dcq2") {
      // invert stress score so lower stress = higher value
      score = (maxPerQuestion - Number(cur.answer)) + 1;
    }
    return acc + score;
  }, 0);

  const maxPossible = entry.length * maxPerQuestion;
  const normalized = total / maxPossible; // 0–1

  return {
    score: parseFloat(normalized.toFixed(1)),        // e.g. 0.6
    percentage: parseFloat((normalized * 100).toFixed(1)), // e.g. 60.0
  };
};

export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)))
}



export type NonEmptyString = string & { __nonEmpty: true };
export function asNonEmptyString(value: string): NonEmptyString {
  if (!value.trim()) {
    throw new Error("phoneNumber cannot be empty");
  }
  return value as NonEmptyString;
}

export function stringsToOptions(
  values: string[] | null | undefined,
  allOptions: MultiSelectOption[]
): MultiSelectOption[] {
  if (!values) return [];
  return values
    .map((v) => allOptions.find((opt) => opt.value === v))
    .filter((opt): opt is MultiSelectOption => !!opt);
}

export function optionsToStrings(options: MultiSelectOption[] | null | undefined): string[] {
  if (!options) return [];
  return options.map((opt) => opt.value);
}

export function removeUnderscores(text: string): string {
  return text.replace(/_/g, ' ');
}

"use server";
import { nanoid } from "nanoid";
import { htmlToPlainText } from "../lib/helper";
import { XMLParser } from "fast-xml-parser";
import { Post, Posts } from "./crudPosts";

type RssGuid = { "#text": string; isPermaLink?: string };

type RssJson = {
  rss: {
    channel: {
      title: string;
      link: string;
      description: string;
      lastBuildDate?: string;
      item: {
        guid: RssGuid;
        title: string;
        link: string;
        description: string;
        pubDate?: string;
        "dc:creator"?: string;
        category?: string | string[];
        "content:encoded"?: string;
        "media:content"?: { url: string; type?: string };
        "media:thumbnail"?: { url: string };
      }[];
    };
  };
};

// ---- ATOM ----
export type AtomLink = {
  href: string;
  rel?: string;
  type?: string;
};

export type AtomEntry = {
  id: string;
  title: string | { "#text": string };
  updated?: string;
  published?: string;
  summary?: string;
  content?: string | { "#text": string } | { _: string };
  link?: AtomLink | AtomLink[];
  author?: { name?: string } | { name?: string }[];
};

export type AtomFeed = {
  feed: {
    title: string;
    id: string;
    updated: string;
    link: AtomLink[];
    entry: AtomEntry[];
  };
};

// ------- HELPERS -------
function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null;
}

function toText(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;

  if (isRecord(val)) {
    if (typeof val["#text"] === "string") return val["#text"];
    if (typeof val["_"] === "string") return val["_"];
  }

  return "";
}

function extractImageFromHtml(html?: string): string | undefined {
  if (!html) return undefined;
  const mediaMatch = html.match(/<media:content[^>]+url="([^"]+)"/i);
  if (mediaMatch) return mediaMatch[1];

  const imgMatch = html.match(/<img[^>]+src="([^"]+)"/i);
  return imgMatch ? imgMatch[1] : undefined;
}

// ------- RSS MAPPER -------
function mapRssItem(item: RssJson["rss"]["channel"]["item"][0]): Post {
  const descriptionHtml = item["content:encoded"] ?? item.description;

  const categories = Array.isArray(item.category)
    ? item.category
    : item.category
    ? [item.category]
    : [];

  const thumbnail =
    item["media:content"]?.url ||
    item["media:thumbnail"]?.url ||
    extractImageFromHtml(descriptionHtml);

  return {
    id: nanoid(10),
    title: htmlToPlainText(toText(item.title)),
    slug: toText(item.link),
    description: descriptionHtml,
    category: "7p2v1Ur_O4",
    author: item["dc:creator"] ?? "Unknown",
    tags: categories.join(","),
    video: item["media:content"]?.type?.includes("video")
      ? item["media:content"]?.url
      : undefined,
    audio: item["media:content"]?.type?.includes("audio")
      ? item["media:content"]?.url
      : undefined,
    thumbnail,
    duration_hours: 0,
    duration_minutes: 0,
    created_at: item.pubDate ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ------- ATOM MAPPER -------
function mapAtomEntry(entry: AtomEntry): Post {
  const content = toText(entry.content) || entry.summary || "";
  const descriptionHtml = content;

  // pick correct link
  let link = "";
  if (Array.isArray(entry.link)) {
    link = entry.link.find((l) => l.rel === "alternate")?.href || entry.link[0]?.href || "";
  } else if (entry.link) {
    link = entry.link.href;
  }

  const thumbnail = extractImageFromHtml(descriptionHtml);

  return {
    id: nanoid(10),
    title: htmlToPlainText(toText(entry.title)),
    slug: link,
    description: descriptionHtml,
    category: "7p2v1Ur_O4",
    author:
      Array.isArray(entry.author)
        ? entry.author[0]?.name || "Unknown"
        : entry.author?.name || "Unknown",
    tags: "",
    thumbnail,
    video: undefined,
    audio: undefined,
    duration_hours: 0,
    duration_minutes: 0,
    created_at: entry.published || entry.updated || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ------- MAIN FUNCTION -------
export async function getRssNews(): Promise<Posts> {
  const feedUrl = "https://theconversation.com/au/health/articles.atom";

  try {
    let res = await fetch(feedUrl);
    if (!res.ok) {
      res = await fetch("https://online.vu.edu.au/taxonomy/term/321/all/feed");
    }
    if (!res.ok) throw new Error(`Failed to fetch RSS feed: ${res.status}`);
    const xml = await res.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      textNodeName: "#text",
      processEntities: true,
    });

    const json = parser.parse(xml);

    // Detect RSS vs Atom by structure, not URL
    if (json.feed) {
      const feed = json as AtomFeed;
      return (feed.feed.entry || []).map(mapAtomEntry);
    } else if (json.rss?.channel?.item) {
      const feed = json as RssJson;
      return feed.rss.channel.item.map(mapRssItem);
    } else {
      console.log("Unknown feed format");
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

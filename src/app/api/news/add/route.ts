import { createPost, getPostsByCategory, deletePostsByCategory } from '@/serverActions/crudPosts';
import { getRssNews } from '@/serverActions/RssNews';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const newsRes = await getRssNews();

    // If RSS returned no items, don't delete anything
    if (!newsRes || newsRes.length === 0) {
      return NextResponse.json({
        success: true,
        message: "RSS returned no items. No changes made.",
        data: []
      });
    }

    const categoryId = '7p2v1Ur_O4';

    const { data: existingPosts } = await getPostsByCategory(categoryId);
    const existingSlugs = new Set(existingPosts?.map(post => post.slug) || []);

    // Filter items that are new
    const newNews = newsRes.filter(news => !existingSlugs.has(news.slug));

    // Only delete old posts if new items are available
    if (newNews.length > 0) {
      await deletePostsByCategory(categoryId);
    }

    // Add new posts
    const addedPosts = await Promise.all(
      newNews.map((news) => createPost(news))
    );

    return NextResponse.json({
      success: true,
      message: newNews.length ? "Posts updated" : "No new posts to add",
      data: addedPosts
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to update RSS posts' },
      { status: 500 }
    );
  }
}

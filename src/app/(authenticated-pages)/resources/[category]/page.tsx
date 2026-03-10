"use client";

import PostCards from "@/components/post/postCards";
import PostFilter from "@/components/post/postFilter";
import Container from "@/components/ui/container";
import { usePostServiceContext } from "@/context/postServiceContext";
import { Posts } from "@/serverActions/crudPosts";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const PostPage = () => {
  const params = useParams();
  const category = params?.category as string;

  const { allPosts } = usePostServiceContext();
  const categoryId = category.split('~')[0]

  // only recompute when inputs change
  const data = useMemo(() => {
    return allPosts.filter(
      (i) =>
        i.category === categoryId
    );
  }, [allPosts, category]);

  const [sortedData, setSortedData] = useState<Posts>(data);

  // keep sortedData in sync when base data changes
  useEffect(() => {
    setSortedData(data);
  }, [data]);

  return (<Container>
    <div className="space-y-2">
      <PostFilter data={data} onChange={setSortedData} />

      {sortedData.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          No data available
        </div>
      ) : (
        <div className="grid">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 flex-wrap gap-5 gap-y-10 w-full-sidebar">
            <PostCards
              id_prefix="video-content"
              data={sortedData}
              actionText="view"
            />
          </div>
        </div>
      )}
    </div>
    </Container>
  );
};

export default PostPage;

"use client";
import PostSidebar from "@/components/post/postSidebar";
import PostSingle from "@/components/post/singlePost";
import { usePostServiceContext } from "@/context/postServiceContext";
import { useUserActivityContext } from "@/context/userActivitiesContext";
import { useParams } from "next/navigation";

const BlogSingle = () => {
  const params = useParams()
  const slug = params?.slug  as string
  const postId = slug.split('~')[0]
  const { allPosts } = usePostServiceContext();
  const { useActivityLogger} = useUserActivityContext()
  const data = allPosts.find((b) => b.id == postId) ?? null;


  useActivityLogger({ targetId: data?.id || "", targetType: data?.category || "", action: 'read' })

  return (
    <div className="flex gap-6 h-full">
      <PostSingle id={postId}/>
      <PostSidebar currentPost={data} currentCategory="7p2v1Ur_O6"/>
    </div>
  );
};

export default BlogSingle;

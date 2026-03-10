"use client";
import Video from "@/components/ui/video";
import Audio from "@/components/ui/audio";
import { Post } from "@/serverActions/crudPosts";
import { usePostServiceContext } from "@/context/postServiceContext";
import { useAppServiceContext } from "@/context/appServiceContext";
import { Button } from "../ui/button";
import { useState } from "react";

type PostSingle = {
  id: string;
  data?: Post;
} | PostSingleData;

type PostSingleData = {
  id?: string;
  data: Post;
  
}

const PostSingle = ({id, data }: PostSingle) => {
  const {allPosts, allLikes, toggleLike} = usePostServiceContext()
  const {currentUser} = useAppServiceContext()
  const [loading, setLoading] = useState(false);
  const postData = id ? allPosts.find(p => p.id == id) : data
  if(!postData) {
    return <><span>Post not found.</span></>
  }
  const postLikes = allLikes.filter(l => l.post_id == postData.id)
  const likesCount = postLikes.length
  const isLiked = postLikes.some(l =>  l.user_id === currentUser.id)
  
  const handleLikeToggle = async () => {
    const userId = currentUser.id
    setLoading(true);
    toggleLike(postData.id, userId)
    setLoading(false);
  };



  return (<>
    <div className="card flex-1 overflow-hidden">
      <div className="rounded-xl flex-1 max-h-webkit-fill overflow-auto">
        {postData ? (
          <>
            {postData.audio ? (
              <Audio
              className="w-[95%] mx-auto"
                src={postData.audio}
                title={""}
                thumbnail={postData.thumbnail}
              />
              
            ) : (
              <Video
                className="aspect-[16/9]"
                src={postData.video}
                title={postData.title ?? ""}
                thumbnail={postData.thumbnail}
              ></Video>
            )}

            <div className="p-4">
              <h1 className="mt-6 text-xl font-medium">{postData.title}</h1>
              <div className="meta-container mt-2 gap-2 capitalize">
                <span className="pr-2">{postData.author}</span>
                {postData.tags &&
                  postData.tags.split(",").map((i) => (
                    <span key={i} className="pr-2">
                      {i}
                    </span>
                  ))}
              </div>
               <div className="mt-6 flex items-center gap-2">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  onClick={handleLikeToggle}
                  disabled={loading}
                >
                  {isLiked ? "❤️ Liked" : "🤍 Like"}
                </Button>
                <span className="text-sm text-muted-foreground">{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
              </div>
              <div className="mt-10">
                <p className="font-medium text-sm">Description</p>
                <div
                  className="prose text-sm mt-2 text-muted-foreground max-w-none"
                  dangerouslySetInnerHTML={{ __html: postData.description
                    ?.replace(/<br class="ProseMirror-trailingBreak">/g, "")
                    ?.replace(/<p>(\s*?)<\/p>/g, "<br />") ?? "" }}
                />
              </div>
            </div>
          </>
        ) : (
          // Loading skeleton
          <div className="animate-pulse p-4 space-y-4">
            <div className="bg-zinc-200 rounded aspect-[16/9] w-full"></div>
            <div className="space-y-2 mt-4">
              <div className="h-6 bg-zinc-200 rounded w-1/2"></div>
              <div className="h-4 bg-zinc-200 rounded w-1/3"></div>
              <div className="flex gap-2">
                <div className="h-5 w-10 bg-zinc-200 rounded"></div>
                <div className="h-5 w-12 bg-zinc-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2 mt-6">
              <div className="h-4 bg-zinc-200 rounded w-full"></div>
              <div className="h-4 bg-zinc-200 rounded w-5/6"></div>
              <div className="h-4 bg-zinc-200 rounded w-2/3"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  </>
  );
};

export default PostSingle;

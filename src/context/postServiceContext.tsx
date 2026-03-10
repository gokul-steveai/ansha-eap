"use client";
import { Category } from "@/serverActions/crudCategories";
import { createLike, deleteLike, Like } from "@/serverActions/crudLikes";
import { getPostServiceData, Post, Posts } from "@/serverActions/crudPosts";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type PostServiceContextType = {
  isFetching: boolean;
  generatePostLink: (post:Post)=> string;
  setCategories:Dispatch<SetStateAction<Category[]>>;
  categories: Category[];
  allPosts: Posts;
  setAllPosts: Dispatch<SetStateAction<Posts>>;
  blogs: Posts;
  yogas: Posts;
  videoContents: Posts;
  healthNews: Posts;
  latestPosts: Posts;
  allLikes: Like[];
  toggleLike: (postId: string, userId: string) => Promise<boolean>;
};

const PostServiceContext = createContext<PostServiceContextType | null>(null);

export function PostServiceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allPosts, setAllPosts] = useState<Posts>([]);
  // const [blogs, setBlogs] = useState<Posts>([]);
  // const [yogas, setYogas] = useState<Posts>([]);
  // const [videoContents, setVideoContents] = useState<Posts>([]);
  // const [healthNews, setHealthNews] = useState<Posts>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allLikes,setAllLikes] = useState<Like[]>([])
  const [isFetching,setIsFetching] = useState(true)
  // fetch data
useEffect(() => {
  async function init() {
    try {
      setIsFetching(true)

      const postServiceData = await getPostServiceData();
      console.log(postServiceData, 'postServiceData')
      if (!postServiceData.success || !postServiceData.data) return;
      const { posts: postsRes, categories: catRes, likes: likesRes } = postServiceData.data;
      
      
      // Posts
      const postsData = postsRes ?? [];
      
      setAllPosts(postsData);
      // Categories
      if (catRes) setCategories(catRes);
      // Likes
      if (likesRes) setAllLikes(likesRes);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsFetching(false);
    }
  }

  init();
}, []);

  // derive categories once when allPosts changes
  // useEffect(() => {
  //   if (!allPosts.length) return;
  //   setHealthNews(allPosts.filter((p) => p.category === "7p2v1Ur_O4") as Posts);
  //   setYogas(allPosts.filter((p) => p.category === "7p2v1Ur_O5") as Posts);
  //   setBlogs(allPosts.filter((p) => p.category === "7p2v1Ur_O6") as Posts);
  //   setVideoContents(
  //     allPosts.filter((p) => p.category === "7p2v1Ur_O1") as Posts
  //   );
  // }, [allPosts]);


  const healthNews = allPosts.filter((p) => p.category === "7p2v1Ur_O4") as Posts;
  const yogas = allPosts.filter((p) => p.category === "7p2v1Ur_O5") as Posts;
  const blogs = allPosts.filter((p) => p.category === "7p2v1Ur_O6") as Posts;
  const videoContents = allPosts.filter(p => !!p.video) as Posts;


  const latestPosts = [
    yogas.at(-1) ?? null,
    healthNews.at(-1) ?? null,
    blogs.at(-1) ?? null,
    videoContents.at(-1) ?? null,
  ].filter(Boolean) as Posts;

  function generatePostLink(post: Post) {
    return `/resources/${post.category}~${categories.find(c => c.id == post.category)?.label}/${post.id}~${post.title}`
  }


  const toggleLike = async (postId:string, userId:string) => {
    const isLiked = allLikes.some(l => l.post_id == postId && l.user_id == userId)
    
    const res = isLiked ? unLikePost(postId, userId) : likePost(postId, userId)
    return res

  }

  const likePost = async (postId:string, userId:string) => {
    const {data, success, message} = await createLike(userId, postId)
    console.log(message)
    if(success && data){
      setAllLikes((prev) => ([...prev, data]))
    }
    return success
  }

  const unLikePost = async (postId:string, userId:string) => {
    const {data, success, message} = await deleteLike(userId, postId)
    console.log(message)
    if(success && data){
      setAllLikes((prev) => {
        const filtered = prev.filter(like => like.id !== data.id)
        return filtered
      })
    }
    return success
  }

  return (
    <PostServiceContext.Provider
      value={{
        isFetching,
        allLikes,
        toggleLike,
        generatePostLink,
        setCategories,
        categories,
        allPosts,
        setAllPosts,
        blogs,
        yogas,
        videoContents,
        healthNews,
        latestPosts,
      }}
    >
      {children}
    </PostServiceContext.Provider>
  );
}

export function usePostServiceContext() {
  const ctx = useContext(PostServiceContext);
  if (!ctx) {
    throw new Error(
      "usePostServiceContext must be used within PostServiceProvider"
    );
  }
  return ctx;
}

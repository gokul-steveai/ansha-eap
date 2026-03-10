"use client"
import PostCards from "@/components/post/postCards";
import { Post } from "@/serverActions/crudPosts";
import { getRssNews } from "@/serverActions/RssNews";
import { useEffect, useState } from "react";


const Page = () => {
  const [data, setData] = useState<Post[]>([])

  useEffect(()=>{

    const getNews = async () => {
        const res = await getRssNews()
        setData(res)

    }

    getNews()
    

  },[])
  
  return (
    <div className="p-10">
      <PostCards
      id_prefix="test"
      data={data}
      actionText="view"
       />
    </div>
  );
}

export default Page;
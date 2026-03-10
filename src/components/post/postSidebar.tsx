"use client";
import { usePostServiceContext } from "@/context/postServiceContext";
import Container from "../ui/container";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import ImageWithFallback from "../ui/imageWithFallback";
import { cn } from "@/lib/utils";
import { Post } from "@/serverActions/crudPosts";
import { useAppServiceContext } from "@/context/appServiceContext";

type PostSidebarProps = {
    currentPost: Partial<Post> | null;
    currentCategory: string;
}
const PostSidebar = ({currentPost, currentCategory}:PostSidebarProps) => {
  const {categories} = usePostServiceContext()
  console.log(currentCategory, currentPost)
  const {latestPosts } = usePostServiceContext();
  const {setGlobalSearchOpen} = useAppServiceContext()

  return (
    <Container className="max-md:hidden max-w-[400px]">
      <div className="flex flex-col flex-nowrap gap-6">
        <div className="card space-y-4">
          <div
          className="flex flex-row gap-2 items-center">
            <Input
              onClick={()=>setGlobalSearchOpen(true)}
              className="p-5 !ring-0 !shadow-none cursor-pointer"
              type="search"
              name="post-search"
              readOnly
              placeholder="Keyword"
            />
            <Button
            onClick={()=>setGlobalSearchOpen(true)}
            className="p-5" size={"icon"}>
              <Search size={40} />
            </Button>
          </div>
          <div>
            <h4 className="card-title mb-2">Categories</h4>
            <ul className="font-medium muted-text">
              {categories.map((i) => (
                <li key={i.id} className="capitalize">
                  <Link
                    className="hover:text-app-purple-300"
                    href={"/resources/" + i.label}
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <h4 className="card-title mb-2">Recent Posts</h4>
          <div>
            {(latestPosts.length > 0) &&
              latestPosts.map((i,index) => <PostItem key={(i?.id && i?.category) ? i.id + i.category + index : index } item={i} />)}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PostSidebar;

export function PostItem({ item, className, disableLink = false }: {disableLink?:boolean, item: Partial<Post> & { category?: string }, className?:string }) {
  const {categories} = usePostServiceContext()
  return disableLink ? (
    <div
      className={cn(
        "space-x-4 rounded-xl text-base p-2 bg-muted flex flex-row justify-between items-center",
        className
      )}
    >
      <div className="h-full w-fit">
        <ImageWithFallback
          iconSize={30}
          className="w-[3em] h-[3em] object-contain w-auto !bg-gray-200 aspect-square rounded overflow-hidden"
          width={40}
          height={40}
          alt=""
          src={item.thumbnail}
        />
      </div>
      <div className="flex-1">
        <p className="font-medium muted-text">
          {item.title}
        </p>
        <p className="capitalize muted-text">
          {categories.find((i) => i.id == item.category)?.label}
        </p>
      </div>
    </div>
  ) : (
    <Link
      className={cn(
        "space-x-4 rounded-xl text-base p-2 bg-muted flex flex-row justify-between items-center",
        className
      )}
      href={item.slug ?? "#"}
    >
      <div className="h-full w-fit">
        <ImageWithFallback
          iconSize={30}
          className="w-[3em] h-[3em] object-contain w-auto !bg-gray-200 aspect-square rounded overflow-hidden"
          width={40}
          height={40}
          alt=""
          src={item.thumbnail}
        />
      </div>
      <div className="flex-1">
        <p className="font-medium muted-text">
          {item.title}
        </p>
        <p className="capitalize muted-text">
          {categories.find((i) => i.id == item.category)?.label}
        </p>
      </div>
    </Link>
  );
}
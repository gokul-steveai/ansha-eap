"use client"

import Container from "@/components/ui/container";
import ImageWithFallback from "@/components/ui/imageWithFallback";
import { useAppServiceContext } from "@/context/appServiceContext";
import { usePostServiceContext } from "@/context/postServiceContext";
import Link from "next/link";

export default function Page() {
    const { isFetching, allLikes, allPosts, generatePostLink } = usePostServiceContext()
    const { currentUser } = useAppServiceContext()
    
    const likedPosts = allLikes.filter(l => l.user_id == currentUser.id).map(i => i.post_id)
    const filteredPosts = allPosts.filter(p => likedPosts.includes(p.id))

    return (
        <Container className="card">
            <div className="flex flex-row items-center gap-4">
                <h3 className="section-title pb-4">My Favorites</h3>                
            </div>
            {isFetching && <FavoritesSkeleton />}
          {!isFetching &&  <div className="md:p-4 grid md:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-4">
                {filteredPosts.length > 0 && filteredPosts.map((post) => {

                    return <>
                        <Link
                        className="w-[380px] hover:ring-1 hover:ring-primary/80 bg-gray-50 flex flex-row flex-nowrap gap-4 p-4 rounded-lg"
                            href={generatePostLink(post) + '?back=/user/favorites' + `&backlabel=${encodeURIComponent('My Favorites')}`}>
                            <ImageWithFallback
                                className="!block w-[70px] h-[64px] rounded object-cover"
                                width={70}
                                height={64}
                                alt={post.title}
                                src={post.thumbnail}
                            />
                            <div>
                                <p className="line-clamp-2">{post.title}</p>
                                <p className="text-xs text-muted-foreground">{post.author}</p>
                            </div>
                        </Link>
                    
                    </>
                })
                }
            </div>}
        </Container>
    );
}

function FavoritesSkeleton() {
  return (
      <div className="grid md:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-[380px] bg-gray-100 dark:bg-gray-800 flex flex-row flex-nowrap gap-4 p-4 rounded-lg animate-pulse"
          >
            <div className="w-[70px] h-[64px] rounded bg-gray-300 dark:bg-gray-700" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
  );
}
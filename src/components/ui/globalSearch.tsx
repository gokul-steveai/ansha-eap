"use client";

import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAppServiceContext } from "@/context/appServiceContext";
import { usePostServiceContext } from "@/context/postServiceContext";
import { Posts } from "@/serverActions/crudPosts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostItem } from "../post/postSidebar";
import { useNavItems } from "../sidebar/navItems";
import { Button } from "./button";

export function GlobalSearch() {
  const navItems = useNavItems()
  const {globalSearchOpen, setGlobalSearchOpen} = useAppServiceContext()
  const { allPosts, latestPosts, generatePostLink, categories } = usePostServiceContext();
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "f") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setGlobalSearchOpen((globalSearchOpen) => !globalSearchOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function showSearchDialog() {
    setGlobalSearchOpen(true);
  }

  const filteredAnsaContents:Record<string,Posts> = {
    title:[],
    tags: [],
    category: [],
    author: [],
    content: [],
  }
  const filteredNotAnsaContents:Record<string,Posts> = {
    title:[],
    tags: [],
    category: [],
    author: [],
    content: [],
  }

  allPosts.forEach((item) => {
    const categoryId = item.category
    const isAnsaContent = categoryId != '7p2v1Ur_O4'
    const targetMap = isAnsaContent ? filteredAnsaContents : filteredNotAnsaContents

    const categoryName = categories.find(c => c.id == item.category)?.label || ""
    const categoryString = JSON.stringify(categoryName).toLowerCase()
    const itemString = JSON.stringify(item).toLowerCase() + categoryString;
    const terms = search.toLowerCase().split(/\s+/).filter(Boolean); // split on spaces, ignore empty
    
    if(!terms.every((term) => itemString.includes(term))) return

    const titleString = JSON.stringify(item.title).toLowerCase()
    const tagString = JSON.stringify(item.tags).toLowerCase()
    const authorString = JSON.stringify(item.author).toLowerCase()

    if(terms.every((term) => titleString.includes(term))){
      targetMap.title.push(item)

    } else if(terms.every((term) => categoryString.includes(term))) {
      targetMap.category.push(item)

    } else if(terms.every((term) => tagString.includes(term))) {
      targetMap.tags.push(item)
    
    } else if(terms.every((term) => authorString.includes(term))) {
      targetMap.author.push(item)
    } else {
      targetMap.content.push(item)
    }
  });

  const filteredPost = [
    ...filteredAnsaContents.title,
    ...filteredAnsaContents.tags,
    ...filteredAnsaContents.category,
    ...filteredAnsaContents.author,
    ...filteredAnsaContents.content,

    ...filteredNotAnsaContents.title,
    ...filteredNotAnsaContents.tags,
    ...filteredNotAnsaContents.category,
    ...filteredNotAnsaContents.author,
    ...filteredNotAnsaContents.content
  ]
  

  function handleOnSelect(slug?: string) {
    if (!slug) return;
    setGlobalSearchOpen(false);
    router.push(slug);
  }

  return (
    <>
      <Button
        className="rounded-full bg-white aspect-square !p-5 text-primary"
        size="icon"
        variant="secondary"
        onClick={showSearchDialog}
      >
        <Search />
      </Button>
      <CommandDialog
        shouldFilter={false}
        className="p-2 w-full translate-y-0 top-20"
        open={globalSearchOpen}
        onOpenChange={setGlobalSearchOpen}
      >
        <CommandInput
          placeholder="Search..."
          onValueChange={(v) => setSearch(v)}
          value={search}
        />

        <CommandList className="h-full max-h-[80vh]">
          {search ? (
            <>
              {filteredPost.length > 0 && (
                <CommandGroup heading="Posts">
                  {filteredPost.map((i, index) => {
                    return (
                      <CommandItem
                        onSelect={() => handleOnSelect(generatePostLink(i))}
                        className="!p-0 "
                        key={
                          i.id && i.category ? i.id + i.category + index : index
                        }
                      >
                        <PostItem
                          disableLink
                          className="bg-transparent w-full text-sm rounded"
                          item={i}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              <CommandEmpty>No results found.</CommandEmpty>
            </>
          ) : (
            <>
              <CommandGroup heading="Recent Posts">
                {latestPosts.length > 0 &&
                  latestPosts.map((i, index) => (
                    <CommandItem
                      className="!p-0"
                      onSelect={() => handleOnSelect(generatePostLink(i))}
                      key={
                        i.id && i.category ? i.id + i.category + index : index
                      }
                      value={`${i.title} ${i.category ?? ""}`} // 👈 searchable text
                    >
                      <PostItem
                        disableLink
                        className="bg-transparent w-full text-sm rounded"
                        item={i}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <div className="grid grid-cols-4">
                <CommandGroup
                  className="p-1.5 text-sm"
                  heading="Learning & Development"
                >
                  {navItems
                    .filter((i) => i.link == "/resources")[0]
                    .subitems?.map((i) => (
                      <CommandItem
                        key={i.title}
                        className="!py-1 text-xs"
                        onSelect={() => handleOnSelect(i.link)}
                      >
                        {i.title}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </div>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

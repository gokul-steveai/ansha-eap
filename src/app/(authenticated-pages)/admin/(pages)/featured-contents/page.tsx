"use client";
import FeaturedContentForm from "@/components/forms/formFeaturedContent";
import Container from "@/components/ui/container";
import {
  FeaturedContent,
  getFeaturedContents,
} from "@/serverActions/crudFeaturedContent";
import { useEffect, useState } from "react";

const Page = () => {
  const [featuredPosts, setFeaturedPosts] = useState<FeaturedContent[]>([]);
  useEffect(() => {
    getFeaturedContents().then((r) => {
      if (r.data) {
        setFeaturedPosts(r.data);
      }
    });
  }, []);

  return (
    <Container>
      <div>
        <h2 className="mb-5">Featured Contents</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="card">
            <FeaturedContentForm
              header="Post"
              editMode
              defaultValues={{ ...featuredPosts[0] }}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Page;

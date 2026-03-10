"use client";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";

const Page = () => {
  return (
    <Container>
      <div className="space-x-2">
          <Button href="/admin/posts" variant="outline">Posts</Button>   
          <Button href="/admin/featured-contents" variant="outline">Featured Contents</Button>   
          <Button href="/admin/companies" variant="outline">Companies</Button>   
          <Button href="/admin/services" variant="outline">Services</Button>   
          <Button href="/admin/practitioners" variant="outline">Practitioners</Button>   
          <Button href="/admin/categories" variant="outline">Categories</Button>
          <Button href="/admin/public-events" variant="outline">Public Events</Button>
          <Button href="/admin/short-courses" variant="outline">Short Courses</Button>
          <Button href="/admin/partners" variant="outline">Partners</Button>
          <Button href="/admin/marli" variant="outline">Marli</Button>
      </div>
    </Container>
  );
};

export default Page;

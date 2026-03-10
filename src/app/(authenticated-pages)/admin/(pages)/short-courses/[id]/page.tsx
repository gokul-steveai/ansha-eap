"use client"
import FormShortCourse from "@/components/forms/formShortCourse";
import Container from "@/components/ui/container";
import { getShortCourseById, ShortCourse } from "@/serverActions/crudShortCourses";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
    const params = useParams();
    const id = params?.id as string;

    const [data, setData] = useState<ShortCourse | undefined | 'loading'>('loading')

    useEffect(() => {
        if (!id) return
        const fetchData = async () => {
            const res = await getShortCourseById(id)
            setData(res.data)
        }
        fetchData()

    }, [id])

    return (
        <Container className="card w-full-sidebar">
            <div className="card flex-1 overflow-auto">
                { data == "loading" && 
                    "Retreiving Short Course Information"
                }

                { !data && 
                    "Short Course not found"
                }

                { data != "loading" && data &&
                    <FormShortCourse data={data} />
                }
            </div>
        </Container>
    );
}

export default Page;
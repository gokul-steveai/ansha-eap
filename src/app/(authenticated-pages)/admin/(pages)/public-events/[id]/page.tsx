"use client"
import PublicEventForm from "@/components/forms/formPublicEvents";
import Container from "@/components/ui/container";
import { getPublicEventById, PublicEvent } from "@/serverActions/crudPublicEvents";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
    const params = useParams();
    const id = params?.id as string;

    const [data, setData] = useState<PublicEvent | undefined | 'loading'>('loading')

    useEffect(() => {
        if (!id) return
        const fetchData = async () => {
            const res = await getPublicEventById(id)
            setData(res.data)
        }
        fetchData()

    }, [id])

    return (
        <Container className="card w-full-sidebar">
            <div className="card flex-1 overflow-auto">
                { data == "loading" && 
                    "Retreiving Event Information"
                }

                { !data && 
                    "Event not found"
                }

                { data != "loading" && data &&
                    <PublicEventForm event={data} />
                }
            </div>
        </Container>
    );
}

export default Page;
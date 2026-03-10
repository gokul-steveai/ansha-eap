"use client"
import MarliForm from "@/components/forms/formMarli";
import Container from "@/components/ui/container";
import { getMarliById, Marli } from "@/serverActions/crudMarli";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
    const params = useParams();
    const id = params?.id as string;

    const [data, setData] = useState<Marli | undefined | 'loading'>('loading')

    useEffect(() => {
        if (!id) return
        const fetchData = async () => {
            const res = await getMarliById(id)
            setData(res.data)
        }
        fetchData()

    }, [id])

    return (
        <Container className="card w-full-sidebar">
            <div className="card flex-1 overflow-auto">
                { data == "loading" && 
                    "Retreiving Marli Information"
                }

                { !data && 
                    "Marli not found"
                }

                { data != "loading" && data &&
                    <MarliForm data={data} />
                }
            </div>
        </Container>
    );
}

export default Page;
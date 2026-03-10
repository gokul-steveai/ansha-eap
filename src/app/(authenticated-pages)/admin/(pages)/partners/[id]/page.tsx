"use client"
import PartnerForm from "@/components/forms/formPartners";
import Container from "@/components/ui/container";
import { getPartnerById, Partner } from "@/serverActions/crudPartners";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
    const params = useParams();
    const id = params?.id as string;

    const [data, setData] = useState<Partner | undefined | 'loading'>('loading')

    useEffect(() => {
        if (!id) return
        const fetchData = async () => {
            const res = await getPartnerById(id)
            setData(res.data)
        }
        fetchData()

    }, [id])

    return (
        <Container className="card w-full-sidebar">
            <div className="card flex-1 overflow-auto">
                { data == "loading" && 
                    "Retreiving Partner Information"
                }

                { !data && 
                    "Partner not found"
                }

                { data != "loading" && data &&
                    <PartnerForm data={data} />
                }
            </div>
        </Container>
    );
}

export default Page;
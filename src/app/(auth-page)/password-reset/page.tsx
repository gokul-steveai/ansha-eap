"use client"
import {FormSendResetLink } from "@/components/authentication/FormSendResetLink"
import { useSearchParams } from "next/navigation";
import Image from "next/image"
import { FormResetPassword } from "@/components/authentication/FormResetPassword";

export default function Page() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const token = params.get("token") || "";
  const isAdmin = params.get('admin') != null;

  console.log(isAdmin, 'isAdmin')
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-[800px] max-w-[98vw]">
        <div className="md:min-h-[500px] grid md:grid-cols-2 rounded-3xl overflow-hidden bg-white">
          <div className="bg-app-green-400 p-5 md:p-10 items-center justify-center flex">
            <Image
              className="max-md:w-[120px]"
              src="/assets/images/elevate-white.png"
              width={350}
              height={200}
              alt="logo" />
          </div>
          <div className="flex justify-center flex-col gap-6 p-10">
            {(email && token ) || isAdmin ? <FormResetPassword isAdmin={isAdmin} email={email} token={token} /> : <FormSendResetLink />}
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
              Remember your password?{" "}
              <a href="/login">Go back to login</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

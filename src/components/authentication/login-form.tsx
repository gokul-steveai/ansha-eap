"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LoginUser } from "@/serverActions/login_logout";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import OtpVerification from "../OtpVerification";
import { Checkbox } from "../ui/checkbox";
import { User } from "@/serverActions/crudUsers";
import { AuthenticateUser } from "@/serverActions/authentication/authenticateUser";


export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useremail, setUserEmail] = useState("")
  const [userpass, setUserpass] = useState("")
  const [otpConfirmed, setOtpConfirmed] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter();


  useEffect(() => {
    if (!otpConfirmed) return

    const credentials = {
      useremail, userpass
    }
    async function login() {
      const authRes = await LoginUser(credentials, false)
      router.push(authRes?.redirectUrl)
    }
    login()

  }, [otpConfirmed])



  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const credentials = {
      useremail, userpass
    }


    try {
      const res = await AuthenticateUser(credentials)
      if (!res) {
        setError("Wrong credentials")
        return false
      }
      setUser(res)
    } catch (error) {
      const typedError = error as Error;
      setError(typedError?.message || 'Something went wrong');

    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="md:min-h-[500px] grid md:grid-cols-2 rounded-3xl overflow-hidden bg-white">
      <div className="bg-app-green-400 p-5 md:p-10 items-center justify-center flex">
        <Image
          className="max-md:w-[120px]"
          src="/assets/images/elevate-white.png"
          width={350}
          height={200}
          alt="logo" />
      </div>
      {!user &&
        <div className={cn("flex justify-center flex-col gap-6 p-10", className)} {...props}>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <span className="sr-only">ANSA Health</span>
                </a>
                <h3 className="font-bold">Login</h3>
                <div className="muted-text">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="hover:text-foreground underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                {error && <p className="text-xs text-red-400">{error}</p>}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="useremail"
                    value={useremail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    value={userpass}
                    onChange={(e) => setUserpass(e.target.value)}
                    id="password" type="password" name="userpass" required />
                </div>
                <div className="muted-text flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember_me" />
                    <label htmlFor="remember_me">Remember me</label>
                  </div>
                  <Link
                    className="hover:underline hover:text-foreground underline-offset-4"
                    href="/password-reset"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  isLoading={isLoading}
                  type="submit"
                  className={cn("w-full")}
                >
                  {user ? (
                    <>
                      <Check />
                      Success
                    </>
                  ) : (
                    <>Login</>
                  )}
                </Button>
              </div>
            </div>
          </form>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      }

      {user &&
        <OtpVerification className="mx-auto px-10 py-20"
          method="sms"
          // phoneNumber="61438011762"
          phoneNumber={user.phone}
          onConfirmChange={(v) => setOtpConfirmed(v)} />
      }

    </div>
  );
}

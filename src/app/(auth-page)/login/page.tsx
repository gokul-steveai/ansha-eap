import { LoginForm } from "@/components/authentication/login-form"
export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-[800px] max-w-[98vw]">
        <LoginForm />
      </div>
    </div>
  )
}

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMail } from "@/lib/email/elasticemail";
import { PASSWORD_RESET_TEMPLATE } from "@/lib/email/email_templates/EmailPasswordResetLink";
import { cn } from "@/lib/utils";
import { createPasswordResetToken } from "@/serverActions/crudPasswordResetToken";
import { getUserByEmail } from "@/serverActions/crudUsers";
import { Mail, MailCheck } from "lucide-react";
import { FormEvent, useState } from "react";

export function FormSendResetLink({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [useremail, setUserEmail] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!useremail) return;

        try {
            const { success: userFound, data } = await getUserByEmail(useremail);

            if (!userFound || !data) {
                setError("Email not found");
                return;
            }

            const resPasswordResetToken = await createPasswordResetToken(data.id);

            if (!resPasswordResetToken.success || !resPasswordResetToken.data) {
                setError("Something went wrong");
                return;
            }


            const link = `${process.env.NEXT_PUBLIC_APP_URL}/password-reset?email=${encodeURIComponent(useremail)}&token=${resPasswordResetToken.data.token}`
            const payload = {
                to: useremail,
                subject: "PASSWORD RESET LINK",
                htmlBody: PASSWORD_RESET_TEMPLATE({ link }),
            };

            await sendMail(payload)
            setSuccess(true);

        } catch (error) {
            const typedError = error as Error;
            setError(typedError?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {!success ? (
                <form className={className} {...props} onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <h3 className="font-bold">Reset password</h3>
                            <div className="muted-text text-center">
                                Enter your email address and we’ll send you a reset link.
                            </div>
                        </div>
                        <div className="space-y-6">

                            <div>
                                {error && <p className="text-xs text-red-400 mb-1">{error}</p>}
                                <div className="relative">
                                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                                        <Mail className="size-4" />
                                        <span className="sr-only">user email</span>
                                    </div>
                                    <Input
                                        className="pl-9"
                                        aria-invalid={!!error}
                                        aria-errormessage={error ? "email-error" : undefined}
                                        id="email"
                                        type="email"
                                        name="useremail"
                                        value={useremail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        placeholder="m@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                isLoading={isLoading}
                                type="submit"
                                className={cn("w-full")}
                            >
                                Send reset link
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 p-6 border rounded-lg bg-green-50 text-green-800">
                    <MailCheck className="w-10 h-10" />
                    <h4 className="font-bold text-lg">Reset link sent!</h4>
                    <p className="text-center text-sm">
                        If the email exists in our system, a password reset link has been sent.
                        Please check your inbox.
                    </p>
                    <p className="text-center text-xs text-green-700">
                        If you don’t see the email, please check your spam or junk folder.
                    </p>
                </div>
            )}
        </>
    );
}

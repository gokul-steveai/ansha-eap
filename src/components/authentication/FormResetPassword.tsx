"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPasswordResetToken, markTokenAsUsed, PasswordResetToken } from "@/serverActions/crudPasswordResetToken";
import { getUserByEmail, updateUser } from "@/serverActions/crudUsers"; // we’ll create this
import { User } from "@/types";
import { Check } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { PasswordInput } from "../ui/PasswordInput";

interface FormResetPasswordProps {
    email: string;
    token: string;
    className?: string;
    isAdmin?: boolean
}

export function FormResetPassword({ isAdmin, email, token, className, ...props }: FormResetPasswordProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | undefined>(undefined)
    const [tokenData, setTokenData] = useState<PasswordResetToken | null>(null)
    const [isValid, setIsvalid] = useState<"valid" | "expired" | "invalid" | null>(null)

    console.log(isAdmin, 'isAdmin')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, passwordResetTokenResponse] = await Promise.all([
                    getUserByEmail(email),
                    getPasswordResetToken(token),
                ]);

                // Now you have both user and token data
                if(!userResponse.success || !userResponse.data){
                    setIsvalid("invalid")
                    return
                }

                 if(!isAdmin) {
                    if (!passwordResetTokenResponse.success || !passwordResetTokenResponse.data) {
                        setIsvalid("invalid")
                        return
                    }

                    const passwordResetToken = passwordResetTokenResponse.data;

                    if (passwordResetToken.used || new Date(passwordResetToken.expires_at) < new Date()) {
                        setIsvalid('expired')
                        return;
                    }
                    setTokenData(passwordResetToken)
                }

                setUser(user)
                setIsvalid("valid")
                // Do something with user and token...
            } catch (err) {
                console.error(err);
            }
        };

        fetchData()

    }, [email, token, isAdmin])

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        if (isValid != 'valid') return

        if (!password || !confirmPassword) {
            setError("Please fill out all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            // Call server action to update password
            if (!user) return
            if (!isAdmin && !tokenData) return;
            
            const res = await updateUser(user.id, { password });
            if(tokenData){
                const resMarkTokenUsed = await markTokenAsUsed(tokenData?.id)
                if (!resMarkTokenUsed.success) {
                    setError(res.message || "Something went wrong");
                    return;
                }
            }

            setSuccess(true);
        } catch (err) {
            const typedError = err as Error;
            setError(typedError?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {isValid == 'valid' && <>
                {!success ? (
                    <form className={className} {...props} onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <h3 className="font-bold">Set New Password</h3>
                                <div className="muted-text text-center">
                                    Enter a new password for your account.
                                </div>
                            </div>

                            <div className="space-y-6">
                                {error && <p className="text-xs text-red-400">{error}</p>}
                                <PasswordInput
                                id="password"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />

                                <PasswordInput
                                    id="confirmPassword"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    />

                                <Button isLoading={isLoading} type="submit" className={cn("w-full")}>
                                    Set Password
                                </Button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 p-6 border rounded-lg bg-green-50 text-green-800">
                        <Check className="w-10 h-10" />
                        <h4 className="font-bold text-lg">Password updated!</h4>
                        <p className="text-center text-sm">
                            Your password has been successfully updated.
                            <Link
                                href="/login">
                                Click here to log in with your new password.
                            </Link>
                        </p>
                    </div>
                )}

            </>}

            {isValid === null && (
                <div className="flex flex-col flex-nowrap items-center justify-center gap-4 animate-pulse">
                    <div className="space-y-2">
                        <div className="h-8 w-52 mx-auto bg-gray-300 rounded"></div>
                        <div className="h-6 w-70 mx-auto bg-gray-300 rounded"></div>
                    </div>
                    <div className="space-y-6 w-full">
                        <div className="h-11 w-full bg-gray-300 rounded-md"></div>
                        <div className="h-11 w-full bg-gray-300 rounded-md"></div>
                        <div className="h-12 w-full bg-gray-300 rounded-md"></div>
                    </div>
                </div>
            )}


            {isValid === "expired" && (
                <div className="p-4 text-center text-red-600 border rounded bg-red-50 space-y-2">
                    <p>This password reset link has expired. Please request a new one.</p>
                    <Link
                        href="/password-reset"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        Request new reset link
                    </Link>
                </div>
            )}

            {isValid === "invalid" && (
                <div className="p-4 text-center text-red-600 border rounded bg-red-50 space-y-2">
                    <p>Invalid password reset link.</p>
                    <Link
                        href="/password-reset"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        Request new reset link
                    </Link>
                </div>
            )}
        </>
    );
}

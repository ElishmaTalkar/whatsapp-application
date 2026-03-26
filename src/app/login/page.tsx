"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label } from "@/components/ui";
import { Loader2, Mail, Lock, LogIn, ArrowRight, ShieldCheck } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const success = searchParams.get("success");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md bg-[#121214] border-[#1e1e21] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

            <CardHeader className="space-y-1 text-center pt-8">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-600/20">
                        <ShieldCheck className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight text-white">
                    Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Login to manage your AI agents
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {success && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-400 text-sm">
                            {success}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-gray-300">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                            <Input
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="bg-[#1a1a1d] border-[#2d2d30] h-11 text-white pl-10 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                            <Label className="text-gray-300">Password</Label>
                            <Link href="#" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                            <Input
                                name="password"
                                type="password"
                                required
                                className="bg-[#1a1a1d] border-[#2d2d30] h-11 text-white pl-10 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 mt-4 rounded-xl font-semibold transition-all group shadow-lg shadow-blue-900/20"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                            <>
                                Continue to Platform
                                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="flex justify-center pb-8">
                <p className="text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-medium hover:underline transition-all">
                        Signup for free
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,102,255,0.05),transparent_50%)]" />
            <Suspense fallback={
                <Card className="w-full max-w-md bg-[#121214] border-[#1e1e21] p-8 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </Card>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}

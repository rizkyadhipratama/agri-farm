"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import { useTranslation, TranslationProvider } from "@/lib/i18n/context";
import LanguageToggle from "@/components/language-toggle";

function RegisterPageContent() {
  const [step, setStep] = useState<"form" | "success">("form");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devLink, setDevLink] = useState("");
  const { t } = useTranslation();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      if (data.devVerifyUrl) {
        setDevLink(data.devVerifyUrl);
      }
      setStep("success");
    } catch {
      setError("Connection error. Please try again.");
    }

    setLoading(false);
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">{t("register.title")}</CardTitle>
              <CardDescription>{t("register.subtitle")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                {t("register.subtitle")}
              </p>
            </div>

            {devLink && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-amber-800 mb-2">Development Mode</p>
                <a
                  href={devLink}
                  className="text-sm text-blue-600 break-all hover:text-blue-800"
                >
                  Click here to verify (dev only)
                </a>
              </div>
            )}

            <Link href="/login">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                {t("register.signIn")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="text-2xl">{t("register.title")}</CardTitle>
              <LanguageToggle />
            </div>
            <CardDescription>{t("register.subtitle")}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">{t("register.name")}</Label>
              <Input id="name" name="name" placeholder={t("register.namePlaceholder")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("register.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("register.emailPlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("register.password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t("register.passwordPlaceholder")}
                minLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("register.registering")}</>
              ) : (
                t("register.register")
              )}
            </Button>

            <p className="text-center text-sm text-gray-500">
              {t("register.hasAccount")}{" "}
              <Link href="/login" className="text-green-600 font-medium hover:text-green-700">
                {t("register.signIn")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <TranslationProvider>
      <RegisterPageContent />
    </TranslationProvider>
  );
}

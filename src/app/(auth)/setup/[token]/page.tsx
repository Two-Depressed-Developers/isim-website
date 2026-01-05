"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { getErrorMessage } from "@/lib/axios";
import { SetupAccountForm } from "@/components/custom/auth/SetupAccountForm";
import { Loader2 } from "lucide-react";

type UserData = {
  id: number;
  email: string;
  username: string;
};

export default function SetupPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await axios.post("/api/auth/verify-setup-token", {
          token,
        });

        if (data.valid && data.user) {
          setUserData(data.user);
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error(getErrorMessage(error, "Błąd weryfikacji tokena"));
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      router.replace("/");
    }
  }, [token, router]);

  if (loading) {
    return (
      <div className="bg-muted flex grow flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-500">Weryfikacja tokena...</p>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="bg-muted flex grow flex-col items-center justify-center gap-y-4">
      <div className="flex w-full max-w-sm flex-col">
        <SetupAccountForm token={token} email={userData.email} />
      </div>
    </div>
  );
}

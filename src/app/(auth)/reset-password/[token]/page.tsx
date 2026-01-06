import ResetPasswordForm from "@/components/custom/auth/ResetPasswordForm";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;

  return (
    <div className="bg-muted flex grow flex-col items-center justify-center gap-y-4">
      <div className="flex w-full max-w-sm flex-col">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}

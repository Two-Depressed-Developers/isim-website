import ForgotPasswordForm from "@/components/custom/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-muted flex grow flex-col items-center justify-center gap-y-4">
      <div className="flex w-full max-w-sm flex-col">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex grow flex-col">{children}</main>;
}

import { TicketForm } from "@/components/custom/helpdesk/TicketForm";

export default function HelpdeskPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Zgłoszenia</h1>
        <p className="text-muted-foreground">
          Zgłoś problem z laboratorium lub sprzętem. Postaramy się rozwiązać go
          jak najszybciej.
        </p>
      </div>

      <div className="flex justify-center">
        <TicketForm />
      </div>
    </div>
  );
}

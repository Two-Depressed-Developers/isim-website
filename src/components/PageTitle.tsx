type Props = {
  label?: string;
  title: string;
  description?: string;
};

export default function PageTitle({ label, title, description }: Props) {
  return (
    <div className="mb-12">
      {label && (
        <p className="text-primary mb-2 text-sm font-semibold tracking-wider uppercase">
          {label}
        </p>
      )}
      <h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}

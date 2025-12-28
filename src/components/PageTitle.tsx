type PageTitleProps = {
  title: string;
  description?: string;
};

export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <>
      <div className="">
        <h1 className="text-4xl leading-12 font-semibold">{title}</h1>
        <div className="bg-primary h-1 w-26 rounded-full" />
      </div>
      {description && (
        <p className="text-muted-foreground mt-4 max-w-3xl text-lg">
          {description}
        </p>
      )}
    </>
  );
}

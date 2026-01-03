import { CollectionLayout } from "@/types";

type LayoutProps = {
  children: React.ReactNode;
};

function RowLayout({ children }: LayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">{children}</div>
  );
}

function GridLayout({ children }: LayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>
  );
}

function ListLayout({ children }: LayoutProps) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

export const LAYOUT_COMPONENTS: Record<
  CollectionLayout,
  React.FC<LayoutProps>
> = {
  row_3: RowLayout,
  grid_2x2: GridLayout,
  list: ListLayout,
};

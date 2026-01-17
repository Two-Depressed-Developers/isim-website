import CustomLink from "@/components/CustomLink";
import { FooterNavigationSection } from "@/types";

type Props = {
  navigation: FooterNavigationSection;
};

export default function FooterNavigation({ navigation }: Props) {
  return (
    <div className="flex h-full flex-col space-y-2 text-white/75">
      {navigation.title && (
        <p className="text-lg font-bold">{navigation.title}</p>
      )}
      <ul className="flex flex-col space-y-1 text-sm">
        {navigation.pages.map(({ page }) => (
          <li key={page.id}>
            <CustomLink
              href={`/${page.slug}`}
              isExternal={false}
              className="hover:text-primary items-baseline text-slate-400 no-underline transition-colors duration-200"
            >
              {page.name}
            </CustomLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

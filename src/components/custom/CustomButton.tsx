import CustomLink from "../CustomLink";
import { Button } from "../ui/button";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const CustomButton = (props : CustomButtonProps) => {

  return (
    <Button
    asChild
    className="flex items-center gap-2 bg-gradient-to-r from-[#383556] to-[#444160] text-white hover:opacity-90"
  >
    {/* <CustomLink
      href={member.USOSLink.URL}
      isExternal={member.USOSLink.isExternal}
    >
      <Earth className="h-2 w-2" />
      {member.USOSLink.text}
    </CustomLink> */}
  </Button>
  )
}

export default CustomButton;

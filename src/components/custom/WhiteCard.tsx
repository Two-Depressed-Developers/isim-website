
interface WhiteCardProps {
  className?: string;
  children: React.ReactNode;
}

const WhiteCard = ( props : WhiteCardProps ) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${props.className}`}>
      {props.children}
    </div>
  )
}

export default WhiteCard;
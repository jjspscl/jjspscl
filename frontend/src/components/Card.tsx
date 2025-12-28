interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<Props> = ({ children, className }) => {
  const classes: string[] =[
    'relative p-6 rounded-2xl border-4',
    'border-vhs-black dark:border-vhs-cream',
    'bg-vhs-cream dark:bg-vhs-black',
    'text-[#1a1a1a] dark:text-[#f5f5f5]',
    'shadow-[10px_10px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.3)]',
    className ?? '',
  ];

  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  );
};

export default Card;
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<Props> = ({ children, className }) => {
  const classes: string[] =[
    'relative p-6 rounded-2xl border-4',
    'border-vhs-black dark:border-vhs-cream',
    'bg-vhs-white dark:bg-white',
    'text-vhs-black dark:text-vhs-white',
    'shadow-[10px_10px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[10px_10px_0px_0px_rgba(255, 255, 255, 0.8)]',
    className ?? '',
  ];

  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  );
};

export default Card;
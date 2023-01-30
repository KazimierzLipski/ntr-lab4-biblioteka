const Button: React.FC<{
  children?: JSX.Element | string;
  text?: string;
  onClick?: () => void;
  color?: string;
  className?: string
}> = (props) => {
  return (
    <button
      className={`flex items-center justify-center rounded-md px-3 py-1 ${
        props.color ? props.color : "bg-orange-mid"
      } ${props.className}`}
      onClick={props.onClick}
    >
      <div className="">{props.children ? props.children : props.text}</div>
    </button>
  );
};

export default Button;

import { Link } from 'react-router-dom';

export default function AppButton({
  children,
  href,
  onClick,
  type = 'button',
  size = "md",
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = ""
}) {

  const base = "font-medium  transition-all flex items-center justify-center no-underline inline-flex border-none cursor-pointer tracking-wide";

  const variants = {
    primary:
      "bg-amber-600 text-white hover:bg-amber-700",
    secondary:
      "bg-emerald-500 text-white hover:bg-emerald-600",
    outline:
      "border border-emerald-600 text-emerald-600 hover:bg-emerald-50",
    ghost:
      "bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-200 transition-all",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };


  const sizes = {
    sm: "px-5 py-1.5 text-xs",
    md: "px-7 py-2 text-sm font-semibold",
    lg: "px-10 py-3 text-base font-semibold",
  };

  const state = disabled || isLoading
    ? "opacity-70 pointer-events-none cursor-wait"
    : "";

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${state} ${className}`;


  if (href) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={classes}
    >
      {isLoading ? "Aguarde..." : children}
    </button>
  );
}
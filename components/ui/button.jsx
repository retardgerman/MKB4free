// components/Button.js
export function Button({ children, className, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-md focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}


export function Button({ children, onClick, variant = 'default' }) {
  const base = "px-4 py-2 rounded text-white";
  const styles = {
    default: base + " bg-blue-600 hover:bg-blue-700",
    destructive: base + " bg-red-600 hover:bg-red-700",
  };
  return (
    <button onClick={onClick} className={styles[variant]}>
      {children}
    </button>
  );
}

export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex flex-col gap-4 items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      <p className="text-navy-400 font-medium animate-pulse text-sm">Loading...</p>
    </div>
  );
}

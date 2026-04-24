export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-pulse">
      <div className="h-8 bg-navy-100 rounded w-48 mb-8"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="flex flex-col gap-3">
            <div className="w-full aspect-[3/4] bg-navy-100 rounded-3xl"></div>
            <div className="h-4 bg-navy-100 rounded w-3/4"></div>
            <div className="h-4 bg-navy-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

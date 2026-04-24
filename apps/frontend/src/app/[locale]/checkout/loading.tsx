export default function CheckoutLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-navy-100 rounded w-64 mb-10 mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="h-32 bg-navy-100 rounded-2xl"></div>
          <div className="h-32 bg-navy-100 rounded-2xl"></div>
          <div className="h-32 bg-navy-100 rounded-2xl"></div>
        </div>
        <div className="h-96 bg-navy-100 rounded-2xl"></div>
      </div>
    </div>
  );
}

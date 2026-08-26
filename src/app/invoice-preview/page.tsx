export default function InvoicePreviewPage() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="bg-white p-4 shadow-sm border-b flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Invoice PDF Preview</h1>
          <p className="text-sm text-gray-500">Only for development purposes. Not accessible by customers.</p>
        </div>
      </div>
      
      <div className="flex-1 w-full p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-5xl h-full shadow-2xl rounded-lg overflow-hidden bg-white">
          <iframe 
            src="/api/invoice/preview-pdf" 
            width="100%" 
            height="100%" 
            className="border-none"
            title="Invoice Preview"
          />
        </div>
      </div>
    </div>
  );
}

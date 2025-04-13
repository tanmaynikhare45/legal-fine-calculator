import { LegalFineCalculator } from "@/components/legal-fine-calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto py-10 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
            Indian Legal Fine Calculator
          </h1>
          <div className="flex justify-center mt-2">
            <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full"></div>
          </div>
          <p className="text-center text-slate-600 mt-4 max-w-2xl mx-auto">
            Estimate potential legal penalties and fines based on Indian laws and regulations. Get accurate estimates
            for traffic violations and tax penalties.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <LegalFineCalculator />
        </div>
      </div>
    </main>
  )
}

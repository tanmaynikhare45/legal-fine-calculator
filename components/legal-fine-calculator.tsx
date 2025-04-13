"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { TrafficViolationCalculator } from "@/components/traffic-violation-calculator"
import { TaxPenaltyCalculator } from "@/components/tax-penalty-calculator"
import { Car, IndianRupee } from "lucide-react"

export function LegalFineCalculator() {
  const [activeTab, setActiveTab] = useState("traffic")

  return (
    <Tabs defaultValue="traffic" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 p-1 bg-gradient-to-r from-orange-100 to-blue-100 rounded-xl">
        <TabsTrigger
          value="traffic"
          className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md rounded-lg transition-all duration-200"
        >
          <Car className="mr-2 h-4 w-4" />
          Traffic Violations
        </TabsTrigger>
        <TabsTrigger
          value="tax"
          className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-lg transition-all duration-200"
        >
          <IndianRupee className="mr-2 h-4 w-4" />
          Tax Penalties
        </TabsTrigger>
      </TabsList>
      <TabsContent value="traffic" className="mt-6">
        <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
            <h2 className="text-xl font-bold">Traffic Violation Fine Estimator</h2>
            <p className="text-orange-100 text-sm mt-1">
              Calculate potential fines for common traffic violations based on your location and violation type.
            </p>
          </div>
          <CardContent className="p-6">
            <TrafficViolationCalculator />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tax" className="mt-6">
        <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
            <h2 className="text-xl font-bold">Income Tax Penalty Estimator</h2>
            <p className="text-blue-100 text-sm mt-1">
              Estimate potential penalties for late filing, underpayment, or other tax-related issues under Indian tax
              laws.
            </p>
          </div>
          <CardContent className="p-6">
            <TaxPenaltyCalculator />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, Calculator, IndianRupee } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"

// Indian Tax penalty rates
const PENALTY_RATES = {
  lateFile: {
    monthly: 0.01, // 1% per month (Section 234A)
    max: 0.12, // 12% maximum (for 12 months)
  },
  latePay: {
    monthly: 0.01, // 1% per month (Section 234B)
    max: 0.36, // 36% maximum (for 36 months)
  },
  underpayment: {
    rate: 0.01, // 1% per month (Section 234C)
  },
  inaccurateIncome: {
    rate: 0.5, // 50% of tax sought to be evaded (Section 270A)
  },
  tds: {
    rate: 0.01, // 1% per month on TDS amount
    max: 0.36, // 36% maximum
  },
}

export function TaxPenaltyCalculator() {
  const [penaltyType, setPenaltyType] = useState("")
  const [taxAmount, setTaxAmount] = useState("")
  const [months, setMonths] = useState("")
  const [calculatedPenalty, setCalculatedPenalty] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [filingStatus, setFilingStatus] = useState("individual")

  const calculatePenalty = () => {
    if (!penaltyType || !taxAmount) {
      return
    }

    const taxAmountNum = Number.parseFloat(taxAmount)
    if (isNaN(taxAmountNum)) {
      return
    }

    let penalty = 0
    const monthsNum = Number.parseInt(months) || 0

    // Calculate penalty based on type
    if (penaltyType === "lateFile") {
      // Late filing penalty: 1% per month up to 12%
      const rate = Math.min(PENALTY_RATES.lateFile.monthly * monthsNum, PENALTY_RATES.lateFile.max)
      penalty = taxAmountNum * rate
    } else if (penaltyType === "latePay") {
      // Late payment penalty: 1% per month up to 36%
      const rate = Math.min(PENALTY_RATES.latePay.monthly * monthsNum, PENALTY_RATES.latePay.max)
      penalty = taxAmountNum * rate
    } else if (penaltyType === "underpayment") {
      // Underpayment penalty: 1% per month
      penalty = taxAmountNum * PENALTY_RATES.underpayment.rate * monthsNum
    } else if (penaltyType === "inaccurateIncome") {
      // Inaccurate income reporting: 50% of tax sought to be evaded
      penalty = taxAmountNum * PENALTY_RATES.inaccurateIncome.rate
    } else if (penaltyType === "tds") {
      // TDS default: 1% per month up to 36%
      const rate = Math.min(PENALTY_RATES.tds.rate * monthsNum, PENALTY_RATES.tds.max)
      penalty = taxAmountNum * rate
    }

    // Apply filing status multiplier
    if (filingStatus === "business") {
      penalty *= 1.2 // 20% higher for businesses
    }

    setCalculatedPenalty(Math.round(penalty))
    setShowResults(true)
  }

  const resetForm = () => {
    setPenaltyType("")
    setTaxAmount("")
    setMonths("")
    setFilingStatus("individual")
    setCalculatedPenalty(null)
    setShowResults(false)
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription className="text-blue-700">
          This calculator provides estimates based on the Income Tax Act of India. Consult with a tax professional for
          accurate information.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium">Filing Status</Label>
          <RadioGroup value={filingStatus} onValueChange={setFilingStatus} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="individual"
                id="individual"
                className="text-blue-500 border-blue-300 focus:ring-blue-500"
              />
              <Label htmlFor="individual" className="font-normal text-slate-700">
                Individual
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="business"
                id="business"
                className="text-blue-500 border-blue-300 focus:ring-blue-500"
              />
              <Label htmlFor="business" className="font-normal text-slate-700">
                Business
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="penaltyType" className="text-slate-700 font-medium">
            Penalty Type
          </Label>
          <Select value={penaltyType} onValueChange={setPenaltyType}>
            <SelectTrigger id="penaltyType" className="border-blue-200 focus:ring-blue-500">
              <SelectValue placeholder="Select penalty type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lateFile">Late Filing (Section 234A)</SelectItem>
              <SelectItem value="latePay">Late Payment (Section 234B)</SelectItem>
              <SelectItem value="underpayment">Underpayment of Advance Tax (Section 234C)</SelectItem>
              <SelectItem value="inaccurateIncome">Inaccurate Income Reporting (Section 270A)</SelectItem>
              <SelectItem value="tds">TDS/TCS Default</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxAmount" className="text-slate-700 font-medium">
            {penaltyType === "inaccurateIncome"
              ? "Tax Sought to be Evaded (₹)"
              : penaltyType === "tds"
                ? "TDS/TCS Amount (₹)"
                : "Tax Amount Due (₹)"}
          </Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="taxAmount"
              type="number"
              placeholder="Enter amount"
              value={taxAmount}
              onChange={(e) => setTaxAmount(e.target.value)}
              className="pl-10 border-blue-200 focus:ring-blue-500"
            />
          </div>
        </div>

        {(penaltyType === "lateFile" ||
          penaltyType === "latePay" ||
          penaltyType === "underpayment" ||
          penaltyType === "tds") && (
          <div className="space-y-2">
            <Label htmlFor="months" className="text-slate-700 font-medium">
              Months Late
            </Label>
            <Input
              id="months"
              type="number"
              placeholder="Enter months"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="border-blue-200 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="flex space-x-2 pt-4">
          <Button
            onClick={calculatePenalty}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            Calculate Penalty
          </Button>
          <Button variant="outline" onClick={resetForm} className="border-blue-200 text-blue-600 hover:bg-blue-50">
            Reset
          </Button>
        </div>
      </div>

      {showResults && calculatedPenalty !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 p-6 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 shadow-md"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-800">Estimated Penalty</h3>
            <Calculator className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex items-center mt-2">
            <IndianRupee className="h-6 w-6 text-blue-600 mr-1" />
            <p className="text-4xl font-bold text-blue-600">{calculatedPenalty.toLocaleString()}</p>
          </div>
          <p className="text-sm text-blue-700 mt-4 bg-white bg-opacity-50 p-3 rounded-md">
            This is an estimate based on the Income Tax Act of India. Actual penalties may vary based on specific
            circumstances, Income Tax Department decisions, and potential additional interest charges. For accurate
            assessment, consult a tax professional.
          </p>
        </motion.div>
      )}
    </div>
  )
}

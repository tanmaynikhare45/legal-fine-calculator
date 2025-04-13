"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Car, IndianRupee } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"

// Sample data for Indian traffic violations (in Rupees)
const VIOLATIONS = {
  speeding: {
    "1-10": 1000,
    "11-20": 2000,
    "21+": 5000,
  },
  redLight: 5000,
  noHelmet: 1000,
  wrongSide: 5000,
  drunkDriving: {
    first: 10000,
    second: 15000,
    third: 30000,
  },
  noLicense: 5000,
  noInsurance: 2000,
  usingPhone: 5000,
  noSeatbelt: 1000,
  overloading: 2000,
  pollution: 10000,
}

// State multipliers for Indian states
const STATE_MULTIPLIERS = {
  DL: 1.2, // Delhi
  MH: 1.1, // Maharashtra
  KA: 1.0, // Karnataka
  TN: 0.9, // Tamil Nadu
  UP: 0.8, // Uttar Pradesh
  WB: 0.9, // West Bengal
  GJ: 1.0, // Gujarat
  RJ: 0.8, // Rajasthan
  HR: 1.0, // Haryana
  TS: 0.9, // Telangana
  AP: 0.9, // Andhra Pradesh
  KL: 1.0, // Kerala
  PB: 0.9, // Punjab
  BR: 0.8, // Bihar
  OR: 0.8, // Odisha
}

export function TrafficViolationCalculator() {
  const [state, setState] = useState("")
  const [violationType, setViolationType] = useState("")
  const [speedingAmount, setSpeedingAmount] = useState("")
  const [drunkDrivingOffense, setDrunkDrivingOffense] = useState("first")
  const [priorOffenses, setPriorOffenses] = useState(false)
  const [calculatedFine, setCalculatedFine] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)

  const calculateFine = () => {
    if (!state || !violationType) {
      return
    }

    let baseFine = 0

    // Calculate base fine based on violation type
    if (violationType === "speeding") {
      if (speedingAmount === "1-10") baseFine = VIOLATIONS.speeding["1-10"]
      else if (speedingAmount === "11-20") baseFine = VIOLATIONS.speeding["11-20"]
      else if (speedingAmount === "21+") baseFine = VIOLATIONS.speeding["21+"]
    } else if (violationType === "redLight") {
      baseFine = VIOLATIONS.redLight
    } else if (violationType === "noHelmet") {
      baseFine = VIOLATIONS.noHelmet
    } else if (violationType === "wrongSide") {
      baseFine = VIOLATIONS.wrongSide
    } else if (violationType === "drunkDriving") {
      if (drunkDrivingOffense === "first") baseFine = VIOLATIONS.drunkDriving.first
      else if (drunkDrivingOffense === "second") baseFine = VIOLATIONS.drunkDriving.second
      else if (drunkDrivingOffense === "third") baseFine = VIOLATIONS.drunkDriving.third
    } else if (violationType === "noLicense") {
      baseFine = VIOLATIONS.noLicense
    } else if (violationType === "noInsurance") {
      baseFine = VIOLATIONS.noInsurance
    } else if (violationType === "usingPhone") {
      baseFine = VIOLATIONS.usingPhone
    } else if (violationType === "noSeatbelt") {
      baseFine = VIOLATIONS.noSeatbelt
    } else if (violationType === "overloading") {
      baseFine = VIOLATIONS.overloading
    } else if (violationType === "pollution") {
      baseFine = VIOLATIONS.pollution
    }

    // Apply state multiplier
    let totalFine = baseFine * (STATE_MULTIPLIERS[state] || 1.0)

    // Apply prior offenses multiplier (50% increase for Indian regulations)
    if (priorOffenses) {
      totalFine *= 1.5
    }

    setCalculatedFine(Math.round(totalFine))
    setShowResults(true)
  }

  const resetForm = () => {
    setState("")
    setViolationType("")
    setSpeedingAmount("")
    setDrunkDrivingOffense("first")
    setPriorOffenses(false)
    setCalculatedFine(null)
    setShowResults(false)
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-orange-50 border-orange-200 text-orange-800">
        <AlertCircle className="h-4 w-4 text-orange-500" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription className="text-orange-700">
          This calculator provides estimates based on the Motor Vehicles Act and state regulations. Actual fines may
          vary based on local enforcement.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="state" className="text-slate-700 font-medium">
            State/UT
          </Label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger id="state" className="border-orange-200 focus:ring-orange-500">
              <SelectValue placeholder="Select state/UT" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DL">Delhi</SelectItem>
              <SelectItem value="MH">Maharashtra</SelectItem>
              <SelectItem value="KA">Karnataka</SelectItem>
              <SelectItem value="TN">Tamil Nadu</SelectItem>
              <SelectItem value="UP">Uttar Pradesh</SelectItem>
              <SelectItem value="WB">West Bengal</SelectItem>
              <SelectItem value="GJ">Gujarat</SelectItem>
              <SelectItem value="RJ">Rajasthan</SelectItem>
              <SelectItem value="HR">Haryana</SelectItem>
              <SelectItem value="TS">Telangana</SelectItem>
              <SelectItem value="AP">Andhra Pradesh</SelectItem>
              <SelectItem value="KL">Kerala</SelectItem>
              <SelectItem value="PB">Punjab</SelectItem>
              <SelectItem value="BR">Bihar</SelectItem>
              <SelectItem value="OR">Odisha</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="violation" className="text-slate-700 font-medium">
            Violation Type
          </Label>
          <Select value={violationType} onValueChange={setViolationType}>
            <SelectTrigger id="violation" className="border-orange-200 focus:ring-orange-500">
              <SelectValue placeholder="Select violation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="speeding">Speeding</SelectItem>
              <SelectItem value="redLight">Running Red Light/Signal</SelectItem>
              <SelectItem value="noHelmet">Riding Without Helmet</SelectItem>
              <SelectItem value="wrongSide">Driving on Wrong Side</SelectItem>
              <SelectItem value="drunkDriving">Drunk Driving</SelectItem>
              <SelectItem value="noLicense">Driving Without License</SelectItem>
              <SelectItem value="noInsurance">No Insurance</SelectItem>
              <SelectItem value="usingPhone">Using Mobile While Driving</SelectItem>
              <SelectItem value="noSeatbelt">Not Wearing Seatbelt</SelectItem>
              <SelectItem value="overloading">Vehicle Overloading</SelectItem>
              <SelectItem value="pollution">Pollution Norms Violation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {violationType === "speeding" && (
          <div className="space-y-2">
            <Label htmlFor="speedingAmount" className="text-slate-700 font-medium">
              KM/H Over Limit
            </Label>
            <Select value={speedingAmount} onValueChange={setSpeedingAmount}>
              <SelectTrigger id="speedingAmount" className="border-orange-200 focus:ring-orange-500">
                <SelectValue placeholder="Select amount over" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 km/h over</SelectItem>
                <SelectItem value="11-20">11-20 km/h over</SelectItem>
                <SelectItem value="21+">21+ km/h over</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {violationType === "drunkDriving" && (
          <div className="space-y-2">
            <Label htmlFor="drunkDrivingOffense" className="text-slate-700 font-medium">
              Offense Number
            </Label>
            <Select value={drunkDrivingOffense} onValueChange={setDrunkDrivingOffense}>
              <SelectTrigger id="drunkDrivingOffense" className="border-orange-200 focus:ring-orange-500">
                <SelectValue placeholder="Select offense number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">First Offense</SelectItem>
                <SelectItem value="second">Second Offense</SelectItem>
                <SelectItem value="third">Third Offense or More</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="priorOffenses"
            checked={priorOffenses}
            onCheckedChange={(checked) => setPriorOffenses(checked === true)}
            className="text-orange-500 border-orange-300 focus:ring-orange-500"
          />
          <Label htmlFor="priorOffenses" className="font-normal text-slate-700">
            Prior offenses in the last 12 months (50% higher penalty)
          </Label>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button
            onClick={calculateFine}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            Calculate Fine
          </Button>
          <Button
            variant="outline"
            onClick={resetForm}
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            Reset
          </Button>
        </div>
      </div>

      {showResults && calculatedFine !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 p-6 border border-orange-200 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 shadow-md"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-orange-800">Estimated Fine</h3>
            <Car className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex items-center mt-2">
            <IndianRupee className="h-6 w-6 text-orange-600 mr-1" />
            <p className="text-4xl font-bold text-orange-600">{calculatedFine.toLocaleString()}</p>
          </div>
          <p className="text-sm text-orange-700 mt-4 bg-white bg-opacity-50 p-3 rounded-md">
            This is an estimate based on the Motor Vehicles Act and state regulations. Actual fines may vary based on
            local enforcement, court decisions, and specific circumstances of the violation. In some cases, violations
            may also lead to imprisonment or license suspension.
          </p>
        </motion.div>
      )}
    </div>
  )
}

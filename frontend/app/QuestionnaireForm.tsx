import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router"

type WorkType = "interior" | "exterior" | "property_additions"

type InteriorWork =
  | "flooring"
  | "bathroom_remodel"
  | "new_bathroom"
  | "new_laundry_room"
  | "electrical_work"
  | "other"

type ExteriorWork =
  | "roof_modifications"
  | "garage_door_replacement"
  | "deck_construction"
  | "garage_modifications"
  | "exterior_doors"
  | "fencing"
  | "other"

type PropertyAddition = "adu" | "garage_conversion" | "basement_attic_conversion" | "other"

export function QuestionnaireForm() {
  const navigate = useNavigate()
  
  const [workTypes, setWorkTypes] = useState<WorkType[]>([])
  const [interiorWork, setInteriorWork] = useState<InteriorWork[]>([])
  const [exteriorWork, setExteriorWork] = useState<ExteriorWork[]>([])
  const [propertyAddition, setPropertyAddition] = useState<PropertyAddition | "">("")

  const canSubmit = useMemo(() => {
    if (workTypes.length === 0) return false
    if (workTypes.includes("interior") && interiorWork.length === 0) return false
    if (workTypes.includes("exterior") && exteriorWork.length === 0) return false
    if (workTypes.includes("property_additions") && !propertyAddition) return false
    return true
  }, [workTypes, interiorWork, exteriorWork, propertyAddition])

  const toggleWorkType = (value: WorkType, checked: boolean) => {
    if (checked) {
      setWorkTypes((prev) => (prev.includes(value) ? prev : [...prev, value]))
      return
    }
    setWorkTypes((prev) => prev.filter((v) => v !== value))
    if (value === "interior") setInteriorWork([])
    if (value === "exterior") setExteriorWork([])
    if (value === "property_additions") setPropertyAddition("")
  }

  const toggleInterior = (value: InteriorWork, checked: boolean) => {
    setInteriorWork((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)))
  }

  const toggleExterior = (value: ExteriorWork, checked: boolean) => {
    setExteriorWork((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)))
  }

  const onSubmit = () => {
    // Log the submission
    // eslint-disable-next-line no-console
    console.log({ workTypes, interiorWork, exteriorWork, propertyAddition })
    
    // Navigate back to projects page after submission
    navigate("/projects")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scope of Work Questionnaire</CardTitle>
        <CardDescription>Select your project scope to determine permit requirements.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base font-medium">What kind of work are you doing?</Label>
          <div className="space-y-2">
            {[
              { value: "interior" as const, label: "Interior work" },
              { value: "exterior" as const, label: "Exterior work" },
              { value: "property_additions" as const, label: "Property additions" }
            ].map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox
                  id={opt.value}
                  checked={workTypes.includes(opt.value)}
                  onCheckedChange={(c) => toggleWorkType(opt.value, Boolean(c))}
                />
                <Label htmlFor={opt.value}>{opt.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {workTypes.includes("interior") && (
          <div className="space-y-2">
            <Label className="text-base font-medium">What kind of interior work?</Label>
            <div className="space-y-2">
              {[
                { value: "flooring" as const, label: "Flooring" },
                { value: "bathroom_remodel" as const, label: "Bathroom remodel" },
                { value: "new_bathroom" as const, label: "New bathroom" },
                { value: "new_laundry_room" as const, label: "New laundry room" },
                { value: "electrical_work" as const, label: "Electrical work" },
                { value: "other" as const, label: "Other" }
              ].map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    id={opt.value}
                    checked={interiorWork.includes(opt.value)}
                    onCheckedChange={(c) => toggleInterior(opt.value, Boolean(c))}
                  />
                  <Label htmlFor={opt.value}>{opt.label}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {workTypes.includes("exterior") && (
          <div className="space-y-2">
            <Label className="text-base font-medium">What kind of exterior work?</Label>
            <div className="space-y-2">
              {[
                { value: "roof_modifications" as const, label: "Roof modifications/repair" },
                { value: "garage_door_replacement" as const, label: "Garage door replacement" },
                { value: "deck_construction" as const, label: "Deck construction" },
                { value: "garage_modifications" as const, label: "Garage modifications" },
                { value: "exterior_doors" as const, label: "Exterior doors" },
                { value: "fencing" as const, label: "Fencing" },
                { value: "other" as const, label: "Other" }
              ].map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    id={opt.value}
                    checked={exteriorWork.includes(opt.value)}
                    onCheckedChange={(c) => toggleExterior(opt.value, Boolean(c))}
                  />
                  <Label htmlFor={opt.value}>{opt.label}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {workTypes.includes("property_additions") && (
          <div className="space-y-2">
            <Label className="text-base font-medium">What kind of property addition?</Label>
            <RadioGroup value={propertyAddition} onValueChange={(v) => setPropertyAddition(v as PropertyAddition)}>
              {[
                { value: "adu" as const, label: "ADU (Accessory dwelling unit)" },
                { value: "garage_conversion" as const, label: "Garage conversion" },
                { value: "basement_attic_conversion" as const, label: "Basement/attic conversion" },
                { value: "other" as const, label: "Other" }
              ].map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} />
                  <Label>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <Button className="w-full" disabled={!canSubmit} onClick={onSubmit}>
          Submit questionnaire
        </Button>
      </CardContent>
    </Card>
  )
}



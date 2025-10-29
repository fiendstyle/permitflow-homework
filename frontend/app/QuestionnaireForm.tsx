import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { trpc } from "@/lib/trpc"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"

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

type PermitRequirement = "in_house_review" | "otc_review" | "no_permit"

interface QuestionnaireFormProps {
  projectId: string
}

export function QuestionnaireForm({ projectId }: QuestionnaireFormProps) {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([])
  const [interiorWork, setInteriorWork] = useState<InteriorWork[]>([])
  const [exteriorWork, setExteriorWork] = useState<ExteriorWork[]>([])
  const [propertyAddition, setPropertyAddition] = useState<PropertyAddition | "">("")
  const [requirements, setRequirements] = useState<PermitRequirement | null>(null)

  const { mutateAsync: submitQuestionnaire, isPending } = useMutation(trpc.questionnaire.submit.mutationOptions())
  
  // Load existing questionnaire when component mounts
  const { data: existingQuestionnaire } = useQuery(
    trpc.questionnaire.getByProject.queryOptions({ projectId })
  )

  // Populate form with existing questionnaire data when available
  useMemo(() => {
    if (existingQuestionnaire) {
      setWorkTypes(existingQuestionnaire.responses.workTypes)
      setInteriorWork(existingQuestionnaire.responses.interiorWork || [])
      setExteriorWork(existingQuestionnaire.responses.exteriorWork || [])
      setPropertyAddition(existingQuestionnaire.responses.propertyAddition || "")
      setRequirements(existingQuestionnaire.permitRequirement)
    }
  }, [existingQuestionnaire])

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

  const onSubmit = async () => {
    const responses = {
      workTypes,
      interiorWork: workTypes.includes("interior") ? interiorWork : undefined,
      exteriorWork: workTypes.includes("exterior") ? exteriorWork : undefined,
      propertyAddition: workTypes.includes("property_additions") ? propertyAddition : undefined
    }

    try {
      const result = await submitQuestionnaire({
        ...responses,
        projectId
      })
      setRequirements(result.permitRequirement)
    } catch (error) {
      console.error("Failed to submit questionnaire:", error)
    }
  }

  const getRequirementDisplay = (req: PermitRequirement | null) => {
    if (!req) return null
    
    if (req === "in_house_review") {
      return {
        title: "✅ In-House Review Process",
        description: [
          "A building permit is required.",
          "Include plan sets.",
          "Submit application for in-house review."
        ]
      }
    } else if (req === "otc_review") {
      return {
        title: "✅ Over-the-Counter Submission Process",
        description: [
          "A building permit is required.",
          "Submit application for OTC review."
        ]
      }
    } else {
      return {
        title: "❌ No Permit Required",
        description: [
          "Nothing is required! You're set to build."
        ]
      }
    }
  }

  const requirementDisplay = getRequirementDisplay(requirements)

  return (
    <div className="space-y-4">
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

        {!requirements && (
          <Button className="w-full" disabled={!canSubmit || isPending} onClick={onSubmit}>
            {isPending ? "Submitting..." : "Submit questionnaire"}
          </Button>
        )}
      </CardContent>
    </Card>

      {/* Results Card - shown after submission */}
      {requirements && requirementDisplay && (
        <Card>
          <CardHeader>
            <CardTitle>{requirementDisplay.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              {requirementDisplay.description.map((item, index) => (
                <li key={index} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}



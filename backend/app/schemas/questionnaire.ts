import { z } from "zod"

export const QUESTIONNAIRE_SCHEMA = z.object({
  workTypes: z.array(z.enum(["interior", "exterior", "property_additions"])).min(1),
  interiorWork: z.array(z.enum([
    "flooring", 
    "bathroom_remodel", 
    "new_bathroom", 
    "new_laundry_room", 
    "electrical_work", 
    "other"
  ])).optional(),
  exteriorWork: z.array(z.enum([
    "roof_modifications", 
    "garage_door_replacement", 
    "deck_construction", 
    "garage_modifications", 
    "exterior_doors", 
    "fencing", 
    "other"
  ])).optional(),
  propertyAddition: z.enum([
    "adu", 
    "garage_conversion", 
    "basement_attic_conversion", 
    "other"
  ]).optional()
})

export type QuestionnaireSchema = z.infer<typeof QUESTIONNAIRE_SCHEMA>

export type PermitRequirement = "in_house_review" | "otc_review" | "no_permit"

export interface QuestionnaireResponse {
  id: string
  responses: QuestionnaireSchema
  permitRequirement: PermitRequirement
  createdAt: string
}


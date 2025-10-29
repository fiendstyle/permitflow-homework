import { Store, type StoreItem } from "#core/Store.ts"
import { type QuestionnaireResponse, type PermitRequirement } from "#app/schemas/questionnaire.ts"

interface QuestionnaireItem extends StoreItem {
  projectId: string
  responses: any
  permitRequirement: PermitRequirement
}

export class QuestionnaireStore extends Store<QuestionnaireItem> {
  constructor() {
    super("questionnaires")
  }

  getByProjectId(projectId: string): QuestionnaireItem | undefined {
    const all = this.getAll()
    return all.find(q => q.projectId === projectId)
  }

  toModel(item: QuestionnaireItem): QuestionnaireResponse {
    return {
      id: item.id,
      projectId: item.projectId,
      responses: item.responses,
      permitRequirement: item.permitRequirement,
      createdAt: item.createdAt.toISOString()
    }
  }

  calculatePermitRequirement(responses: any): PermitRequirement {
    const { workTypes = [], interiorWork = [], exteriorWork = [], propertyAddition } = responses

    // Priority 1: In-House Review Required If Any Of:
    
    // - Any property addition work is selected (ADU, Garage conversion, etc.)
    if (propertyAddition) return "in_house_review"
    
    // - New bathroom is selected
    if (interiorWork.includes("new_bathroom")) return "in_house_review"
    
    // - New laundry room is selected
    if (interiorWork.includes("new_laundry_room")) return "in_house_review"
    
    // - If location is "San Francisco, CA" AND any structural work is selected (deck construction or garage modifications)
    // Note: Assuming location is always San Francisco for this assignment
    if (exteriorWork.includes("deck_construction")) return "in_house_review"
    if (exteriorWork.includes("garage_modifications")) return "in_house_review"
    
    // - Any "Other" option is selected in any category
    if (interiorWork.includes("other")) return "in_house_review"
    if (exteriorWork.includes("other")) return "in_house_review"
    if (propertyAddition === "other") return "in_house_review"

    // Priority 2: OTC Review required If Any Of:
    
    // - Bathroom remodel
    if (interiorWork.includes("bathroom_remodel")) return "otc_review"
    
    // - Electrical work
    if (interiorWork.includes("electrical_work")) return "otc_review"
    
    // - Roof modifications/repair
    if (exteriorWork.includes("roof_modifications")) return "otc_review"
    
    // - If BOTH garage door replacement AND exterior doors are selected together
    if (exteriorWork.includes("garage_door_replacement") && exteriorWork.includes("exterior_doors")) {
      return "otc_review"
    }

    // Priority 3: No Permit Required
    return "no_permit"
  }
}


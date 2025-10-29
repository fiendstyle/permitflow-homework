import { Store, type StoreItem } from "#core/Store.ts"
import { type QuestionnaireResponse } from "#app/schemas/questionnaire.ts"

interface QuestionnaireItem extends StoreItem {
  responses: any
}

export class QuestionnaireStore extends Store<QuestionnaireItem> {
  constructor() {
    super("questionnaires")
  }

  toModel(item: QuestionnaireItem): QuestionnaireResponse {
    return {
      id: item.id,
      responses: item.responses,
      createdAt: item.createdAt.toISOString()
    }
  }
}


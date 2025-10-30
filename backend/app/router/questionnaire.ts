import { QUESTIONNAIRE_SCHEMA } from "#app/schemas/questionnaire.ts"
import { procedure, router } from "#core/trpc.ts"
import { z } from "zod"

export const questionnaire = router({
  submit: procedure
    .input(QUESTIONNAIRE_SCHEMA.extend({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const permitRequirement = ctx.cradle.questionnaires.calculatePermitRequirement(input)
      
      // Check if questionnaire already exists for this project
      const existing = ctx.cradle.questionnaires.getByProjectId(input.projectId)
      
      let questionnaire
      if (existing) {
        // Update existing questionnaire
        questionnaire = ctx.cradle.questionnaires.updateByProjectId(input.projectId, {
          responses: input,
          permitRequirement
        })
      } else {
        // Create new questionnaire
        questionnaire = ctx.cradle.questionnaires.add({
          projectId: input.projectId,
          responses: input,
          permitRequirement
        })
      }
      
      return ctx.cradle.questionnaires.toModel(questionnaire)
    }),

  getByProject: procedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const questionnaire = ctx.cradle.questionnaires.getByProjectId(input.projectId)
      if (!questionnaire) return null
      return ctx.cradle.questionnaires.toModel(questionnaire)
    }),

  list: procedure.query(async ({ ctx }) => {
    const all = ctx.cradle.questionnaires.getAll()
    return all.map(q => ctx.cradle.questionnaires.toModel(q))
  })
})


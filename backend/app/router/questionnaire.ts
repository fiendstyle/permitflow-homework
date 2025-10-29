import { QUESTIONNAIRE_SCHEMA } from "#app/schemas/questionnaire.ts"
import { procedure, router } from "#core/trpc.ts"

export const questionnaire = router({
  submit: procedure
    .input(QUESTIONNAIRE_SCHEMA)
    .mutation(async ({ ctx, input }) => {
      const questionnaire = ctx.cradle.questionnaires.add({
        responses: input
      })
      return ctx.cradle.questionnaires.toModel(questionnaire)
    }),

  list: procedure.query(async ({ ctx }) => {
    const all = ctx.cradle.questionnaires.getAll()
    return all.map(q => ctx.cradle.questionnaires.toModel(q))
  })
})


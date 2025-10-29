import { appRouter } from "#app/router/index.ts"
import { container } from "#core/container.ts"
import { createContext } from "#core/trpc.ts"
import { trpcServer } from "@hono/trpc-server"
import { Hono } from "hono"
import { cors } from "hono/cors"

const app = new Hono()
  .use(cors())
  .get("/", (c) => c.text("OK"))
  .get("/questionnaires", (c) => {
    const questionnaires = container.cradle.questionnaires.getAll()
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Questionnaire Submissions</title>
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              max-width: 800px; 
              margin: 50px auto; 
              padding: 20px;
              background: #f5f5f5;
            }
            h1 { color: #333; }
            .questionnaire { 
              background: white; 
              padding: 20px; 
              margin: 20px 0; 
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .work-type { 
              background: #e3f2fd; 
              padding: 5px 10px; 
              border-radius: 4px; 
              display: inline-block;
              margin: 5px;
              font-size: 14px;
            }
            .timestamp { 
              color: #666; 
              font-size: 14px; 
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <h1>Questionnaire Submissions (${questionnaires.length})</h1>
          ${questionnaires.length === 0 
            ? '<p>No submissions yet.</p>' 
            : questionnaires.map(q => {
                const model = container.cradle.questionnaires.toModel(q)
                return `
                  <div class="questionnaire">
                    <div><strong>ID:</strong> ${model.id}</div>
                    <div class="work-type"><strong>Work Types:</strong> ${model.responses.workTypes.join(', ')}</div>
                    ${model.responses.interiorWork ? `<div class="work-type"><strong>Interior:</strong> ${model.responses.interiorWork.join(', ')}</div>` : ''}
                    ${model.responses.exteriorWork ? `<div class="work-type"><strong>Exterior:</strong> ${model.responses.exteriorWork.join(', ')}</div>` : ''}
                    ${model.responses.propertyAddition ? `<div class="work-type"><strong>Addition:</strong> ${model.responses.propertyAddition}</div>` : ''}
                    <div class="timestamp">Submitted: ${new Date(model.createdAt).toLocaleString()}</div>
                  </div>
                `
              }).join('')
          }
        </body>
      </html>
    `
    return c.html(html)
  })
  .use("/trpc/*", trpcServer({ router: appRouter, createContext }))

const port = import.meta.env.PORT ? parseInt(import.meta.env.PORT) : 3333
const host = import.meta.env.HOST || "0.0.0.0"

export default { fetch: app.fetch, port, hostname: host }

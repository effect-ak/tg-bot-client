import { Effect } from "effect"
import type { PropertySignatureStructure } from "ts-morph"
import type { TsSourceFile } from "#codegen/types"
import { TsMorpthWriter } from "#codegen/service/ts-morph-writer/_service"
import { ExtractedWebApp } from "#codegen/scrape/extracted-webapp/_model"

export class WebAppCodeWriterService extends Effect.Service<WebAppCodeWriterService>()(
  "WebAppCodeWriterService",
  {
    effect: Effect.gen(function* () {
      const { createTsFile } = yield* TsMorpthWriter
      const srcFile = yield* createTsFile("webapp", "webapp", "specification")

      return {
        writeWebApp: writeWebApp(srcFile)
      } as const
    })
  }
) {}

const writeWebApp =
  (src: TsSourceFile) => (extractedWebApp: ExtractedWebApp) => {
    const eventHandlerNamespaceAlias = "T"

    src.addStatements("// GENERATED CODE ")

    src.addImportDeclaration({
      moduleSpecifier: "../event-handlers",
      namespaceImport: eventHandlerNamespaceAlias,
      isTypeOnly: true
    })

    src
      .addInterface({
        name: "WebApp",
        isExported: true,
        properties: extractedWebApp.fields.map((field) => ({
          name: field.name,
          type: field.type.getTsType()
        }))
      })
      .formatText()

    extractedWebApp.types.filter((type) => {
      if (type.type._tag == "EntityFields") {
        src
          .addInterface({
            name: type.typeName,
            isExported: true,
            ...(type.type == null
              ? undefined
              : {
                  properties: type.type.fields.map(
                    (field) =>
                      ({
                        name: field.name,
                        type: field.type.getTsType(),
                        hasQuestionToken: !field.required
                      }) as PropertySignatureStructure
                  )
                })
          })
          .formatText()
      } else {
        src
          .addTypeAlias({
            name: type.typeName,
            isExported: true,
            type: type.type.getTsType()
          })
          .formatText()
      }
    })
  }

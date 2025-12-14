import type { PropertySignatureStructure } from "ts-morph"
import type { TsSourceFile } from "~/types"
import type { ExtractedTypeShape } from "~/scrape/extracted-type/_model"

export const writeTypes =
  (src: TsSourceFile) => (types: ExtractedTypeShape[]) => {
    src.addStatements("// GENERATED CODE ")

    src.addTypeAlias({
      name: "AllowedUpdateName",
      type: `Exclude<keyof Update, "update_id">`,
      isExported: true
    })

    for (const type of types) {
      if (type.type._tag == "EntityFields") {
        src.addInterface({
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
      } else {
        src.addTypeAlias({
          name: type.typeName,
          isExported: true,
          type: type.type.getTsType()
        })
      }
    }
  }

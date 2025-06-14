import { String } from "effect";

import type { MethodSignatureStructure, PropertySignatureStructure } from "ts-morph";
import type { TsSourceFile } from "#codegen/types.js";
import type { ExtractedMethodShape } from "#scrape/extracted-method/_model.js";

export const writeMethods =
  (src: TsSourceFile) =>
    (methods: ExtractedMethodShape[]) => {

      src.addStatements("// GENERATED CODE ");

      const makeMethodInterfaceInputName =
        (_: string) => `${String.snakeToPascal(_)}Input`;

      const typeNamespace = "T";

      src.addImportDeclaration({
        moduleSpecifier: "./types.js",
        namespaceImport: typeNamespace
      });

      src.addInterface({
        name: "Api",
        isExported: true,
        methods:
          methods.map(method => ({
            name: String.camelToSnake(method.methodName),
            returnType: method.returnType.getTsType(typeNamespace),
            parameters: [
              {
                name: "_",
                type: makeMethodInterfaceInputName(method.methodName)
              }
            ]
          } as MethodSignatureStructure))
      }).formatText();

      for (const method of methods) {

        const interfaceName = makeMethodInterfaceInputName(method.methodName)

        src.addInterface({
          name: interfaceName,
          isExported: true,
          ...(method.parameters == null ? undefined : {
            properties:
              method.parameters.fields.map(field => ({
                name: field.name,
                type: field.type.getTsType(typeNamespace),
                hasQuestionToken: !field.required,
              } as PropertySignatureStructure))
          })

        }).formatText();

      }
    }
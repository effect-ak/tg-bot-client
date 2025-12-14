import { Config, Effect, Logger, LogLevel } from "effect"

import { ExtractedEntities } from "./scrape/extracted-entities/_model"
import {
  BotApiCodeWriterService,
  PageProviderService,
  WebAppCodeWriterService
} from "./service/index"
import { OpenapiWriterService } from "./service/openapi-writer/_service"
import { BotApiCodegenRuntime, WebAppCodegenRuntime } from "./runtime"
import { TsMorpthWriter } from "./service/ts-morph-writer/_service"
import { ExtractedWebApp } from "./scrape/extracted-webapp/_model"

const generateBotApi = Effect.fn("generate bot api")(function* () {
  const pageProvider = yield* PageProviderService
  const apiPage = yield* pageProvider.api

  const apiVersion = yield* apiPage.getLatestVersion()

  const tsMorph = yield* TsMorpthWriter
  const codeWriter = yield* BotApiCodeWriterService
  const openapiWriter = yield* OpenapiWriterService
  const entities = yield* ExtractedEntities.make(apiPage)

  codeWriter.writeTypes(entities.types)
  codeWriter.writeMethods(entities.methods)

  yield* openapiWriter.writeSpecification({
    ...entities,
    apiVersion
  })

  yield* tsMorph.saveFiles
})

const generateWebApp = Effect.fn("generate web app")(function* () {
  const pageProvider = yield* PageProviderService
  const webappPage = yield* pageProvider.webapp

  const tsMorph = yield* TsMorpthWriter
  const { writeWebApp } = yield* WebAppCodeWriterService

  const extractedWebApp = yield* ExtractedWebApp.make(webappPage)

  writeWebApp(extractedWebApp)

  yield* tsMorph.saveFiles
})

const gen = Effect.fn("Generate")(function* () {
  const module = yield* Config.literal("bot_api", "webapp")("MODULE_NAME")
  if (module == "bot_api") {
    yield* generateBotApi().pipe(Effect.provide(BotApiCodegenRuntime))
  } else {
    yield* generateWebApp().pipe(Effect.provide(WebAppCodegenRuntime))
  }
})

gen()
  .pipe(Logger.withMinimumLogLevel(LogLevel.Debug), Effect.runPromise)
  .then(() => console.log("done generating"))

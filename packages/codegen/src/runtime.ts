import { ConfigProvider, Layer, Logger, ManagedRuntime } from "effect"
import {
  BotApiCodeWriterService,
  PageProviderService,
  WebAppCodeWriterService
} from "./service"
import { OpenapiWriterService } from "./service/openapi-writer/_service"
import { TsMorpthWriter } from "./service/ts-morph-writer/_service"

const configProvider = ConfigProvider.fromJson({
  "scrapper-out-dir": ["..", "api"],
  "openapi-out-dir": ["..", "..", "openapi"]
})

export const BotApiCodegenRuntime = ManagedRuntime.make(
  Layer.mergeAll(
    PageProviderService.Default,
    BotApiCodeWriterService.Default,
    OpenapiWriterService.Default
  ).pipe(
    Layer.provideMerge(TsMorpthWriter.Default),
    Layer.provide(Layer.setConfigProvider(configProvider)),
    Layer.provide(Logger.pretty)
  )
)

export const WebAppCodegenRuntime = ManagedRuntime.make(
  Layer.mergeAll(
    PageProviderService.Default,
    WebAppCodeWriterService.Default
  ).pipe(
    Layer.provideMerge(TsMorpthWriter.Default),
    Layer.provide(Layer.setConfigProvider(configProvider)),
    Layer.provide(Logger.pretty)
  )
)

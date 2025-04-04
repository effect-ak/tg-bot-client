gen:
	make gen-bot-api
	make gen-webapp

gen-bot-api:
	MODULE_NAME=bot_api tsx ./codegen/main

gen-webapp:
	MODULE_NAME=webapp tsx ./codegen/main

run-echo-bot:
	tsx ./example/echo-bot.ts

run-effect-bot:
	tsx ./example/effect-bot.ts

run-reload-bot:
	tsx ./example/reload-bot.ts

run-batch-bot:
	tsx ./example/batch-bot.ts

publish:
	tsup
	pnpm publish
gen:
	tsx ./codegen/main

run-echo-bot:
	tsx ./example/echo-bot.ts

run-effect-bot:
	tsx ./example/effect-bot.ts

run-reload-bot:
	tsx ./example/reload-bot.ts

publish:
	tsup
	pnpm publish
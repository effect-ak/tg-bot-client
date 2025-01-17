gen:
	tsx ./codegen/main

run-echo-bot:
	tsx ./example/echo-bot.ts

run-effect-bot:
	tsx ./example/effect-bot.ts

publish:
	tsup
	pnpm publish
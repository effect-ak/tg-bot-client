gen:
	tsx ./codegen/main

run-echo-bot:
	tsx ./example/echo-bot.ts

publish:
	tsup
	pnpm publish
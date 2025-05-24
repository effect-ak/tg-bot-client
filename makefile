gen:
	make gen-bot-api
	make gen-webapp

gen-bot-api:
	MODULE_NAME=bot_api tsx ./codegen/main

gen-webapp:
	MODULE_NAME=webapp tsx ./codegen/main

serve:
	http-server . --cors

publish:
	tsx ./build.mts
	pnpm publish

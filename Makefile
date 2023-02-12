.DEFAULT_GOAL := check

init:
	@echo "Initialising the project"
	@npm ci

clean_all:
	@echo "🧨 Clean all"
	@rm -Rf node_modules package-lock.json

check:
	@echo "✅"

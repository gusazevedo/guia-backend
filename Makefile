.PHONY: build-GuiaFunction

build-GuiaFunction:
	cp package.json package-lock.json $(ARTIFACTS_DIR)/
	cp -r prisma $(ARTIFACTS_DIR)/
	cd $(ARTIFACTS_DIR) && npm ci
	cd $(ARTIFACTS_DIR) && ./node_modules/.bin/prisma generate
	cd $(ARTIFACTS_DIR) && npm prune --production
	cp -r dist $(ARTIFACTS_DIR)/
	find $(ARTIFACTS_DIR)/node_modules -name "libquery_engine-*" ! -name "*rhel-openssl-3.0.x*" -delete 2>/dev/null || true
	find $(ARTIFACTS_DIR)/node_modules -name "query-engine-*" ! -name "*rhel-openssl-3.0.x*" -delete 2>/dev/null || true
	rm -rf $(ARTIFACTS_DIR)/node_modules/prisma
	rm -rf $(ARTIFACTS_DIR)/node_modules/typescript
	rm -f $(ARTIFACTS_DIR)/node_modules/.bin/prisma $(ARTIFACTS_DIR)/node_modules/.bin/tsc $(ARTIFACTS_DIR)/node_modules/.bin/tsserver

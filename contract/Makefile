compile:
	./neo-go contract compile -i ./entrypoint/main.go -c ./entrypoint/main.yml -m ./entrypoint/contract.manifest.json --debug contract.debug.json
	./neo-go contract compile -i ./limit/main.go -c ./limit/neo-go.yml -m ./limit/contract.manifest.json --debug contract.debug.json --bindings limit.abi.json
	./neo-go contract compile -i ./swap/main.go -c ./swap/neo-go.yml -m ./swap/contract.manifest.json --debug contract.debug.json --bindings limit.abi.json

compile-swap:
	./neo-go contract compile -i ./swap/main.go -c ./swap/neo-go.yml -m ./swap/contract.manifest.json --debug contract.debug.json --bindings limit.abi.json

deploy-limit:
	./neo-go contract deploy -i ./limit/main.nef -m ./limit/contract.manifest.json -r https://testnet2.neo.coz.io:443 -w ./wallets/testing.neo-wallet.json -g 0.1

deploy-swap:
	./neo-go contract deploy -i ./swap/main.nef -m ./swap/contract.manifest.json -r https://testnet2.neo.coz.io:443 -w ./wallets/someother.json

generate:
	neo-go contract generate-rpcwrapper -i ./limit/main.nef -m ./limit/contract.manifest.json --out somename.go


deploy-entrypoint:
	./neo-go contract deploy -i ./entrypoint/main.nef -m ./entrypoint/contract.manifest.json -r https://testnet2.neo.coz.io:443 -w ./wallets/test4.json

compile-token:
	./neo-go contract compile -i ./token/token.go -c ./token/token.yml -m ./token/contract.manifest.json --debug contract.debug.json

deploy-token:
	./neo-go contract deploy -i ./token/token.nef -m ./token/contract.manifest.json -r https://testnet2.neo.coz.io:443 -w ./wallets/testing.neo-wallet.json

testing:
	neo-go contract generate-rpcwrapper --manifest ./limit/contract.manifest.json --out ./rpcwrapper.go --hash 0xb3f108a7516e36d8c2f1b657e82f6643c5f40760
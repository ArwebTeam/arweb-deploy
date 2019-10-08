# arweb-deploy

Arweb deploy is a tool to help you with deploying your arweb project

# Usage

```
$ arweb-deploy
  --key-file <keyfile>
    deploy-assets <path> <appid>
    create-object <object-definition-path> <object-path> [<key=value>]

$ arweb-deploy --key-file ./arweave_keyfile.json ./dist my-app
$ arweb-deploy --key-file ./arweave_keyfile.json node:./arbase-definition.js board title=Test "desc=A board for testing arbase"
```

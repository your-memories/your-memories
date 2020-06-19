# YourMemories

YourMemories is your personal view into your memories. Its core functionality is to generate a nice web view of your entire photo collection. Keep your photos on your own server and use YourMemories to access them from anywhere.

## Docker and docker-compose

You can run it inside docker. Just call `docker-compose up` in the root directory of this reposiory.
The default configuration will bind-mount the local `photos` and `html` folder inside the container.
The content in `photos` will be watched and the output is generated to `html` and is served on
https://localhost:8080. Modify these paths in `docker-compose.yaml` in case you want it somewhere else.

The _node:slim_ image is used for running the app, alpine is not possible due to the lack of tooling.

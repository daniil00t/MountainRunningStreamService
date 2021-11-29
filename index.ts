import server from "./streamText"
import * as Configs from "./config.json"


server.listen(Configs.streamText.port, () => console.log("✨ StreamText server is running!"))
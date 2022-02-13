// eslint-disable-next-line @typescript-eslint/no-var-requires
const functions = require("firebase-functions");

let cmsServer;
exports.cms = functions.region("us-central1").https.onRequest(async (request, response) => {
    if (!cmsServer) {
        functions.logger.info("Initialising SvelteKit SSR entry");
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        cmsServer = require("./cms/index").default;
        functions.logger.info("SvelteKit SSR entry initialised!");
    }
    functions.logger.info("Requested resource: " + request.originalUrl);
    return cmsServer(request, response);
});

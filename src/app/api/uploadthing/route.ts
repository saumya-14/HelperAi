import { ourFileRouter } from "@/lib/uploadthing";
import { createRouteHandler } from "uploadthing/server";

const handler = createRouteHandler({ router: ourFileRouter });
export { handler as GET, handler as POST };

import { ourFileRouter } from "@/lib/uploadthing";
import { createRouteHandler } from "uploadthing/server";
import { type NextRequest } from "next/server";

// Create the uploadthing route handler
const uploadthingHandler = createRouteHandler({ router: ourFileRouter });

// Custom wrapper to satisfy Next.js's App Router type system
const handler = (req: NextRequest) => {
  return uploadthingHandler(req as Request); // force type compatibility
};

export { handler as GET, handler as POST };

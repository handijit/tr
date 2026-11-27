import { library } from "@handijitcom/config/vitest";

// Nothing here touches window or document: every test runs in node, at 100 % coverage.
export default library();

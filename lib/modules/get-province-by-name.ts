import assertString from "../helpers/assert-string.helper";
import type { Province } from "../types";
import foldText from "./fold-text";
import PROVINCES from "./provinces";

// Built on the first lookup and never grown: 81 entries. Building it at import time would
// run code in every bundle that merely imports the package.
let provincesByFoldedName: Map<string, Province> | undefined;

/**
 * Finds a province by name without regard to case or Turkish letters ("istanbul", "ISTANBUL"
 * and "İstanbul" all match), or returns `null`.
 */
const getProvinceByName = (name: string): Province | null => {
  assertString(name, "getProvinceByName");

  provincesByFoldedName ??= new Map(
    PROVINCES.map((province) => [foldText(province.name), province])
  );
  return provincesByFoldedName.get(foldText(name.trim())) ?? null;
};

export default getProvinceByName;

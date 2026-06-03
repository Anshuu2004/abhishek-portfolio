import type { ComponentType } from "react";

import { SimptionERPArch } from "./SimptionERPArch";
import { CodeHealArch } from "./CodeHealArch";
import { DriveAwareArch } from "./DriveAwareArch";
import { AIQPGenArch } from "./AIQPGenArch";
import { BrosplitArch } from "./BrosplitArch";

export const ARCH_DIAGRAMS: Record<string, ComponentType> = {
  "simption-erp": SimptionERPArch,
  codeheal: CodeHealArch,
  driveaware: DriveAwareArch,
  "ai-question-paper-generator": AIQPGenArch,
  brosplit: BrosplitArch,
};

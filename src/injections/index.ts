import Modules from "../lib/requiredModules";
import injectMessageAccessories from "./MessageAccessories";
export const applyInjections = async (): Promise<void> => {
  await Modules.loadModules();
  injectMessageAccessories();
};

export default { applyInjections };

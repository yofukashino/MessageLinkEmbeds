import patchMessageAccessories from "./MessageAccessories";
export const applyInjections = (): void => {
  patchMessageAccessories();
};

export default { applyInjections };

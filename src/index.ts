import { Injector, Logger, settings } from "replugged";
import { defaultSettings } from "./lib/consts";
export const PluginInjector = new Injector();
export const { utils: PluginInjectorUtils } = PluginInjector;
export const PluginLogger = Logger.plugin("MessageLinkEmbeds", "#b380ff");
export const SettingValues = await settings.init(
  "dev.yofukashino.MessageLinkEmbeds",
  defaultSettings,
);
import Injections from "./injections/index";
import Settings from "./Components/Settings";

export const start = (): void => {
  Settings.registerSettings();
  Injections.applyInjections().catch((err) => PluginLogger.error(err));
};

export const stop = (): void => {
  PluginInjector.uninjectAll();
};

export { Settings } from "./Components/Settings.jsx";

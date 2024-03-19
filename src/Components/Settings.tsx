import { SelectItem, SwitchItem } from "replugged/components";
import { PluginLogger, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import Utils from "../lib/utils";
import Types from "../types";
export const registerSettings = (): void => {
  for (const key in defaultSettings) {
    if (SettingValues.has(key as keyof Types.Settings)) return;
    PluginLogger.log(`Adding new setting ${key} with value`, defaultSettings[key]);
    SettingValues.set(key as keyof Types.Settings, defaultSettings[key]);
  }
};
export const Settings = (): React.ReactElement => {
  return (
    <div>
      <SwitchItem
        {...Utils.useSetting(SettingValues, "background", defaultSettings.background)}
        key={SettingValues.get("automodEmbed")}
        disabled={SettingValues.get("automodEmbed") === "always"}
        note="Background color for messages in rich embeds">
        Message Background
      </SwitchItem>
      <SelectItem
        options={[
          {
            label: "Rich Embeds",
            value: "never",
          },
          {
            label: "Automod Embeds",
            value: "always",
          },
          {
            label: "Automod Embeds if Rich Embeds isn't required",
            value: "prefer",
          },
        ]}
        {...Utils.useSetting(SettingValues, "automodEmbed", defaultSettings.automodEmbed)}>
        Embed Type
      </SelectItem>
    </div>
  );
};

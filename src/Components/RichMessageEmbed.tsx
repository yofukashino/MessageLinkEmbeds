import { parser as Parser, React, users as UltimateUserStore } from "replugged/common";
import { Text } from "replugged/components";
import { SettingValues } from "../index";
import Modules from "../lib/requiredModules";
import Utils from "../lib/utils";
import Types from "../types";
import { defaultSettings } from "../lib/consts";

export default React.memo(
  ({ channel, message }: { channel: Types.Channel; message: Types.Message }) => {
    const recipient = UltimateUserStore.getUser(channel.recipients?.[0]);

    const [icon, type] = Utils.getChannelIconAndType({ channel });

    return (
      <Modules.RichEmbed
        embed={{
          rawDescription: "",
          color: "var(--background-secondary)",
          author: {
            name: (
              <Text.Eyebrow>
                <span>{type} - </span>
                {Parser.parse(channel.isDM() ? `<@${recipient.id}>` : `<#${channel.id}>`)}
              </Text.Eyebrow>
            ),
            iconProxyURL: icon,
          },
        }}
        renderDescription={() => (
          <div
            key={message.id}
            className={`${Modules.MessageClasses.message}${SettingValues.get("background", defaultSettings.background) ? ` ${Modules.MessageClasses.searchResult}` : ""}`}>
            <Modules.ChannelMessage
              id={`message-link-embeds-${message.id}`}
              message={message}
              channel={channel}
              subscribeToComponentDispatch={false}
            />
          </div>
        )}
      />
    );
  },
);

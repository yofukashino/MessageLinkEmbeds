import { parser as Parser, React, users as UltimateUserStore } from "replugged/common";
import { Text } from "replugged/components";
import { AutomodEmbed, ChatSettingUtils, MessageClasses } from "../lib/requiredModules";
import Utils from "../lib/utils";
import Types from "../types";
export default React.memo(
  ({ channel, message }: { channel: Types.Channel; message: Types.Message }) => {
    const recipient = UltimateUserStore.getUser(channel.recipients?.[0]);
    const images = Utils.getMessageImages(message);
    const [icon, type] = Utils.getChannelIconAndType({ channel });
    const compat = ChatSettingUtils.MessageDisplayCompact.useSetting() as boolean;
    return (
      <AutomodEmbed
        channel={channel}
        childrenAccessories={
          <Text.Eyebrow className={`${MessageClasses.embedAuthor} ${MessageClasses.embedMargin}`}>
            {icon && <img src={icon} className={MessageClasses.embedAuthorIcon} alt="" />}
            <span>
              <span>{type} - </span>
              {channel.isDM()
                ? Parser.parse(`<@${recipient.id}>`)
                : Parser.parse(`<#${channel.id}>`)}
            </span>
          </Text.Eyebrow>
        }
        compact={compat}
        content={
          <>
            {message.content || message.attachments.length <= images.length
              ? Parser.parse(message.content)
              : [
                  Utils.formatEmptyContent({
                    attachments: message.attachments.length,
                    embeds: message.embeds.length,
                  }),
                ]}
            {images.map((img) => {
              const { width, height } = Utils.resizeToFit({ width: img.width, height: img.height });
              return (
                <div>
                  <img src={img.url} width={width} height={height} />
                </div>
              );
            })}
          </>
        }
        hideTimestamp={false}
        message={message}
        _messageEmbed="automod"
      />
    );
  },
);

import {
  React,
  channels as UltimateChannelStore,
  messages as UltimateMessageStore,
} from "replugged/common";
import { MessageLinkRegex, defaultSettings } from "../lib/consts";
import { DiscordConstants, PermissionStore } from "../lib/requiredModules";
import Types from "../types";
import RichMessageEmbed from "./RichMessageEmbed";
import AutomodMessageEmbed from "./AutomodMessageEmbed";
import Utils from "../lib/utils";
import { SettingValues } from "..";
import { ErrorBoundary } from "replugged/components";
const isFetching = new Set<string>();
export default React.memo(({ message }: { message: Types.Message }) => {
  const [messages, setMessages] = React.useState<
    Array<{ message: Types.Message; channel: Types.Channel }>
  >([]);
  const messageIds = Array.from(message.content?.matchAll(RegExp(MessageLinkRegex, "g"))).map(
    ([, channelId, messageId]) => ({ channelId, messageId }),
  );
  React.useEffect(() => {
    const parentMessage = message;
    const getAndSetMessages = async (): Promise<void> => {
      const messagePromises = messageIds.map<
        Promise<{ message: Types.Message; channel: Types.Channel } | null>
      >(async ({ channelId, messageId }) => {
        const channel = UltimateChannelStore.getChannel(channelId);
        if (
          messageId === parentMessage.id ||
          !channel ||
          (!channel.isPrivate() &&
            !PermissionStore.can(DiscordConstants.Permissions.VIEW_CHANNEL, channel))
        ) {
          return null;
        }
        const message = UltimateMessageStore.getMessage(channelId, messageId);
        if (
          message &&
          Array.from(message.content?.matchAll(RegExp(MessageLinkRegex, "g"))).some(
            ([, , messageId]) => messageId === parentMessage.id,
          )
        )
          return null;
        if (message) return { message, channel };
        if (isFetching.has(`${channelId}-${messageId}`)) {
          while (isFetching.has(`${channelId}-${messageId}`)) {
            await Utils.sleep(100);
          }
          const message =
            UltimateMessageStore.getMessage(channelId, messageId) ??
            Utils.messageCache.get(`${channelId}-${messageId}`);
          if (
            message &&
            Array.from(message.content?.matchAll(RegExp(MessageLinkRegex, "g"))).some(
              ([, , messageId]) => messageId === parentMessage.id,
            )
          )
            return null;
          return { message, channel };
        }
        isFetching.add(`${channelId}-${messageId}`);
        await Utils.fetchMessage({
          channelId,
          messageId,
        });
        isFetching.delete(`${channelId}-${messageId}`);
        {
          const message =
            UltimateMessageStore.getMessage(channelId, messageId) ??
            Utils.messageCache.get(`${channelId}-${messageId}`);
          if (
            message &&
            Array.from(message.content?.matchAll(RegExp(MessageLinkRegex, "g"))).some(
              ([, , messageId]) => messageId === parentMessage.id,
            )
          )
            return null;
          return { message, channel };
        }
      });
      const messages = await Promise.all(messagePromises);
      setMessages(messages.filter(Boolean).filter((m) => m.message && m.channel));
    };
    getAndSetMessages();
  }, [JSON.stringify(messageIds)]);
  return (
    <ErrorBoundary>
      <span key={messages.map((m) => m.message.id).join("-")}>
        {messages.map((props) =>
          SettingValues.get("automodEmbed", defaultSettings.automodEmbed) === "always" ||
          (SettingValues.get("automodEmbed", defaultSettings.automodEmbed) === "prefer" &&
            !Utils.needsRichEmbed(props.message)) ? (
            <AutomodMessageEmbed {...props} />
          ) : (
            <RichMessageEmbed {...props} />
          ),
        )}
      </span>
    </ErrorBoundary>
  );
});

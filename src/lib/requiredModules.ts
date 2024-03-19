import { webpack } from "replugged";
import Types from "../types";

export const { MessageAccessories } =
  webpack.getByProps<Types.MessageAccessories>("MessageAccessories");

export const DiscordConstants = webpack.getByProps<Types.DiscordConstants>(
  "Permissions",
  "ChannelTypes",
);
export const PermissionStore = webpack.getByStoreName<Types.PermissionStore>("PermissionStore");

export const { default: RichEmbed } = webpack.getBySource<Types.Embeds>(
  "this.renderEmbedContent()",
);

export const AutomodEmbed = webpack.getBySource<Types.AutomodEmbed>(
  /\.messageContainer,{\[\w+.compact/,
);

export const ChannelMessage = webpack.getBySource<Types.ChannelMessage>(".hideAccessories?void 0");

export const IconUtils = webpack.getByProps<Types.IconUtils>("getUserAvatarURL");

export const ChatSettingUtils = webpack.getByProps<Types.ChatSettingUtils>("MessageDisplayCompact");

export const MessageClasses = {
  ...webpack.getByProps<Types.SearchMessageClasses>("message", "searchResult"),
  ...webpack.getByProps<Types.EmbedClasses>("embedAuthorIcon", "embedAuthor", "embedAuthor"),
};

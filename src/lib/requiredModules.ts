import { webpack } from "replugged";
import Types from "../types";

export const Modules: Types.Modules = {};

Modules.loadModules = async (): Promise<void> => {
  Modules.MessageAccessories ??= await webpack
    .waitForProps<Types.MessageAccessories>("MessageAccessories")
    .then(({ MessageAccessories }) => MessageAccessories);

  Modules.DiscordConstants ??= await webpack.waitForProps<Types.DiscordConstants>(
    "Permissions",
    "ChannelTypes",
  );

  Modules.RichEmbed ??= await webpack
    .waitForModule<Types.Embeds>(webpack.filters.bySource("this.renderEmbedContent()"))
    .then(({ default: RichEmbed }) => RichEmbed);

  Modules.AutomodEmbed ??= await webpack.waitForModule<Types.AutomodEmbed>(
    webpack.filters.bySource(/\.messageContainer,{\[\w+.compact/),
  );

  Modules.ChannelMessage ??= await webpack.waitForModule<Types.ChannelMessage>(
    webpack.filters.bySource(".hideAccessories?void 0"),
  );

  Modules.IconUtils ??= await webpack.waitForProps<Types.IconUtils>("getUserAvatarURL");

  Modules.ChatSettingUtils ??=
    await webpack.waitForProps<Types.ChatSettingUtils>("MessageDisplayCompact");

  Modules.MessageClasses = {
    ...webpack.getByProps<Types.SearchMessageClasses>("message", "searchResult"),
    ...webpack.getByProps<Types.EmbedClasses>("embedAuthorIcon", "embedAuthor", "embedAuthor"),
  };

  Modules.MessageCacheActions ??= await webpack.waitForModule<Types.ChannelMessages>(
    webpack.filters.bySource("this.revealedMessageId"),
  );

  Modules.APIRequestUtils ??= await webpack.waitForProps<Types.APIRequestUtils>(
    "getAPIBaseURL",
    "HTTP",
  );

  Modules.PermissionStore ??= webpack.getByStoreName<Types.PermissionStore>("PermissionStore");
};

export default Modules;

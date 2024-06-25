import { webpack } from "replugged";
import Types from "../types";

export const Modules: Types.Modules = {};

Modules.loadModules = async (): Promise<void> => {
  Modules.DiscordConstantsModule = await webpack
    .waitForModule<Types.GenericModule>(webpack.filters.bySource(".MFA_WARNING="), {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find DiscordConstants Module");
    });

  Modules.DiscordConstants = {
    Permissions: webpack.getExportsForProps(Modules.DiscordConstantsModule, [
      "ADMINISTRATOR",
      "MANAGE_GUILD",
    ]),
    ChannelTypes: webpack.getExportsForProps(Modules.DiscordConstantsModule, [
      "GUILD_TEXT",
      "GUILD_VOICE",
    ]),
    Endpoints: webpack.getExportsForProps(Modules.DiscordConstantsModule, [
      "AUTH_SESSIONS",
      "AUTH_SESSIONS_LOGOUT",
    ]),
  };

  Modules.MessageAccessories ??= await webpack
    .waitForModule<Types.MessageAccessories>(webpack.filters.bySource("this.renderEmbeds"), {
      timeout: 10000,
    })
    .then((mod) =>
      webpack.getFunctionBySource<Types.DefaultTypes.AnyFunction>(mod, "this.renderEmbeds"),
    )
    .catch(() => {
      throw new Error("Failed To Find MessageAccessories Module");
    });

  Modules.RichEmbed ??= await webpack
    .waitForModule<Types.Embeds>(webpack.filters.bySource("this.renderEmbedContent()"), {
      timeout: 10000,
    })
    .then((mod) =>
      webpack.getFunctionBySource<Types.Embeds["default"]>(mod, "this.renderEmbedContent()"),
    )
    .catch(() => {
      throw new Error("Failed To Find RichEmbed Module");
    });

  Modules.AutomodEmbed ??= await webpack
    .waitForModule<Types.AutomodEmbed>(
      webpack.filters.bySource(/\.messageContainer,{\[\w+.compact/),
      { timeout: 1000 },
    )
    .catch(() => {
      throw new Error("Failed To Find AutomodEmbed Module");
    });

  Modules.ChannelMessage ??= await webpack
    .waitForModule<Types.ChannelMessage>(webpack.filters.bySource(".hideAccessories?void 0"), {
      timeout: 1000,
    })
    .catch(() => {
      throw new Error("Failed To Find ChannelMessage Module");
    });

  Modules.IconUtils ??= await webpack.waitForProps<Types.IconUtils>("getUserAvatarURL");

  Modules.MessageDisplayCompact ??= await webpack
    .waitForModule<Types.ChatSettingUtils>(webpack.filters.bySource("),useSetting:()=>"))
    .then((mod) =>
      webpack.getFunctionBySource<(...args: unknown[]) => Types.ChatSettingUtils>(
        mod,
        "),useSetting:()=>",
      )("textAndImages", "messageDisplayCompact", (res) => res?.value),
    );

  Modules.MessageClasses = {
    ...(await webpack.waitForProps<Types.SearchMessageClasses>("message", "searchResult")),
    ...(await webpack.waitForProps<Types.EmbedClasses>(
      "embedAuthorIcon",
      "embedAuthor",
      "embedAuthor",
    )),
  };

  Modules.MessageCacheActions ??= await webpack
    .waitForModule<Types.ChannelMessages>(webpack.filters.bySource("this.revealedMessageId"), {
      timeout: 1000,
    })
    .catch(() => {
      throw new Error("Failed To Find MessageCacheActions Module");
    });

  Modules.PermissionStore ??= webpack.getByStoreName<Types.PermissionStore>("PermissionStore");
};

export default Modules;

import { util } from "replugged";
import { guilds as UltimateGuildStore, users as UltimateUserStore } from "replugged/common";
import { PluginInjector } from "../index";
import { TenorRegex } from "./consts";
import { IconUtils } from "./requiredModules";
import Types from "../types";

export const forceRerenderElement = async (selector: string): Promise<void> => {
  const element = await util.waitFor(selector);
  if (!element) return;
  const ownerInstance = util.getOwnerInstance(element);
  const unpatchRender = PluginInjector.instead(ownerInstance, "render", () => {
    unpatchRender();
    return null;
  });
  ownerInstance.forceUpdate(() => ownerInstance.forceUpdate(() => {}));
};
export const getChannelIconAndType = ({ channel }: { channel: Types.Channel }): string[] => {
  switch (true) {
    case channel.isDM():
      return [
        IconUtils.getUserAvatarURL(UltimateUserStore.getUser(channel.recipients[0])) as string,
        "Direct Message",
      ];

    case channel.isGroupDM():
      return [IconUtils.default.getChannelIconURL(channel) as string, "Group DM"];
    case true:
      return [
        IconUtils.default.getGuildIconURL(UltimateGuildStore.getGuild(channel.guild_id)) as string,
        "Server",
      ];
  }
};

export const needsRichEmbed = (message: Types.Message): boolean =>
  Boolean(
    message.components.length ||
      message.attachments.some((a) => !a.content_type?.startsWith("image/")) ||
      message.embeds.some(
        (e) => e.type !== "image" && (e.type !== "gifv" || TenorRegex.test(e.url)),
      ),
  );
export const getMessageImages = (
  message: Types.Message,
): Array<{ proxyURL?: string; url: string; width: number; height: number }> =>
  (message.attachments ?? [])
    .filter(({ content_type }) => content_type?.startsWith("image/"))
    .map(({ height, width, url, proxy_url }) => ({ height, width, url, proxyURL: proxy_url }))
    .concat(
      (message.embeds ?? [])
        .filter(
          ({ type, url }) => type === "image" || (url && type === "gifv" && !TenorRegex.test(url)),
        )
        .map(({ image, thumbnail, url, type }) =>
          type === "image"
            ? { ...(image ?? thumbnail) }
            : { height: thumbnail.height, width: thumbnail.width, url, proxyURL: url },
        ),
    );

export const formatEmptyContent = ({
  attachments,
  embeds,
}: {
  attachments: number;
  embeds: number;
}): string =>
  !attachments && !embeds
    ? ""
    : !attachments
      ? `[${embeds} embed${embeds !== 1 ? "s" : ""}]`
      : !embeds
        ? `[${attachments} attachment${attachments !== 1 ? "s" : ""}]`
        : `[${attachments} attachment${attachments !== 1 ? "s" : ""} and ${embeds} embed${embeds !== 1 ? "s" : ""}]`;
export const resizeToFit = ({
  width,
  height,
}: {
  width: number;
  height: number;
}): { width: number; height: number } => {
  const maxWidth = 400;
  const maxHeight = 300;
  if (width !== maxWidth || height !== maxHeight) {
    const scaledWidth = width > maxWidth ? maxWidth / width : 1;
    width = Math.max(Math.round(width * scaledWidth), 0);
    height = Math.max(Math.round(height * scaledWidth), 0);
    const scaledHeight = height > maxHeight ? maxHeight / height : 1;
    width = Math.max(Math.round(width * scaledHeight), 0);
    height = Math.max(Math.round(height * scaledHeight), 0);
  }
  return {
    width,
    height,
  };
};

export default {
  ...util,
  forceRerenderElement,
  getChannelIconAndType,
  needsRichEmbed,
  getMessageImages,
  formatEmptyContent,
  resizeToFit,
};

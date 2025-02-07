import { util, webpack } from "replugged";
import {
  api as APIRequestUtils,
  fluxDispatcher as FluxDispatcher,
  guilds as UltimateGuildStore,
  messages as UltimateMessageStore,
  users as UltimateUserStore,
} from "replugged/common";
import { PluginInjector, PluginLogger } from "../index";
import { TenorRegex } from "./consts";
import Modules from "./requiredModules";
import Types from "../types";

export class LimitedMap<K, V> extends Map<K, V> {
  private limit: number;
  private keysQueue: K[] = [];
  public constructor(limit: number) {
    super();
    this.limit = limit;
  }
  public set(key: K, value: V): this {
    if (this.size >= this.limit) {
      const oldestKey = this.keysQueue.shift();
      if (oldestKey !== void 0) {
        this.delete(oldestKey);
      }
    }
    super.set(key, value);
    this.keysQueue.push(key);
    return this;
  }
}
export const messageCache = new LimitedMap<string, Types.Message>(150);

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
  const { IconUtils } = Modules;
  switch (true) {
    case channel.isDM():
      return [
        IconUtils.getUserAvatarURL(UltimateUserStore.getUser(channel.recipients[0])) as string,
        "Direct Message",
      ];

    case channel.isGroupDM():
      return [IconUtils.getChannelIconURL(channel) as string, "Group DM"];
    case true:
      return [
        IconUtils.getGuildIconURL(UltimateGuildStore.getGuild(channel.guild_id)) as string,
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

export const fetchMessage = async ({ channelId, messageId }): Promise<Types.Message> => {
  const { DiscordConstants, MessageCacheActions } = Modules;
  PluginLogger.log(
    `Fetching message for messageId: ${messageId} channelId: ${channelId} at ${new Date()}`,
  );
  const cachedMessage =
    UltimateMessageStore.getMessage(channelId, messageId) ??
    messageCache.get(`${channelId}-${messageId}`);
  if (cachedMessage) return cachedMessage;
  const channelMessages = MessageCacheActions.getOrCreate(channelId);

  FluxDispatcher.dispatch({
    type: "LOAD_MESSAGES",
  });

  const fetchStart = performance.now();
  const message = await APIRequestUtils.HTTP.get({
    // eslint-disable-next-line new-cap
    url: DiscordConstants.Endpoints.MESSAGES(channelId),
    query: {
      limit: "1",
      around: messageId,
    },
    retries: 2,
    oldFormErrors: !0,
  }).then(({ body }) => channelMessages.receiveMessage(body[0] as Types.Message).get(messageId));
  messageCache.set(`${channelId}-${messageId}`, message);
  const fetchEnd = performance.now();
  PluginLogger.log(
    `Fetched message for messageId: ${messageId} channelId: ${channelId} at ${new Date()} in ${(fetchEnd - fetchStart).toFixed(2)}ms.`,
  );
  return message;
};

export const isObject = (testMaterial: unknown): boolean =>
  typeof testMaterial === "object" && !Array.isArray(testMaterial) && testMaterial != null;

export const unmangleExports = <T>(
  moduleFilter: Types.DefaultTypes.Filter | Types.DefaultTypes.RawModule,
  map: Record<string, string | string[] | RegExp | Types.DefaultTypes.AnyFunction>,
): T => {
  const getExportKeyFinder = (
    mapValue: string | string[] | RegExp | Types.DefaultTypes.AnyFunction,
  ): Types.DefaultTypes.AnyFunction => {
    if (typeof mapValue === "function") {
      return (mod: Types.DefaultTypes.RawModule["exports"]) => {
        return mapValue(mod);
      };
    }

    if (Array.isArray(mapValue)) {
      return (mod: Types.DefaultTypes.RawModule["exports"]) => {
        if (!isObject(mod)) return "";
        for (const [k, exported] of Object.entries(mod)) {
          if (mapValue.every((p) => Object.hasOwnProperty.call(exported, p))) return k;
        }
      };
    }

    return (mod: Types.DefaultTypes.RawModule["exports"]) =>
      webpack.getFunctionKeyBySource(mod, mapValue as string);
  };

  const mod: Types.DefaultTypes.RawModule =
    typeof moduleFilter === "function"
      ? webpack.getModule(moduleFilter, { raw: true })
      : moduleFilter;

  if (!mod) return {} as T;

  const unmangled = {} as T;

  for (const key in map) {
    const findKey = getExportKeyFinder(map[key]);
    const valueKey = findKey(mod.exports) as string;
    Object.defineProperty(unmangled, key, {
      get: () => mod.exports[valueKey],
      set: (v) => {
        mod.exports[valueKey] = v;
      },
    });
  }

  // Return the unmangled object
  return unmangled;
};

export default {
  ...util,
  LimitedMap,
  messageCache,
  forceRerenderElement,
  getChannelIconAndType,
  needsRichEmbed,
  getMessageImages,
  formatEmptyContent,
  resizeToFit,
  fetchMessage,
  isObject,
  unmangleExports,
};

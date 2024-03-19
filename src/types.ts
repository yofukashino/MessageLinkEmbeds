import { types } from "replugged";
import type util from "replugged/util";
import type { Store as StoreType } from "replugged/dist/renderer/modules/common/flux";
import GeneralDiscordTypes from "discord-types/general";

export namespace Types {
  export import DefaultTypes = types;
  export type Message = GeneralDiscordTypes.Message;
  export type Channel = GeneralDiscordTypes.Channel;
  export type UtilTree = util.Tree;
  export type Store = StoreType;
  export type ReactTree = util.Tree & React.ReactElement;
  export interface PermissionStore extends Store {
    can: DefaultTypes.AnyFunction;
    canAccessGuildSettings: DefaultTypes.AnyFunction;
    canBasicChannel: DefaultTypes.AnyFunction;
    canImpersonateRole: DefaultTypes.AnyFunction;
    canManageUser: DefaultTypes.AnyFunction;
    canWithPartialContext: DefaultTypes.AnyFunction;
    computePermissions: DefaultTypes.AnyFunction;
    getChannelPermissions: DefaultTypes.AnyFunction;
    getChannelsVersion: DefaultTypes.AnyFunction;
    getGuildPermissionProps: DefaultTypes.AnyFunction;
    getPermissionUtils: DefaultTypes.AnyFunction;
    getGuildVersion: DefaultTypes.AnyFunction;
    getHighestRole: DefaultTypes.AnyFunction;
    initialize: DefaultTypes.AnyFunction;
    isRoleHigher: DefaultTypes.AnyFunction;
  }
  export interface DiscordConstants {
    Permissions: {
      ADD_REACTIONS: bigint;
      ADMINISTRATOR: bigint;
      ATTACH_FILES: bigint;
      BAN_MEMBERS: bigint;
      CHANGE_NICKNAME: bigint;
      CONNECT: bigint;
      CREATE_EVENTS: bigint;
      CREATE_GUILD_EXPRESSIONS: bigint;
      CREATE_INSTANT_INVITE: bigint;
      CREATE_PRIVATE_THREADS: bigint;
      CREATE_PUBLIC_THREADS: bigint;
      DEAFEN_MEMBERS: bigint;
      EMBED_LINKS: bigint;
      KICK_MEMBERS: bigint;
      MANAGE_CHANNELS: bigint;
      MANAGE_EVENTS: bigint;
      MANAGE_GUILD: bigint;
      MANAGE_GUILD_EXPRESSIONS: bigint;
      MANAGE_MESSAGES: bigint;
      MANAGE_NICKNAMES: bigint;
      MANAGE_ROLES: bigint;
      MANAGE_THREADS: bigint;
      MANAGE_WEBHOOKS: bigint;
      MENTION_EVERYONE: bigint;
      MODERATE_MEMBERS: bigint;
      MOVE_MEMBERS: bigint;
      MUTE_MEMBERS: bigint;
      PRIORITY_SPEAKER: bigint;
      READ_MESSAGE_HISTORY: bigint;
      REQUEST_TO_SPEAK: bigint;
      SEND_MESSAGES: bigint;
      SEND_MESSAGES_IN_THREADS: bigint;
      SEND_TTS_MESSAGES: bigint;
      SEND_VOICE_MESSAGES: bigint;
      SPEAK: bigint;
      STREAM: bigint;
      USE_APPLICATION_COMMANDS: bigint;
      USE_EMBEDDED_ACTIVITIES: bigint;
      USE_EXTERNAL_EMOJIS: bigint;
      USE_EXTERNAL_SOUNDS: bigint;
      USE_EXTERNAL_STICKERS: bigint;
      USE_SOUNDBOARD: bigint;
      USE_VAD: bigint;
      VIEW_AUDIT_LOG: bigint;
      VIEW_CHANNEL: bigint;
      VIEW_CREATOR_MONETIZATION_ANALYTICS: bigint;
      VIEW_GUILD_ANALYTICS: bigint;
    };
    ChannelTypes: {
      ANNOUNCEMENT_THREAD: number;
      DM: number;
      GROUP_DM: number;
      GUILD_ANNOUNCEMENT: number;
      GUILD_CATEGORY: number;
      GUILD_DIRECTORY: number;
      GUILD_FORUM: number;
      GUILD_STAGE_VOICE: number;
      GUILD_STORE: number;
      GUILD_TEXT: number;
      GUILD_VOICE: number;
      PRIVATE_THREAD: number;
      PUBLIC_THREAD: number;
      UNKNOWN: number;
    };
  }
  export interface MessageAccessories {
    MessageAccessories: DefaultTypes.AnyFunction;
    SimpleMessageAccessories: DefaultTypes.AnyFunction;
    default: DefaultTypes.AnyFunction;
  }
  export interface Embeds {
    default: React.ComponentClass<{
      embed: {
        title?: string;
        type?: DefaultTypes.MessageEmbedTypes;
        description?: string | React.ReactElement;
        rawDescription?: string;
        url?: string;
        timestamp?: string;
        color?: number | string;
        footer?: {
          text: string | React.ReactElement;
          iconUrl?: string;
          iconProxyURL?: string;
        };
        image?: {
          url: string;
          proxyUrl?: string;
          height?: number;
          width?: number;
        };
        thumbnail?: {
          url: string;
          proxyUrl?: string;
          width?: number;
          height?: number;
        };
        video?: {
          url?: string;
          proxyUrl?: string;
          height?: number;
          width?: number;
        };
        provider?: {
          name?: string;
          url?: string;
        };
        author?: {
          name: string | React.ReactElement;
          url?: string;
          iconUrl?: string;
          iconProxyURL?: string;
        };
        fields?: Array<{
          name: string;
          value: string;
          inline?: boolean;
        }>;
      };
      allowFullScreen?: boolean;
      autoPlayGif?: boolean;
      channelId?: string;
      className?: string;
      hideMedia?: boolean;
      maxThumbnailHeight?: number;
      maxThumbnailWidth?: number;
      messageId?: string;
      obscureReason?: string;
      onSuppressEmbed?: DefaultTypes.AnyFunction;
      renderDescription?: DefaultTypes.AnyFunction;
      renderImageComponent?: DefaultTypes.AnyFunction;
      renderLinkComponent?: DefaultTypes.AnyFunction;
      renderTitle?: DefaultTypes.AnyFunction;
      renderVideoComponent?: DefaultTypes.AnyFunction;
    }>;
    EmbedVideo: DefaultTypes.AnyFunction;
  }
  export type AutomodEmbed = React.ComponentType<{
    message?: Message;
    channel?: Channel;
    childrenAccessories?: string | React.ReactElement;
    content?: string | React.ReactElement;
    className?: string;
    compact?: boolean;
    popoutProps?: Record<string, string>;
    hideTimestamp?: boolean;
    withFooter?: boolean;
    _messageEmbed?: string;
  }>;
  export type ChannelMessage = React.MemoExoticComponent<
    React.ComponentType<{
      id?: string;
      className?: string;
      message: Message;
      channel: Channel;
      subscribeToComponentDispatch?: boolean;
    }>
  >;
  export interface IconUtils {
    DEFAULT_AVATARS: string[];
    SUPPORTS_WEBP: boolean;
    default: {
      getAnimatableSourceWithFallback: DefaultTypes.AnyFunction;
      getApplicationIconSource: DefaultTypes.AnyFunction;
      getApplicationIconURL: DefaultTypes.AnyFunction;
      getAvatarDecorationURL: DefaultTypes.AnyFunction;
      getChannelIconSource: DefaultTypes.AnyFunction;
      getChannelIconURL: DefaultTypes.AnyFunction;
      getDefaultAvatarURL: DefaultTypes.AnyFunction;
      getEmojiURL: DefaultTypes.AnyFunction;
      getGameAssetSource: DefaultTypes.AnyFunction;
      getGameAssetURL: DefaultTypes.AnyFunction;
      getGuildBannerSource: DefaultTypes.AnyFunction;
      getGuildBannerURL: DefaultTypes.AnyFunction;
      getGuildDiscoverySplashSource: DefaultTypes.AnyFunction;
      getGuildDiscoverySplashURL: DefaultTypes.AnyFunction;
      getGuildHomeHeaderSource: DefaultTypes.AnyFunction;
      getGuildHomeHeaderURL: DefaultTypes.AnyFunction;
      getGuildIconSource: DefaultTypes.AnyFunction;
      getGuildIconURL: DefaultTypes.AnyFunction;
      getGuildMemberAvatarSource: DefaultTypes.AnyFunction;
      getGuildMemberAvatarURL: DefaultTypes.AnyFunction;
      getGuildMemberAvatarURLSimple: DefaultTypes.AnyFunction;
      getGuildMemberBannerURL: DefaultTypes.AnyFunction;
      getGuildSplashSource: DefaultTypes.AnyFunction;
      getGuildSplashURL: DefaultTypes.AnyFunction;
      getGuildTemplateIconSource: DefaultTypes.AnyFunction;
      getGuildTemplateIconURL: DefaultTypes.AnyFunction;
      getUserAvatarColor: DefaultTypes.AnyFunction;
      getUserAvatarSource: DefaultTypes.AnyFunction;
      getUserAvatarURL: DefaultTypes.AnyFunction;
      getUserBannerURL: DefaultTypes.AnyFunction;
      getVideoFilterAssetURL: DefaultTypes.AnyFunction;
      hasAnimatedGuildIcon: DefaultTypes.AnyFunction;
      isAnimatedIconHash: DefaultTypes.AnyFunction;
      makeSource: DefaultTypes.AnyFunction;
    };
    getAvatarDecorationURL: DefaultTypes.AnyFunction;
    getEmojiURL: DefaultTypes.AnyFunction;
    getGuildMemberAvatarURL: DefaultTypes.AnyFunction;
    getGuildMemberAvatarURLSimple: DefaultTypes.AnyFunction;
    getGuildMemberBannerURL: DefaultTypes.AnyFunction;
    getUserAvatarURL: DefaultTypes.AnyFunction;
    getUserBannerURL: DefaultTypes.AnyFunction;
    getVideoFilterAssetURL: DefaultTypes.AnyFunction;
    isAnimatedIconHash: DefaultTypes.AnyFunction;
    isAnimatedImageURL: DefaultTypes.AnyFunction;
    isVideoAssetHash: DefaultTypes.AnyFunction;
  }
  export interface SearchMessageClasses {
    button: string;
    buttonsContainer: string;
    container: string;
    message: string;
    searchResult: string;
  }
  export interface EmbedClasses {
    centerContent: string;
    embed: string;
    embedAmazonMusic: string;
    embedAuthor: string;
    embedAuthorIcon: string;
    embedAuthorName: string;
    embedAuthorNameLink: string;
    embedDescription: string;
    embedField: string;
    embedFieldName: string;
    embedFieldValue: string;
    embedFields: string;
    embedFooter: string;
    embedFooterIcon: string;
    embedFooterSeparator: string;
    embedFooterText: string;
    embedFull: string;
    embedGIFTag: string;
    embedGalleryImageElement: string;
    embedGalleryImagesWrapper: string;
    embedGallerySide: string;
    embedIframe: string;
    embedImage: string;
    embedLink: string;
    embedMargin: string;
    embedMedia: string;
    embedProvider: string;
    embedSpotify: string;
    embedSuppressButton: string;
    embedThumbnail: string;
    embedTitle: string;
    embedTitleLink: string;
    embedVideo: string;
    embedVideoAction: string;
    embedVideoActions: string;
    embedVideoImageComponent: string;
    embedVideoImageComponentInner: string;
    galleryImage: string;
    galleryImageContainer: string;
    grid: string;
    gridContainer: string;
    hasThumbnail: string;
    hiddenAttachment: string;
    hiddenEmbed: string;
    hiddenExplicitAttachment: string;
    hiddenExplicitEmbed: string;
    inlineMediaEmbed: string;
    isHidden: string;
    justifyAuto: string;
    spoilerAttachment: string;
    spoilerEmbed: string;
  }
  export type ChatSettingUtils = Record<
    string,
    {
      getSetting: DefaultTypes.AnyFunction;
      updateSetting: DefaultTypes.AnyFunction;
      useSetting: DefaultTypes.AnyFunction;
    }
  >;
  export interface Settings {
    background: string;
    automodEmbed: string;
  }
}
export default Types;

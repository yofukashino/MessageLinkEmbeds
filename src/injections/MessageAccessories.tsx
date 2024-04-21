import { PluginInjector } from "../index";
import { MessageLinkRegex } from "../lib/consts";
import Modules from "../lib/requiredModules";
import MessageEmbed from "../Components/MessageEmbed";
import Types from "../types";
export default (): void => {
  PluginInjector.after(
    Modules.MessageAccessories.prototype,
    "renderEmbeds",
    ([message]: [Types.Message], res) => {
      if (!MessageLinkRegex.test(message.content)) return res;
      res ??= [];
      res.unshift(<MessageEmbed message={message} />);
      return res;
    },
  );
};

import { PluginInjector } from "../index";
import { MessageLinkRegex } from "../lib/consts";
import { MessageAccessories } from "../lib/requiredModules";
import MessageEmbed from "../Components/MessageEmbed";
import Types from "../types";
export default (): void => {
  PluginInjector.after(
    MessageAccessories.prototype,
    "renderEmbeds",
    ([message]: [Types.Message], res) => {
      if (!MessageLinkRegex.test(message.content)) return res;
      res ??= [];
      res.unshift(<MessageEmbed message={message} />);
      return res;
    },
  );
};

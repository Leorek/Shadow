import axios from "axios"
import { ICommand } from "../../types/common";

export class RandomCatCommand implements ICommand{
  public name = "randomcat";
  public description = "Sends a random picture or gif of cats.";

  public execute(controller, context) {
    axios.get("http://random.cat/meow")
      .then(res => {
        const cat = res.data;
        controller.sendImage(context, cat.file);
      })
      .catch(err => {
        controller.sendMessage(context, "something_went_wrong");
      });
  }
}

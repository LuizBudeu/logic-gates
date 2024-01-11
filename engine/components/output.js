import Circle from "../ui/circle.js";
import Settings from "../settings.js";
import IO from "./io.js";

class Output extends IO {
    constructor(ctx, debugName = "") {
        debugName += "_Output";
        super(ctx, debugName);
    }
}

export default Output;

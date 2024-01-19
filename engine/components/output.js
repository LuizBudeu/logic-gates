import Circle from "../ui/circle.js";
import Settings from "../settings.js";
import IO from "./io.js";

class Output extends IO {
    constructor(ctx, debugName = "", gate = null) {
        debugName += "_Output";
        super(ctx, debugName, gate);
    }
}

export default Output;

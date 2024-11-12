import Circle from "../UIComponents/circle.js";
import Settings from "../settings.js";
import IO from "./io.js";

class Output extends IO {
    constructor(ctx, debugName = "", gate = null, IOLabelName = null) {
        debugName += "_Output";
        super(ctx, debugName, gate, IOLabelName);
        this.type = "output";
    }
}

export default Output;

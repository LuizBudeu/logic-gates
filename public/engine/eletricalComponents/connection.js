class Connection {
    constructor(upstream, downstream) {
        this.upstream = upstream;
        this.downstream = downstream;
    }

    serialize() {
        let upstreamId;
        let downstreamId;

        if (this.upstream.isGlobal()) {
            upstreamId = `${this.upstream.circuitId}`;
        } else {
            upstreamId = `${this.upstream.gate.circuitId}_${this.upstream.type}${this.upstream.gateIOId}`;
        }

        if (this.downstream.isGlobal()) {
            downstreamId = `${this.downstream.circuitId}`;
        } else {
            downstreamId = `${this.downstream.gate.circuitId}_${this.downstream.type}${this.downstream.gateIOId}`;
        }

        return {
            upstream: upstreamId,
            downstream: downstreamId,
        };
    }
}

export default Connection;

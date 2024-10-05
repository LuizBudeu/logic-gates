import Core from "./engine/core.js";
import MissionManager from "./engine/managers/missionManager.js";

const canvas = document.getElementById("circuit-canvas");
const ctx = canvas.getContext("2d");

export let missions = [];

const core = new Core(canvas, ctx);
core.start();

export async function loadMissions() {
    // Get user id
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userId = urlParams.get('id');

    await MissionManager.loadMissions(userId);

    return MissionManager.missions;
}

async function saveMission(missionId, checkbox) {
    // Get user id
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userId = urlParams.get('id');

    await MissionManager.saveMission(userId, missionId, checkbox.checked);
}

window.saveMission = saveMission;

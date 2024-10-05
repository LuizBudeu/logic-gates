import Core from "./engine/core.js";
import MissionManager from "./engine/managers/missionManager.js";
import UserManager from "./engine/managers/userManager.js";

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

export async function saveMissions(missions) {
    // Get user id
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userId = urlParams.get('id');

    await MissionManager.saveMission(userId, missions);
}

export async function getUserInfo() {
    // Get user id
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userId = urlParams.get('id');

    await UserManager.getUser(userId);

    return UserManager.user;
}

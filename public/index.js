import Core from "./engine/core.js";
import MissionManager from "./engine/managers/missionManager.js";
import UserManager from "./engine/managers/userManager.js";

const canvas = document.getElementById("circuit-canvas");
const ctx = canvas.getContext("2d");

export let missions = [];

const core = new Core(canvas, ctx);
core.start();

export async function loadMissions() {
    await MissionManager.loadMissions();

    return MissionManager.missions;
}

export async function saveMissions(missions) {
    await MissionManager.saveMission(missions);
}

export async function getUserInfo() {
    await UserManager.getUser();

    return UserManager.user;
}

export async function logout() {
    UserManager.logout();
}

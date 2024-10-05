class MissionManager {
    static missions = [];

    static async loadMissions(userId) {
        await fetch("/missions/"+userId)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                MissionManager.missions = data;
            });
    }

    static async saveMission(userId, missionId, value) {
        await fetch("/saveMission",{
            method: "POST",
            body: JSON.stringify({
                "userId": userId,
                "missionId": missionId,
                "value": value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
          });
    }
}

export default MissionManager;

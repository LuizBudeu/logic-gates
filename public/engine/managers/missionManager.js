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

    static async saveMission(userId, missions) {
        await fetch("/saveMission",{
            method: "POST",
            body: JSON.stringify({
                "userId": userId,
                "missions": missions
            }),
            headers: {
                "Content-Type": "application/json",
            },
          });
    }
}

export default MissionManager;

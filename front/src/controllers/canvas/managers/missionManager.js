class MissionManager {
    static missions = [];

    static async loadMissions() {
        await fetch("/missions", {
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                MissionManager.missions = data;
            });
    }

    static async saveMission(missions) {
        await fetch("/saveMission",{
            credentials: 'include',
            method: "POST",
            body: JSON.stringify({
                "missions": missions
            }),
            headers: {
                "Content-Type": "application/json",
            },
          });
    }
}

export default MissionManager;

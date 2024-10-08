class UserManager {
    static user = null;

    static async getUser() {
        await fetch("/user", {
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                UserManager.user = data;
            });
    }
}

export default UserManager;

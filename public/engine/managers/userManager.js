class UserManager {
    static user = null;

    static async getUser(userId) {
        await fetch("/user/"+userId)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                UserManager.user = data;
            });
    }
}

export default UserManager;

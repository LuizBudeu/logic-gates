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

    static async logout() {
        await fetch("/logout", {
            method: "POST",
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if(data.message == "OK"){
                    window.location.href = '../login';
                }else{
                    alert("Erro no logout");
                }
                
            });
    }
}

export default UserManager;

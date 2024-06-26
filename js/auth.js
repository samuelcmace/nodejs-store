(() => {

    let register_button = document.getElementById("registerButton");

    register_button.addEventListener("click", async () => {
        let username = prompt("Please enter the new username you would like to create:");

        let response = await fetch("/api/auth", {
            method: "POST",
            headers: {
                "Action": "Register",
                "Username": username
            }
        });

        const result = await response.json();
        if (result.outcome === "PASS") {
            alert("Account Registered Successfully!");
            location.assign("/");
        } else {
            alert(`${result.outcome}: ${result.message}`);
        }
    });

    let login_button = document.getElementById("loginButton");

    login_button.addEventListener("click", async () => {
        let username = prompt("Please enter the username with which you would like to login:");

        let response = await fetch("/api/auth", {
            method: "GET",
            headers: {
                "Action": "Login",
                "Username": username
            }
        });

        const result = await response.json();
        if(result.outcome === "PASS") {
            alert("You've been successfully logged in. You now may proceed to navigate about the application until your heart's content!");
            location.assign("/");
        } else {
            alert(`${result.outcome}: ${result.message}`);
        }
    });

})();

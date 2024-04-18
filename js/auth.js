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
        if (result.outcome.toUpperCase() === "PASS") {
            alert("Session Cleared Successfully!");
        }
    });

    let login_button = document.getElementById("loginButton");

    login_button.addEventListener("click", async () => {
        let username = prompt("Please enter the username with which you would like to login:");

        let response = await fetch("/api/auth", {
            method: "POST",
            headers: {
                "Action": "Login",
                "Username": username
            }
        });

        const result = await response.json();
        if(result.outcome.toUpperCase() === "PASS") {
            alert("You've been successfully logged in. You now may proceed to navigate about the application until your heart's content!");
        } else {
            alert(`${result.outcome.toUpperCase()}: ${result.message}`);
        }
    });

})();

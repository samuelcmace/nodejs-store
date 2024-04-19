(() => {

    let logout_button = document.getElementById("logoutButton");

    logout_button.addEventListener("click", async () => {

        let response = await fetch("/api/auth", {
            method: "GET",
            headers: {
                "Action": "Logout"
            }
        });

        const result = await response.json();
        if (result.outcome.toUpperCase() === "PASS") {
            alert("You have been successfully logged out!");
            location.assign("/auth");
        } else {
            alert(`${result.outcome.toUpperCase()}: ${result.message}`);
        }
    });

})();

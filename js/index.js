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
        if (result.outcome === "PASS") {
            alert("You have been successfully logged out!");
        } else {
            alert(`${result.outcome.toUpperCase()}: ${result.message}`);
        }
    });

})();

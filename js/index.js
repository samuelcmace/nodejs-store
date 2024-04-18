(() => {

    let logout_button = document.getElementById("logoutButton");

    logout_button.addEventListener("click", async () => {
        let response = await fetch("/api/auth", {
            method: "PUT",
            headers: {
                "Action": "Logout"
            }
        });

        const result = await response.json();
        if (result.outcome === "PASS") {
            alert("Session Cleared Successfully!");
        }
    });

})();

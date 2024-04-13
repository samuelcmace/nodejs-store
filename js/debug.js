(() => {

    let end_session_button = document.getElementById("endSessionDebugButton");

    end_session_button.addEventListener("click", async () => {
        let response = await fetch("/api/debug/session", {
            method: "DELETE"
        });

        const result = await response.json();
        if(result.outcome === "pass") {
            alert("Session Cleared Successfully!");
        }
    });

    let view_cart_button = document.getElementById("viewCartDebugButton");

    view_cart_button.addEventListener("click", async () => {
        let response = await fetch("/api/debug/cart", {
            method: "GET"
        });

        const result = await response.json();
        alert("Message: " + result.message);
    });

})();

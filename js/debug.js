(() => {

    let generate_fake_data_button = document.getElementById("generateFakeDataButton");

    generate_fake_data_button.addEventListener("click", async () => {
        let response = await fetch("/api/debug/data", {
            method: "POST"
        });

        const result = await response.json();
        if (result.outcome === "PASS") {
            alert("Data Generated Successfully!");
        } else {
            alert(`${result.outcome}: ${result.message}`);
        }
    });

    let end_session_button = document.getElementById("endSessionDebugButton");

    end_session_button.addEventListener("click", async () => {
        let response = await fetch("/api/debug/session", {
            method: "DELETE"
        });

        const result = await response.json();
        if (result.outcome === "PASS") {
            alert("Session Cleared Successfully!");
        }
    });

    let view_cart_button = document.getElementById("viewCartDebugButton");

    view_cart_button.addEventListener("click", async () => {
        let response = await fetch("/api/debug/cart", {
            method: "GET"
        });

        const result = await response.json();
        alert("Cart Contents: " + JSON.stringify(result.message));
    });

    let update_quantity_button = document.getElementById("updateCartItemQuantityButton");

    update_quantity_button.addEventListener("click", async () => {
        let item_id = prompt("Please enter the Item ID you would like to edit the quantity of:");
        let quantity = prompt("Please enter the updated quantity for item " + item_id + ":");

        let response = await fetch("/api/debug/cart", {
            method: "PUT", headers: {
                "Item-ID": item_id, "Quantity": quantity
            }
        });

        let result = await response.json();
        alert("Response: " + JSON.stringify(result.message));
    });

})();

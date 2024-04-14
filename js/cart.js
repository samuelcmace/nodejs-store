function attach_api_route_to_button_set(button_set, id_prefix, action) {
    for (let i = 0; i < button_set.length; i++) {
        let item_id = String(button_set[i].id).replace(id_prefix, "");
        button_set[i].addEventListener("click", () => {
            fetch("/api/cart", {
                method: "POST", headers: {
                    "Action": action, "Item-ID": item_id
                }
            }).then(async (response) => {
                let result = await response.json();
                alert(result.outcome.toUpperCase() + ": " + JSON.stringify(result.message));
                location.reload();
            }).catch(async (error) => {
                let result = await error.json();
                alert(result.outcome.toUpperCase() + ": " + JSON.stringify(result.message));
            });
        });
    }
}

(() => {

    let increase_quantity_buttons = document.getElementsByClassName("in-cart-increase-quantity-button");
    attach_api_route_to_button_set(increase_quantity_buttons, "increaseQuantity", "Increase-Quantity");

    let decrease_quantity_buttons = document.getElementsByClassName("in-cart-decrease-quantity-button");
    attach_api_route_to_button_set(decrease_quantity_buttons, "decreaseQuantity", "Decrease-Quantity");

    let remove_item_buttons = document.getElementsByClassName("in-cart-remove-item-button");
    attach_api_route_to_button_set(remove_item_buttons, "removeItem", "Remove-From-Cart");

    document.getElementById("checkout").addEventListener("click", () => {
       fetch("/api/cart", {
           method: "POST",
           headers: {
               "Action": "Checkout"
           }
       }).then(async (response) => {
           let result = await response.json();
           alert(result.outcome.toUpperCase() + ": " + JSON.stringify(result.message));
           location.reload();
       }).catch(async (error) => {
           let result = await error.json();
           alert(result.outcome.toUpperCase() + ": " + JSON.stringify(result.message));
       });
    });

})();

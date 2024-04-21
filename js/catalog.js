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
                alert(result.outcome + ": " + JSON.stringify(result.message));
                location.reload();
            }).catch(async (error) => {
                let result = await error.json();
                alert(result.outcome + ": " + JSON.stringify(result.message));
            });
        });
    }
}

(() => {

    let add_to_cart_buttons = document.getElementsByClassName("catalog-item-add-to-cart");
    attach_api_route_to_button_set(add_to_cart_buttons, "addToCart", "Add-To-Cart");

})();

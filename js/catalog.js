(() => {

    let add_to_cart_buttons = document.getElementsByClassName("catalog-item-add-to-cart");

    for(let i = 0; i < add_to_cart_buttons.length; i++) {
        let item_id = String(add_to_cart_buttons[i].id).replace("addToCart", "");
        let item_id_int = parseInt(item_id);
        add_to_cart_buttons[i].addEventListener("click", () => {
            fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Action": "Add-To-Cart",
                    "Item-ID": item_id_int
                }
            }).then(async (response) => {
                let result = await response.json();
                alert(result.outcome.toUpperCase() + ": " + result.message);
            }).catch(async (error) => {
                let result = await error.json();
                alert(result.outcome.toUpperCase() + ": " + result.message);
            });
        });
    }

})();

(() => {

    // Create a currency formatter for the objects on the screen.
    const currency_formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    // For each element fetched from the database, update the formatting as the en-US currency.
    let item_prices = document.getElementsByClassName("catalog-item-price");

    for(let i = 0; i < item_prices.length; i++) {
        let old_content = item_prices[i].textContent;
        item_prices[i].textContent = currency_formatter.format(parseInt(old_content));
    }

    let add_to_cart_buttons = document.getElementsByClassName("catalog-item-add-to-cart");

    for(let i = 0; i < add_to_cart_buttons.length; i++) {
        let item_id = String(add_to_cart_buttons[i].id).replace("addToCart", "");
        add_to_cart_buttons[i].addEventListener("click", () => {

            let add_to_cart_request = new XMLHttpRequest();
            add_to_cart_request.addEventListener("load", () => {
                alert("Item ID " + item_id + " added to your cart!");
            });
            add_to_cart_request.open("POST", "/api/cart");
            add_to_cart_request.setRequestHeader("Item-ID", item_id);
            add_to_cart_request.send();
        });
    }

})();

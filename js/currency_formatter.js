(() => {

    // Create a currency formatter for the objects on the screen.
    const currency_formatter = new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD"
    });

    // For each element fetched from the database, update the formatting as the en-US currency.
    let item_prices = document.getElementsByClassName("catalog-item-price");

    for (let i = 0; i < item_prices.length; i++) {
        let old_content = item_prices[i].textContent;
        item_prices[i].textContent = currency_formatter.format(parseInt(old_content));
    }

})();

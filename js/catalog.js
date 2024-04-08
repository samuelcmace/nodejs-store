(() => {

    // Create a currency formatter for the objects on the screen.
    const currency_formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    // For each element fetched from the database, update the formatting as the en-US currency.
    let elements = document.getElementsByClassName("catalog-item-price");

    for(let i = 0; i < elements.length; i++) {
        let old_content = elements[i].textContent;
        elements[i].textContent = currency_formatter.format(parseInt(old_content));
    }

})();

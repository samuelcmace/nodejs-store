(() => {

    // Create a currency formatter for the objects on the screen.
    const date_formatter = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full", timeStyle: "long"
    });

    // For each element fetched from the database, update the formatting as the en-US currency.
    let date_elements = document.getElementsByClassName("order-date");

    for (let i = 0; i < date_elements.length; i++) {
        let epoch_date = parseInt(date_elements[i].textContent);
        let formatted_date = new Date(epoch_date);
        date_elements[i].textContent = date_formatter.format(formatted_date);
    }

})();

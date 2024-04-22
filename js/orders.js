(() => {

    let sliderElements = document.getElementsByClassName("rating-slider");

    for (let i = 0; i < sliderElements.length; i++) {

        let sliderElement = sliderElements[i];
        let elementID = sliderElement.id.split("_");

        let order_id = elementID[1];
        let item_id = elementID[2];
        let elementIDSuffix = order_id + "_" + item_id;

        let outputElement = document.getElementById("ratingOutput_" + elementIDSuffix);
        let submitElement = document.getElementById("submitButton_" + elementIDSuffix);

        sliderElement.addEventListener("input", () => {
            outputElement.value = sliderElement.value + " Stars";
        });

        submitElement.addEventListener("click", async () => {
            if (sliderElement.disabled === false) {
                let response = await fetch("/api/catalog/rating", {
                    method: "POST", headers: {
                        "Action": "Submit-Rating",
                        "Item-ID": item_id,
                        "Order-ID": order_id,
                        "Rating": sliderElement.value
                    }
                });

                let result = await response.json();
                if (result.outcome === "PASS") {
                    sliderElement.disabled = true;
                } else {
                    alert(`There was an error in submitting your review: ${result.message}`);
                }
            } else {
                alert("It looks like you cannot submit a rating since you already have for the selected item!");
            }
        });

        outputElement.value = sliderElement.value + " Stars";
    }
})();

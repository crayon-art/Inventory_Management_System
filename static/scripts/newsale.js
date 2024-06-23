// Add event listener on page load
window.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch product list from database
        const res = await fetch(`/inventory/Products`);
        // data[0]=id, data[1]=name, data[2]=units, data[3]=sale price
        let data = await res.json();

        let x = new Set();
        for (let element of data) {
            if (!x.has(element[1])) {
                x.add(element[1]);
            } else {
                element[1] = `${element[1]} (2)`;
            }
        }

        // Generate table rows
        function addTablerows(i, data) {
            const table = document.getElementById("tableBody");

            for (let n = i; n < i + 1; n++) {
                const newRow = document.createElement("tr");
                newRow.id = `tableRow${n + 1}`;
                newRow.innerHTML = `
                    <td id="c1"><text name="rownum">${n + 1}</text></td>
                    <td id="c2">
                        <div id="chooseProduct${n + 1}">
                            <select id="choice${n + 1}" name="pchoices"></select>
                        </div>
                    </td>
                    <td id="r${n + 1}c3">
                        <input type="number" id="nu${n + 1}" name="r${n + 1}" class="fixed-width" min="1" max="${data[0][2]}" value="1">
                    </td>
                    <td id="c4">
                        <input type="text" id="sp${n + 1}" name="sumEntry" class="fixed-width" placeholder="sale price..." disabled="true">
                    </td>
                `;
                table.appendChild(newRow);
            }

            // Add a total row at the end of the rows
            const lastRow = document.createElement("tr");
            lastRow.id = "lastrow";
            lastRow.innerHTML = `
                <td></td>
                <td></td>
                <td><text id="total">Total Amount:</text></td>
                <td><text id="sum"></text></td>
            `;
            table.appendChild(lastRow);

            populateRows(data, i, i + 1);
        }

        // Populate choose product column with product list data
        function populateRows(data, start, end) {
            for (let i = start; i < end; i++) {
                const choice = document.getElementById(`choice${i + 1}`);
                for (let element of data) {
                    const option = document.createElement("option");
                    option.id = `${element[0]}`;
                    option.value = `${element[1]}`;
                    option.innerText = `${element[1]}`;
                    choice.appendChild(option);
                }

                // Event listener for when a product is selected
                choice.addEventListener("change", () => {
                    let maxUnits = 0;
                    let sPrice = 0;

                    for (let item of data) {
                        if (choice.value === item[1]) {
                            maxUnits = item[2];
                            sPrice = item[3];
                        }
                    }

                    const unitsNum = document.getElementById(`r${i + 1}c3`);
                    unitsNum.innerHTML = `
                        <input type="number" id="nu${i + 1}" name="r${i + 1}"
                        min="1" max="${maxUnits}" value="1" class="fixed-width">
                    `;

                    const units = document.getElementById(`nu${i + 1}`);
                    units.addEventListener("change", () => {
                        if (Number(units.value) > maxUnits) {
                            units.value = maxUnits;
                        }else if (Number(units.value) < 1){
                            units.value = 1;
                        }
                        const spElement = document.getElementById(`sp${i + 1}`);
                        spElement.value = sPrice * Number(units.value);
                        updateTotal();
                    });
                });
                // Manually trigger change event to set the initial values for the first product
                choice.dispatchEvent(new Event('change'));
            }
        }

        // Update total amount
        function updateTotal() {
            const salesPrices = document.getElementsByName("sumEntry");
            let sum = 0.00;
            for (let salePrice of salesPrices) {
                sum += Number(salePrice.value);
            }
            const totalSum = document.getElementById("sum");
            totalSum.innerText = sum.toFixed(2);
        }

        // Generate and populate table
        addTablerows(0, data);

        // Add a new row
        const add = document.getElementById("add");
        add.addEventListener("click", () => {
            const currentRow = document.getElementsByName("rownum").length;
            const lastRow = document.getElementById("lastrow");
            const table = document.getElementById("tableBody");
            table.removeChild(lastRow);
            addTablerows(currentRow, data);
        });

        // Delete last row
        const deleteRow = document.getElementById("delete");
        deleteRow.addEventListener("click", () => {
            const currentRow = document.getElementsByName("rownum").length;

            // Ensure first row is not deleted
            if (currentRow > 1) {
                const rowToDelete = document.getElementById(`tableRow${currentRow}`);
                const table = document.getElementById("tableBody");
                table.removeChild(rowToDelete);
            }

            // Ensure dynamic updating of total amount when rows are deleted
            updateTotal();
        });

        // Add back button functionality
        const backbtn = document.getElementById("back");
        backbtn.addEventListener("click", () => {
            window.location.href = "/sales";
        });

        //Add functionality to save invoice info
        const savebtn = document.getElementById("savebtn");
        savebtn.addEventListener("click", async()=>{
            const productsArr = [];
            const productsIdArr=[];
            const unitsArr = [];
            const totalPrice = Number(document.getElementById("sum").innerText);

                const rowNum = document.getElementsByName("rownum");
                for (let n=0; n<rowNum.length; n++){

                    //ensure total price column has a value
                    const sum = document.getElementById(`sp${n+1}`);

                    if(sum.value===""){
                        const check = document.getElementById(`nu${n+1}`);
                        check.focus();
                        break;
                    }
                    else if(sum.value!==""&&n===rowNum.length-1){
                        let prodVal;
                        let unitVal;
                        const rowNum = document.getElementsByName("rownum").length;
                        for (let i=0; i<rowNum; i++){
                            prodVal = document.getElementById(`choice${i+1}`).value;
                            unitVal = Number(document.getElementById(`nu${i + 1}`).value);
                            productsArr.push(prodVal);
                            unitsArr.push(unitVal);
                        }

                        //get product id for product
                        for (let product of productsArr){
                            for (let element of data){
                                if (product === element[1]){
                                    productsIdArr.push(element[0]);
                                }
                            }
                        }

                        // update sales_invoice table in database
                        await fetch(`newsale`, {

                            method: "POST",
                            headers : {
                                "Content-Type" : "application/json"
                            },
                            body: JSON.stringify({
                                products: productsArr,
                                units: unitsArr,
                                price: totalPrice,
                                productsId:productsIdArr
                            })
                        });
                        window.location.href="/sales";
                    };
                };
        });


    } catch (err) {
        console.error(`Error: ${err.stack}`);
    }
});

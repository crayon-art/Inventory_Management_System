//function to store table title in local storage
let storeTitle = (myTitle)=>{
    localStorage.setItem("Title", myTitle);
};

//function to restore title
let restoreTitle = ()=>{
    var storedTitle = localStorage.getItem("Title");
    if(storedTitle){
        return storedTitle;
    }
    else {
        return "Table Title";
    }
};


//add event listener on page load
window.addEventListener("DOMContentLoaded", async()=>{

    try{

    //restore saved Table Title if Present
        const tempTitle = document.getElementById("titletext");
        const storedText = restoreTitle();
        tempTitle.innerText = storedText;

        const editbtn = document.getElementById("pencil");
        //Add an evet listener to change the title of the table
        editbtn.addEventListener("click", async()=>{
            const title = document.getElementById("title");
            const tempTitle = document.getElementById("titletext");
            var newText = document.createElement("input");

            // Set the attributes for the input element
            newText.setAttribute("type", "text");
            newText.setAttribute("id", "textbox");
            newText.setAttribute("name", "name");
            newText.setAttribute("placeholder", "Enter a table title...");
            newText.setAttribute("value", tempTitle.innerText);
            newText.id= "newText";

            if(tempTitle)title.removeChild(tempTitle);
            if(editbtn)title.removeChild(editbtn);
            title.appendChild(newText);
            //automatically change the focus to that of the textbox
            newText.focus();

            //update the title when the textbox focus is changed
            newText.addEventListener('blur', function() {
                    title.removeChild(newText);
                const textInfo = newText.value;
                if (textInfo!==""){
                    tempTitle.innerText = textInfo;
                    storeTitle(textInfo);
                }
                    title.appendChild(tempTitle);
                    title.appendChild(editbtn);
            });
        });

    //add an evet listener to update the categories column
    //of the table based on the type of business
    const busChoice = document.getElementById("buschoices");
    busChoice.addEventListener("change", ()=>{
        const rowNum = document.getElementsByClassName("rowNum").length;
        let catChoice
        for(let i=0; i<rowNum; i++){
            catChoice = document.getElementsByName(`r${i+1}c`)[0];
            if(busChoice.value==="Agriculture"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Seeds and Plants">Seeds and Plants</option>
                <option value="Fertilizers">Fertilizers</option>
                <option value="Farming Equipment">Farming Equipment</option>`;
            }

            else if(busChoice.value==="Automotive"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Car Accessories">Car Accessories</option>
                <option value="Motorcycle Parts">Motorcycle Parts</option>
                <option value="Tools and Equipment">Tools and Equipment</option>
                <option value="Tires and Wheels">Tires and Wheels</option>`;
            }

            else if(busChoice.value==="Books and Stationery"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Fiction Books">Fiction Books</option>
                <option value="Non-Fiction Books">Non-Fiction Books</option>
                <option value="Educational Materials">Educational Materials</option>
                <option value="Office Supplies">Office Supplies</option>`;
            }

            else if(busChoice.value==="Clothing and Apparel"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Men's Clothing">Men's Clothing</option>
                <option value="Women's Clothing">Women's Clothing</option>
                <option value="Children's Clothing">Children's Clothing</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>`;
            }

            else if(busChoice.value==="Construction"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Building Materials">Building Materials</option>
                <option value="Tools and Equipment">Tools and Equipment</option>
                <option value="Safety Gear">Safety Gear</option>`;
            }

            else if(busChoice.value==="Electronics"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Computers">Computers</option>
                <option value="Mobile Phones">Mobile Phones</option>
                <option value="Televisions">Televisions</option>
                <option value="Cameras">Cameras</option>
                <option value="Accessories">Accessories</option>`;
            }

            else if(busChoice.value==="Clothing and Apparel"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Men's Clothing">Men's Clothing</option>
                <option value="Women's Clothing">Women's Clothing</option>
                <option value="Children's Clothing">Children's Clothing</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>`;
            }

            else if(busChoice.value==="Food and Beverages"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Fresh Produce">Fresh Produce</option>
                <option value="Packaged Foods">Packaged Foods</option>
                <option value="Beverages">Beverages</option>
                <option value="Dairy Products">Dairy Products</option>
                <option value="Frozen Foods">Frozen Foods</option>`;
            }

            else if(busChoice.value==="Furniture"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Office Furniture">Office Furniture</option>
                <option value="Home Furniture">Home Furniture</option>
                <option value="Outdoor Furniture">Outdoor Furniture</option>`;
            }

            else if(busChoice.value==="Health and Beauty"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Skincare Products">Skincare Products</option>
                <option value="Haircare Products">Haircare Products</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Supplements">Supplements</option>
                <option value="Medical Supplies">Medical Supplies</option>`;
            }

            else if(busChoice.value==="Home and Kitchen"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Kitchen Appliances">Kitchen Appliances</option>
                <option value="Cookware">Cookware</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Cleaning Supplies">Cleaning Supplies</option>`;
            }

            else if(busChoice.value==="Hospitality"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Kitchen Supplies">Kitchen Supplies</option>
                <option value="Bedding and Linens">Bedding and Linens</option>
                <option value="Cleaning Supplies">Cleaning Supplies</option>`;
            }

            else if(busChoice.value==="Pharmaceuticals"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Prescription Drugs">Prescription Drugs</option>
                <option value="Over-the-Counter Drugs">Over-the-Counter Drugs</option>
                <option value="Medical Devices">Medical Devices</option>`;
            }

            else if(busChoice.value==="Sports and Outdoors"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Fitness Equipment">Fitness Equipment</option>
                <option value="Outdoor Gear">Outdoor Gear</option>
                <option value="Sports Apparel">Sports Apparel</option>
                <option value="Camping Gear">Camping Gear</option>`;
            }

            else if(busChoice.value==="Technology"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Software">Software</option>
                <option value="Hardware Components">Hardware Components</option>
                <option value="Networking Equipment">Networking Equipment</option>`;
            }

            else if(busChoice.value==="Toys and Games"&&catChoice.disabled===false){
                catChoice.innerHTML =
                `<option value="Action Figures">Action Figures</option>
                <option value="Board Games">Board Games</option>
                <option value="Puzzles">Puzzles</option>
                <option value="Educational Toys">Educational Toys</option>`;
            }
        }
    });

    //add event listener to generate filter fields
            const filterbox = document.getElementById("filterchoices");
            filterbox.addEventListener("change", async()=>{
                const filtername = document.getElementById("fbox2");

                 if(filterbox.value==="None"){
                    filtername.innerHTML="";
                    // Reload the page with the updated info
                    location.reload();
                 }
                 else{
                    filtername.innerHTML=
                    `<label for="textbox">${filterbox.value} name:</label>
                    <select id="filternames" name="fchoices">
                    </select>`;


                 const fchoices = document.getElementById("filternames");
                 let newchoice;

                //grab data corresponding to selected category from db
                const res = await fetch(`/inventory/${filterbox.value}`);
                let data = await res.json();

                    for(let element of data){
                        newchoice = document.createElement("option");
                        newchoice.value = element;
                        newchoice.innerText= element;
                        fchoices.appendChild(newchoice);
                    }
                    //filter inventory list according to selected category name
                    fchoices.addEventListener("click", async()=>{
                        const filterField = filterbox.value;
                        const filterValue = fchoices.value;

                        console.log(`${filterField}${filterValue}`);
                        const res = await fetch(`/inventory?format=json&${filterField}=${filterValue}`);
                        let data = await res.json();
                        console.log(data);
                        // // Reload the page with the updated info
                        createRows(data);
                    });

                }
            });



    //addEventListener function for when the price, markup and sale price is entered

    const addEventListnerCalc = (currentRow)=>{
        const cost = document.getElementById(`cp${currentRow}`);
        const mark = document.getElementById(`mark${currentRow}`);
        const sale = document.getElementById(`sp${currentRow}`);

        sale.addEventListener("blur", ()=>{
            if(cost.value&&sale.value){
                const val = ((Number(sale.value)-(Number(cost.value)))*100)/Number(cost.value);
                if(mark.val!==val){
                    mark.value = val;
                }
            }
        });

        cost.addEventListener("blur", ()=>{
            if(cost.value&&sale.value){
                const val = ((Number(sale.value)-(Number(cost.value)))*100)/Number(cost.value);
                if(mark.val!==val){
                    mark.value = val;
                }
            }
        });


        mark.addEventListener("blur", ()=>{
            if(cost.value&&mark.value){
                const val = (Number(cost.value)*(Number(mark.value)+100))/100;
                if(sale.value!==val){
                    sale.value = val;
                }
            }
        });

        cost.addEventListener("blur", ()=>{
            if(cost.value&&mark.value){
                const val = (Number(cost.value)*(Number(mark.value)+100))/100;
                if(sale.value!==val){
                    sale.value = val;
                }
            }
        });

    }

    const currentRow = document.getElementsByClassName("rowNum").length;
    addEventListnerCalc(currentRow);

    //load database state
    const res = await fetch("/inventory?format=json");
    let data = await res.json();

let createRows = (data)=>{
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";
    for (let i=0; i<=data.length; i++){
        const newRow = document.createElement("tr");
        newRow.id=`tableRow${i+1}`;

        if(i<data.length){
            //populating the table with info from the database
            newRow.innerHTML=`
                    <td id="c1" class="rowNum" name="r${i+1}">${data[i].id}</td>
                    <td id="c2">
                        <input type="text" id="textbox" name="r${i+1}" value = "${data[i].name}"  readOnly = true placeholder="Enter product name...">
                    </td>
                    <td id="c3">
                        <input type="text" id="textbox" name="r${i+1}" value = "${data[i].manufacturer}" readOnly = true placeholder="Enter brand name...">
                    </td>
                    <td id="c4">
                        <input type="text" id="textbox" name="r${i+1}" value = "${data[i].supplier}" readOnly = true placeholder="Enter supplier name...">
                    </td>
                    <td id="c5">
                        <select id="choices" name="r${i+1}c">
                            <option value="${data[i].category}">${data[i].category}</option>
                        </select>
                    </td>
                    <td id="c6">
                        <input type="number" id="textbox" name="r${i+1}" value = ${data[i].units} readOnly = true min="1" placeholder="Enter # of units...">
                    </td>
                    <td id="c7">
                        <input type="number" id = "cp${i+1}" name="r${i+1}" value = ${data[i].costPrice} readOnly = true min="1" placeholder="Enter cost price...">
                    </td>
                    <td id="c8">
                        <input type="number" id="mark${i+1}" name="r${i+1}" value = ${((data[i].salePrice-data[i].costPrice)/data[i].costPrice)*100} readOnly = true min="1" placeholder="Enter markup %...">
                    </td>
                    <td id="c9">
                        <input type="number" id="sp${i+1}" name="r${i+1}" value = ${data[i].salePrice} readOnly = true min="1" placeholder="Enter sale price...">
                    </td>`;
            tbody.appendChild(newRow);
            addEventListnerCalc(i+1);
            const rowIcons = document.createElement("td");
            rowIcons.id="icons";
            rowIcons.innerHTML=`
            <button id="editrow${i+1}">✏️</button>
            <button id="deleterow${i+1}">❌</button>`;
            const tableR = document.getElementById(`tableRow${i+1}`);
            tableR.appendChild(rowIcons);
            const r1choice = document.getElementsByName(`r${i+1}c`)[0];
            r1choice.disabled=true;

            //add functionality to edit a row
            const edit = document.getElementById(`editrow${i+1}`);
            edit.addEventListener("click", async()=>{
                r1choice.disabled=false;
                const arr = document.getElementsByName(`r${i+1}`);
                arr.forEach((element)=>{
                element.readOnly = false;
                });
                edit.innerHTML="✔️";
            const product_id = document.getElementsByName(`r${i+1}`)[0].innerText;
            edit.addEventListener("click", async()=>{
            //update database with the changes
                await fetch(`/inventory/${product_id}`, {

                    method: "PUT",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        product_id: Number(product_id),
                        product_name: ((document.getElementsByName(`r${i+1}`)[1]).value).toLowerCase(),
                        manufacturer: ((document.getElementsByName(`r${i+1}`)[2]).value).toLowerCase(),
                        supplier: ((document.getElementsByName(`r${i+1}`)[3]).value).toLowerCase(),
                        category: document.getElementsByName(`r${i+1}c`)[0].value,
                        units: Number((document.getElementsByName(`r${i+1}`)[4]).value),
                        costPrice: Number((document.getElementsByName(`r${i+1}`)[5]).value),
                        markup: Number((document.getElementsByName(`r${i+1}`)[6]).value),
                        salePrice: Number((document.getElementsByName(`r${i+1}`)[7]).value)
                    })
                })

                r1choice.disabled=true;
                arr.forEach((element)=>{
                    element.readOnly = true;
                    });
                edit.innerHTML="✏️";
            });
         });

         //add functionality to delete a row
         const deleteRow = document.getElementById(`deleterow${i+1}`);
         deleteRow.addEventListener("click", async()=>{
         const productId = document.getElementsByName(`r${i+1}`)[0].innerText;
         const productName =  (document.getElementsByName(`r${i+1}`)[1]).value;

           const confirmation = confirm (`Do you really want to delete product ${productId} ${productName}?`)

            if(confirmation){
                //update database with the changes
                await fetch(`/inventory/${productId}`, {

                    method: "DELETE",
                    headers : {
                        "Content-Type" : "application/json"
                    }
                 })
                 // Reload the page with the updated info
                location.reload();
            }

         })
        }

        //add the latest blank row
        if (i === data.length){
            newRow.innerHTML=`
            <td id="c1" class="rowNum" name="r${i+1}"></td>
            <td id="c2">
                <input type="text" id="textbox" class="lastrow" name="r${i+1}" placeholder="Enter product name... "required>
            </td>
            <td id="c3">
                <input type="text" id="textbox" class="lastrow" name="r${i+1}" placeholder="Enter brand name..."required>
            </td>
            <td id="c4">
                <input type="text" id="textbox" class="lastrow" name="r${i+1}" placeholder="Enter supplier name..."required>
            </td>
            <td id="c5">
                <select id="choices" name="r${i+1}c">
                    <option value="option1">Seeds and Plants</option>
                    <option value="option2">Fertilizers</option>
                    <option value="option3">Farming Equipment</option>
                </select>
            </td>
            <td id="c6">
                <input type="number" id="textbox" class="lastrow" name="r${i+1}" min="1" placeholder="Enter # of units..."required>
            </td>
            <td id="c7">
                <input type="number" id = "cp${i+1}" class="lastrow" name="r${i+1}" min="1" placeholder="Enter cost price..."required>
            </td>
            <td id="c8">
                <input type="number" id="mark${i+1}" class="lastrow" name="r${i+1}" min="1" placeholder="Enter markup %..."required>
            </td>
            <td id="c9">
                <input type="number" id="sp${i+1}" class="lastrow" name="r${i+1}" min="1" placeholder="Enter sale price..."required>
            </td>`;
        tbody.appendChild(newRow);
        addEventListnerCalc(i+1);
        }
    }
}

createRows(data);
    //listener event for when the save button is pressed
    const save = document.getElementById("saverow");
    save.addEventListener("click", async()=>{
        const lastrow = document.getElementsByClassName("lastrow");
        const currentRow = document.getElementsByClassName("rowNum").length;
    for (let item of lastrow){
        if(item.value===""){
            item.focus();
            break;
        }

        else if(item===lastrow[lastrow.length-1]){
            //back-end databse and server code
                await fetch("/inventory", {

                    method: "POST",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        product_name: ((document.getElementsByName(`r${currentRow}`)[1]).value).toLowerCase(),
                        manufacturer: ((document.getElementsByName(`r${currentRow}`)[2]).value).toLowerCase(),
                        supplier: ((document.getElementsByName(`r${currentRow}`)[3]).value).toLowerCase(),
                        category: document.getElementsByName(`r${currentRow}c`)[0].value,
                        units: Number((document.getElementsByName(`r${currentRow}`)[4]).value),
                        costPrice: Number((document.getElementsByName(`r${currentRow}`)[5]).value),
                        markup: Number((document.getElementsByName(`r${currentRow}`)[6]).value),
                        salePrice: Number((document.getElementsByName(`r${currentRow}`)[7]).value)
                    })
                });

                // Reload the page with the updated info
                location.reload();

            }
    }

    });

    }catch(err){
        console.error("Something went wrong...");
    }




});

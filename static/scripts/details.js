//add event listener on page load
window.addEventListener("DOMContentLoaded", async()=>{

    try{
        const urlArr = (window.location.href.split("/"));
        const id = urlArr[urlArr.length-1];

        const res = await fetch(`/sales/${id}?format=json`);
        const data = await res.json();
        console.log(data);
        if (data.error){

            const confirmation = confirm (`Receipt not found. Go back to sales?`);
            if(confirmation){
                window.location.href = "/sales";
            }

        }

        else{
            const lastRow = ((data[0].products).length);

            //extract the relevant information from the date string
            const fullDate = data[0].date;
            const date1 = fullDate.slice(0,10);
            const date2 = fullDate.slice(11, 16);

            //update page variables
            const title = document.getElementById("title");
            title.innerText = `Sales Receipt ${id}`;

            const h1 = document.getElementById("h1");
            h1.innerText = `Sales Receipt`;

            const invoiceId = document.getElementById("invoiceId");
            invoiceId.innerText = `Receipt # ${id}`;

            const date = document.getElementById("date");
            date.innerText = `Receipt Date: ${date1}`;

            const time = document.getElementById("time");
            time.innerText =`Time of Sale: ${date2}`;

            const tableBody = document.getElementById("tableBody");

            let neatNum = (number)=>{
                if(Number.isInteger(number)){
                    return( (`${number}.00`));
                }
                else {
                    strNum = number.toString();
                    arrNum = strNum.split(".");
                    if (arrNum[1].length===1){
                        arrNum[1] = arrNum[1]+"0";
                        return(arrNum.join("."));
                    }
                }
            }

            for (let i=0; i<lastRow; i++){

                //let price be displayed with 2 dp
                const unitPrice = neatNum(data[0].unitPrice[i]);
                const price = neatNum(data[0].price[i]);

                const newRow = document.createElement("tr");
                newRow.id = `tableRow${i+1}`;
                newRow.innerHTML = `
                    <td id="c1"><text name="number">${i+1}</text></td>
                    <td id="c2"><text name="product">${data[0].products[i]}</text></td>
                    <td id="c3"><text name="units">${data[0].units[i]}</text></td>
                    <td id="c3"><text name="unitPrice">${unitPrice}</text></td>
                    <td id="c4"><text name="price">${price}</text></td>
                    </td>`;
                tableBody.appendChild(newRow);
            }
            const totalPrice = neatNum(data[0].totalPrice);
            const lRow = document.createElement("tr");
                lRow.id = "lastrow";
                    lRow.innerHTML = `
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><text id="total">Total Amount:</text></td>
                        <td><text id="sum">$ ${totalPrice}</text></td>
                    `;
                tableBody.appendChild(lRow);



            //add functionality to back button
            const backbtn = document.getElementById("back");
            backbtn.addEventListener("click", () => {
                window.location.href = "/sales";
            });

            //add functionality to print button
            const printbtn = document.getElementById("print");
            printbtn.addEventListener("click", () => {
                    window.print();
            });
        }


    }catch(err){
        console.error(`Error: ${err.stack}`);
    }
});

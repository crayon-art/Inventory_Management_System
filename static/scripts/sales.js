//function to store table title in local storage
let storeTitle = (myTitle)=>{
    localStorage.setItem("Title2", myTitle);
};

//function to restore title
let restoreTitle = ()=>{
    var storedTitle = localStorage.getItem("Title2");
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

        const newsale = document.getElementById("newsalebtn");

        newsale.addEventListener("click", ()=>{
            window.location.href = "sales/newsale";
        });

        //load sales invoice data from the database
        const res = await fetch("/sales?format=json");
        const data = await res.json();

        //function to convert date format to dd/mm/yy
       formatDate = (dateString) =>{

            // Extract the day, month, and year
            formattedDate = dateString.slice(0, 10);
            return formattedDate;
        }

        //const date = formatDate(data.date);

        const tableBody = document.getElementById("tableBody");

        for (let i=0; i<data.length; i++){

            //convert data to appropriate form
            const  id = data[i].id;
            const  price = (data[i].price).toFixed(2);
            const date = formatDate(data[i].date);

            //update the sales table
            const newRow = document.createElement("tr");
            newRow.id = `tableRow${i+1}`;
            newRow.innerHTML = `
                <td id="c1"><text name="r${i+1}">${id}</text></td>
                <td id="c2"><text name="r${i+1}">${date}</text></td>
                <td id="c3"><text name="price">${price}</text></td>
                <td id="c4"><button id="vd${i+1}">📋 view details</button></td>
                <td id="c5"><button id="d${i+1}">❌</button></td>
            `;
            tableBody.appendChild(newRow);
            const details = document.getElementById(`vd${i+1}`);
            details.addEventListener("click", async()=>{
                window.location.href = `sales/${id}`;
            });

            //add functionality to delete a row
            const deleteRow = document.getElementById(`d${i+1}`);
            deleteRow.addEventListener("click", async()=>{

            const confirmation = confirm (`Do you really want to delete receipt ${id}?`);

                if(confirmation){
                    //update database with the changes
                    await fetch(`/sales/${id}`, {

                        method: "DELETE",
                        headers : {
                            "Content-Type" : "application/json"
                        }
                    })

                   // Reload the page with the updated info
                    location.reload();
                }
            });
        }

        //add home button functionality
        const home = document.getElementById("home");
        home.addEventListener("click", ()=>{
            window.location.href = "/";
        });

    }catch(err){
        console.error(`Error: ${err.stack}`);
    }
});

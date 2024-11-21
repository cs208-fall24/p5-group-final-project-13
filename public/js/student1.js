
function openForm(id) {
    console.log("open: " + id);
    document.getElementById("myForm" + id).style.display = "block";
    document.getElementById("open-button" + id).style.display = "none";
    }
    
  function closeForm(id) {
    console.log("close: " + id);
    document.getElementById("myForm" + id).style.display = "none";
    document.getElementById("open-button" + id).style.display = "block";
  } 
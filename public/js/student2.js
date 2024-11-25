// Function to open a form based on the provided id
function openForm(id) {
  // Log the action with the id to the console for debugging purposes
  console.log("open: " + id);
  
  // Change the display style of the form with the corresponding id to "block" (making it visible)
  document.getElementById("myForm" + id).style.display = "block";
  
  // Change the display style of the open button with the corresponding id to "none" (hiding the button)
  document.getElementById("open-button" + id).style.display = "none";
}

// Function to close a form based on the provided id
function closeForm(id) {
  // Log the action with the id to the console for debugging purposes
  console.log("close: " + id);
  
  // Change the display style of the form with the corresponding id to "none" (hiding the form)
  document.getElementById("myForm" + id).style.display = "none";
  
  // Change the display style of the open button with the corresponding id to "block" (making the button visible again)
  document.getElementById("open-button" + id).style.display = "block";
}

document.getElementById('deleteButton').addEventListener('click', function() {
    fetch('/click', { method: 'POST' })
        .then(response => response.text())
        .then(data => console.log(data));
});``
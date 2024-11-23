document.addEventListener('DOMContentLoaded', function () {
  const editLinks = document.querySelectorAll('a[href="#editForm"]');
  editLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();  
      const commentId = this.getAttribute('data-id');
      const commentText = this.getAttribute('data-comment');
      document.getElementById('editId').value = commentId;  
      document.getElementById('editText').value = commentText; 
      document.getElementById('editForm').style.display = 'block';
    })
  })
});


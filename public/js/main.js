var trash = document.getElementsByClassName("fa-trash");

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const _id = this.parentNode.parentNode.getAttribute('id')
    fetch('api/bids', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        '_id': _id
      })
    }).then(function (response) {
      console.log(response)
      window.location.reload()
    })
  });
});

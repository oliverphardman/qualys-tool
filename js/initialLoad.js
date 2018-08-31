document.addEventListener('DOMContentLoaded', function () {
  if(auth){
    setTimeout(() => {
      document.location.href = "main.html"
    }, 500)
  }else{
    setTimeout(() => {
      document.location.href = "authenticate.html"
    }, 500)
  }
})

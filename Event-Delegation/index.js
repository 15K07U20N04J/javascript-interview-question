// document.querySelector('#category').addEventListener("click", (e) => {
//     window.location.href = '/' + e.target.id;
// })

document.querySelector('#form').addEventListener("keyup", (e) => {
    debugger
    if(e.target.dataset.uppercase != undefined) {
        e.target.value = e.target.value.toUpperCase();
    }
})
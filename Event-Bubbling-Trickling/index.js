// document.querySelector('#grandparent').addEventListener('click', function(e) {
//     console.log('Grandparent Clicked');
// }, false);

// document.querySelector('#parent').addEventListener('click', function(e) {
//     console.log('Parent Clicked');
//     e.stopPropagation();
// }, false);

// document.querySelector('#child').addEventListener('click', function(e) {
//     console.log('Child Clicked');
// }, false);

document.querySelector('#grandparent').addEventListener('click', function(e) {
    console.log('Grandparent Clicked');
}, true);

document.querySelector('#parent').addEventListener('click', function(e) {
    console.log('Parent Clicked');
    e.stopPropagation();
}, true);

document.querySelector('#child').addEventListener('click', function(e) {
    console.log('Child Clicked');
}, true);
// get the viewport height and multiply by 1% to get vh unit
// set --vh custom property to CSS
// this allows the app to render correctly on mobile devices
let vh = window.innerHeight * 0.01;
let vw = window.innerWidth * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
document.documentElement.style.setProperty('--vw', `${vw}px`);

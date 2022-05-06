function changeSize(elem, amount) {
   let currSizeString = window.getComputedStyle(elem).getPropertyValue('font-size');
   let currSize = parseFloat(currSizeString);
   elem.style.fontSize = (currSize + amount) + 'px';
}

const makeBigger = () => {
   changeSize(document.querySelector(".content"), 5);
   changeSize(document.querySelector("h1"), 5);
};

const makeSmaller = () => {
   changeSize(document.querySelector(".content"), -5);
   changeSize(document.querySelector("h1"), -5);
};


document.querySelector("#a1").addEventListener('click', makeBigger);
document.querySelector("#a2").addEventListener('click', makeSmaller);


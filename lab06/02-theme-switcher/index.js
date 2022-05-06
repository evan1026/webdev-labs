function setTheme(theme) {
    document.querySelector("body").className = theme;
}

document.querySelector("#default").addEventListener('click', () => setTheme(""));
document.querySelector("#desert").addEventListener('click', () => setTheme("desert"));
document.querySelector("#ocean").addEventListener('click', () => setTheme("ocean"));
document.querySelector("#high-contrast").addEventListener('click', () => setTheme("high-contrast"));
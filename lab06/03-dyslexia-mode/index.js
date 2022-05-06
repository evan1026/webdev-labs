function toggleDyslexia() {
    let isPressed = window.localStorage.getItem('dyslexic') === 'true';
    setDyslexia(!isPressed);
}

function setDyslexia(isDyslexia) {
    document.getElementById('dyslexia-toggle').setAttribute('aria-pressed', isDyslexia);
    if (document.body.classList.contains('dyslexia-mode') !== isDyslexia) {
        document.body.classList.toggle('dyslexia-mode');
    }
    window.localStorage.setItem('dyslexic', String(isDyslexia));
}

document.querySelector("#dyslexia-toggle").addEventListener('click', toggleDyslexia);
setDyslexia(window.localStorage.getItem('dyslexic') === 'true');

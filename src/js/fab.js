const hideFAB = () => {
    let fab = document.querySelector('.fab');
    fab.style.transform = 'translate3d(150%, 0, 0)';
    fab.style.transition = '400ms';
}

const showFAB = () => {
    let fab = document.querySelector('.fab');
    fab.style.transform = 'translate3d(0, 0, 0)';
    fab.style.transition = '400ms';
}

export {hideFAB, showFAB}
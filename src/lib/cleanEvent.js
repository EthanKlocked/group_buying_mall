const cleanEvent = (id) => {
    if(window.self != window.top){ //only for iframe
        const element = document.querySelector(`#${id}`);
        const clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
    }
}

export default cleanEvent;
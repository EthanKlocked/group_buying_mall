import { isMobile } from "react-device-detect";

const touchSlide = (id, type) => {
    if(!isMobile && window.self != window.top){ //only for web iframe
        try{
            const slider = document.querySelector(`#${id}`);
            let isDown = false;
            let start;
            let scroll;
            let reactivate = false;

            slider.addEventListener('mousedown', e => {
                isDown = true;
                start = type == 'x' ? e.pageX - slider.offsetLeft : e.pageY - slider.offsetTop;
                scroll = type == 'x' ? slider.scrollLeft : slider.scrollTop;
                reactivate = false;
            });
            
            slider.addEventListener('mouseleave', () => {
                isDown = false;
                reactivate = false;
            });
            
            slider.addEventListener('mouseup', () => {
                isDown = false;
            });
            
            slider.addEventListener('mousemove', e => {
                if (!isDown) return; 
                e.preventDefault();
                const typeValue = type == 'x' ? e.pageX - slider.offsetLeft : e.pageY - slider.offsetTop;
                const walk = typeValue - start;
                if(type=='x') slider.scrollLeft = scroll - walk;
                if(type=='y') slider.scrollTop = scroll - walk;
                if(!reactivate) reactivate = true;
            });

            slider.addEventListener('click', e =>{
                if(reactivate) e.stopPropagation();
            });    
        }catch{
            console.log("touchSlide Failed to be Added");
        }
    }
}

export default touchSlide;


import Sweetalert from 'sweetalert2';

const Toast = Sweetalert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Sweetalert.stopTimer)
        toast.addEventListener('mouseleave', Sweetalert.resumeTimer)
    }
})

export {
    Toast
};
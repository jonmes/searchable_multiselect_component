export default {
    mounted(el, binding){
        el.style.visibility = !!binding.value ? 'visible' : 'hidden';
    }
}
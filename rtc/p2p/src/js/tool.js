export default {
    debounce(fn, t = 500) {
        let lastTime;
        return () => {
            clearTimeout(lastTime);
            const [that, args] = [this, arguments];
            lastTime = setTimeout(() => {
                fn.apply(that, args);
            }, t);
        }
    },
    throttle(func, t = 500) {
        var timeout;
        return () => {
            var context = this;
            var args = arguments;
            if (!timeout) {
                timeout = setTimeout(() => {
                    func.apply(context, args)
                    clearTimeout(timeout)
                    timeout = null
                }, t)
            }
        }
    },
    decimalToDMS(decimal, isLng) {  
        var d = Math.abs(decimal);
        var deg = Math.floor(d);
        var min = Math.floor((d - deg) * 60);
        var sec = Math.round((d - deg - min / 60) * 3600 * 100); 
        var str = isLng ? (decimal < 0 ? '西经' : '东经') : (decimal < 0 ? '南纬' : '北纬');
        return `${str}${deg}°${min}′${sec}″`;
    }
}
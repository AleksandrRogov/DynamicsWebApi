Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};
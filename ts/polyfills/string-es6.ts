String.prototype.endsWith = function (searchString: string, position?: number): boolean {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.lastIndexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
};

String.prototype.startsWith = function (searchString: string, position?: number): boolean {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
};
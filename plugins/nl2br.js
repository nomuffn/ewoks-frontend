export default (context, inject) => {
    const nl2br = (string) => {
        return string.replace(/(?:\r\n|\r|\n)/g, "<br />");
    };
    inject("nl2br", nl2br);
    context.$nl2br = nl2br;
};

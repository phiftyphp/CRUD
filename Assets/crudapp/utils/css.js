import uri from "./uri";
module.exports = {
  "url": function(url) {
    return 'url(' + url.split('/').map(uri.fixedEncodeURIComponent).join('/') + ')';
  },
  "backgroundSize": function(d) {
    if (typeof d === "object") {
      return d.width + ' ' + d.height;
    }
    if (typeof d === "string") {
      return d;
    }
    return "contain";
  }
};

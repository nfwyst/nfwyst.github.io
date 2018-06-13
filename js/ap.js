(function(document, window) {
    var _resolve = {  }

    _resolve.each = function(se, fn) {
        var eles = document.querySelectorAll(se);
        for (var i = 0; i < eles.length; i++) {
            fn(eles[i], i)
        }
    }

    _resolve.d = function(el, i) {
        el.innerHTML = '🍎'
    }

    if ( window.innerWidth <= 990 )
        _resolve.each('.site-title', _resolve.d)

    if (document.title === '| nfwyst') {
      document.title = '关于 | nfwyst'
    }

}(document, window));

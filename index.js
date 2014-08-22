module.exports = function (node) {
  var ractive = node._ractive;
  var init = true;
  var lock = false;
  var observer = null;

  jQuery(node)
    .dropkick()
    .on('change', function () {
      if (lock) return;
      lock = true;
      ractive.root.updateModel();
      lock = false;
    });

  if (ractive.binding) {
    var keypath = ractive.binding.keypath;
    observer = ractive.root.observe(keypath, function (val) {
      if (init) return init = false;
      if (lock) return;
      lock = true;
      jQuery(node).dropkick('setValue', val);
      lock = false;
    });
  }

  return {
    teardown: function () {
      jQuery(node).dropkick('destroy');
      if (observer) observer.cancel();
    }
  }
};

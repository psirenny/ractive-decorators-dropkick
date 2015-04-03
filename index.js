module.exports = function (node) {
  var ractive = node._ractive;
  var init = true;
  var lock = false;
  var observers = [];

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
    if (typeof keypath === 'object') keypath = keypath.str;
    observers.push(ractive.root.observe(keypath, function (val) {
      if (init) return init = false;
      if (lock) return;
      lock = true;
      jQuery(node).dropkick('setValue', val);
      lock = false;
    }));
  }

  ractive.proxy.attributes.forEach(function (attr) {
    if (attr.name !== 'disabled') return;
    var keypath = attr.interpolator.keypath;
    if (typeof keypath === 'object') keypath = keypath.str;
    observers.push(ractive.root.observe(keypath, function (val) {
      jQuery(node).dropkick('disable', val);
    }));
  });

  return {
    teardown: function () {
      jQuery(node).dropkick('destroy');
      observers.forEach(function (obs) {
        obs.cancel();
      })
    }
  }
};

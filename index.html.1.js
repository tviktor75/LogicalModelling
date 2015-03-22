
  // Init load event.
  var loadInput = document.getElementById('localLoad');
  loadInput.addEventListener('change', localLoad, false);
  document.getElementById('fakeload').onclick = function() {loadInput.click();};
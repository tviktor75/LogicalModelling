'use strict';

// Create a namespace.
var ModelStorage = {};

/**
 * Backup code blocks to localStorage.
 * @private
 */
ModelStorage.backupBlocks_ = function() {
  		var txt = Ext.util.JSON.encode(new JSONSerializer().toJSON(workflow.getDocument()));
		txt = txt.replace(/,"/g, ', "');
  
		var data = "json_diagram = " + txt;
    // Gets the current URL, not including the hash.
    var url = window.location.href.split('#')[0];
    window.localStorage.setItem(url, data);
		window.alert('backup created');
};

/**
 * Bind the localStorage backup function to the unload event.
 */
ModelStorage.backupOnUnload = function() {window.addEventListener('unload', ModelStorage.backupBlocks_, false);};
/**
 * Restore code blocks from localStorage.
 */
ModelStorage.restoreBlocks = function() {
  var url = window.location.href.split('#')[0];
  if (window.localStorage[url]) {
     new JSONSerializer().fromJSON(Ext.util.JSON.decode(window.localStorage[url]));
  }
};

ModelStorage.loadJSONtext = function(aText) {
  new JSONSerializer().fromJSON(Ext.util.JSON.decode(aText));
}

ModelStorage.loadJSON = function(aFile) {
  //ModelStorage.loadJSONtext('json_diagram = {"figures":[]}');
	//location.reload();
	loadJavascript(aFile, function(el) {
    new JSONSerializer().fromJSON(json_diagram);
  });
}

ModelStorage.doSaveJSONtoFile = function() {
  var txt = Ext.util.JSON.encode(new JSONSerializer().toJSON(workflow.getDocument()));
  txt = txt.replace(/,"/g, ', "');
  //document.getElementById('json_text').value = "json_diagram = " + txt + "\n\n\n\n";
  
	var data = "json_diagram = " + txt;
  // Store data in blob.
  var builder = new BlobBuilder();
  builder.append(data);
  var filename = 'diagram.json';
  if (document.getElementById('json_load_url').value!='') {filename = document.getElementById('json_load_url').value+'.json';}
  saveAs(builder.getBlob('text/plain;charset=utf-8'), filename);
};

ModelStorage.doLoadJSONFromFile = function() {
  ModelStorage.loadJSONtext('json_diagram = {"figures":[]}');
	ModelStorage.loadJSON(document.getElementById('json_load_url').value+'.json');
}
ModelStorage.ClearModel = function() {
	var list = document.getElementById("paintarea");
	while (list.hasChildNodes()) {   
    list.removeChild(list.firstChild);
	}
}
/**
 * Load blocks from local file.
 * @param {!Event} event Upload event.
 */
function localLoad(event) { 
  var files = event.target.files;
  // Only allow uploading one file.
  if (files.length != 1) {
    return;
  }

  // FileReader
  var reader = new FileReader();
  reader.onloadend = function(event) {
    var target = event.target;
    // 2 == FileReader.DONE
    if (target.readyState == 2) {
      try {
        ModelStorage.loadJSONtext(target.result);
      } catch (e) {
        alert('Error parsing JSON file:\n' + e);
        return;
      }

    }
    // Reset value of input after loading because Chrome will not fire
    // a 'change' event if the same file is loaded again.
    document.getElementById('localLoad').value = '';
  };
  reader.readAsText(files[0]);
}

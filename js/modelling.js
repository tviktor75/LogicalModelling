function addOnloadHandler(elementObject, functionObject)
	{
		if(typeof(appLog) != 'undefined') {
			//appLog("addOnloadHandler: " + elementObject.id);
		}
		if(document.addEventListener) {
			elementObject.addEventListener('load', function(e) { functionObject(elementObject); }, false);
		} else {
			if(document.attachEvent) {
				elementObject.onreadystatechange = function(e) {
					 // From: http://simonwillison.net/2004/May/26/addLoadEvent/
					 // modded since MSIE showed the state as "loaded"
					 var state = elementObject.readyState;
					 // && state != "interactive"  "complete"
					 //appLog("LOADING: " + elementObject.id + ": "+ state);

					 // MSIE gives the state of "complete" for the last loaded object
					 if (state != "loaded" && state != "complete") {
						 return;
					 }
					 //elementObject.onreadystatechange = null;
					 functionObject(elementObject);
					 };
			} else {
				alert("Could not bind the onLoad handler to an element!");
			}
		}
	}

	function removeElement(e) {
		var aNodeToRemove = e;// : document.getElementById(e);
		if (aNodeToRemove.parentNode) {
			aNodeToRemove.parentNode.removeChild(aNodeToRemove);
		}
	}

	function bootstrapGetLoadscriptNode(aURI)
	{
		var element;
		var aID = "script_" + aURI.replace(/[\//\.:-]/g,"_");
		removeElement(aID);
		element = document.createElement("script");
		element.setAttribute('id',aID);

		aURI = aURI + "?_=" + (new Date()).getTime();

		element.setAttribute('src',aURI);
		element.setAttribute('type', "text/javascript");

		return element;
	}


	function loadJavascript(aURI, aCallback)
	{
		var element = bootstrapGetLoadscriptNode(aURI);
		addOnloadHandler(element, function(el) {
			 aCallback(element);
		} );
		document.getElementsByTagName('head')[0].appendChild(element);
		document.body.appendChild(element);
	}


	function createNewDiv(aID)
	{
		var txt = document.createElement('P');
		var div = document.createElement('span');
		div.setAttribute('id', aID);
		txt.setAttribute('id', aID + "_txt");
		div.appendChild(txt);
		return div;
	}

	function addDragIcon(aName, aWhere) 
	{
		loadJavascript("icons/" + aName + ".js", function() { 
			 if (document.getElementById("cont_" + aName)) {
				 return;
			 }
			 var div = document.getElementById(aWhere);
			 var cdiv = createNewDiv("cont_" + aName);
			 var html = '';
			 html = html + aName + "<img src='icons/" + aName + ".png' id='drag_" + aName + "' style='cursor:move'/><br><br>\n";
			 cdiv.innerHTML = html;
			 div.appendChild(cdiv);
			 var dragsource=new Ext.dd.DragSource('drag_' + aName, {ddGroup:'TreeDD',dragData:{name: aName}});
			 } );
	}

	function addDragIconPic(aName, aWhere, aPic) 
	{
			 if (document.getElementById("cont_" + aName)) {
				 return;
			 }
			 var div = document.getElementById(aWhere);
			 var cdiv = createNewDiv("cont_" + aName);
			 var html = '';
			 html = html + "<center>";
			 html = html + "<h1>" + aName + "</h1>\n";
			 html = html + "<img src='" + aPic + "' id='drag_" + aName + "' style='cursor:move'/>\n";
			 html = html + "<hr size=1 noshade>\n";
			 html = html + "</center>";

			 cdiv.innerHTML = html;
			 div.appendChild(cdiv);
			 var dragsource=new Ext.dd.DragSource('drag_' + aName, {ddGroup:'TreeDD',dragData:{name: 'DiagramFigure', type: aName, pic: aPic }});

	}

	function addDragIcon2(aName, aWhere)
	{
		var aPic = "icons/" + aName + ".png";
		addDragIconPic(aName, aWhere, aPic);
	}

	function addLibraryIcon(aName,aLib)
	{
		addDragIcon2(aName, "icons_div_" + aLib);
	}

	function addLibraryIconText(aName) 
	{
		var txt = document.createElement('P');
		txt.innerHTML = '<a href="javascript:addLibraryIcon(\'' + aName + '\');">' + aName + '</a>';
		document.getElementById("library_div").appendChild(txt);

	}
		
	function createNewIconDiv(aID,aLib)
	{
		var txt = document.createElement('P');
		var div = document.createElement('span');
		div.setAttribute('id', aID);
		txt.setAttribute('id', aID + "_txt");
		div.appendChild(txt);
		document.getElementById("icons_div_" + alib).appendChild(div);
		return div;
	}

	function getQueryVariable(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if (pair[0] == variable) {
				return unescape(pair[1]);
			}
		} 
		return "";
	}

function debug(msg)
{
  var console = document.getElementById("debug");
  console.innerHTML=console.innerHTML+"<br>"+msg;
}
debug("start");
  /**********************************************************************************
   * 
   * Do the Draw2D Stuff
   *
   **********************************************************************************/
  var workflow  = new Workflow("paintarea");

  /**********************************************************************************
   * 
   * Do the Ext (Yahoo UI) Stuff
   *
   **********************************************************************************/
   Example = function(){
            var layout;
            return {
               init : function(){
                  layout = new Ext.BorderLayout(document.body, {
                        west: {
                           split:true,
                           initialSize: 202,
                           minSize: 175,
                           maxSize: 400,
                           titlebar: true,
                           collapsible: true,
													 collapsed: false,
                           autoScroll:true,
													 title: "Elements",
                           animate: true
                        },
                        north: {
                           initialSize: 75,
													 minSize: 50,
                           maxSize: 100,
                           split: false,
                           titlebar: true,
                           title: "Save Load Restore",
													 collapsible: true,
													 collapsed: true,
                           animate: true
                        },
                        south: {
                           initialSize: 130,
                           split:false,
                           titlebar: true,
                           collapsible: true,
													 collapsed: true,
                           autoScroll:true,
                           animate: true
                        },
                        center: {
                           titlebar: true,
                           autoScroll:true,
                           fitToFrame:true
                  }
                  });

								layout.beginUpdate();
								var center = new Ext.ContentPanel('center1', {width:100, height:200, title:'Diagram'});
                  layout.add('south', new Ext.ContentPanel('debug',    {title: 'Debug Console'}));
                  layout.add('north', new Ext.ContentPanel('center3',    {title: 'Toolbar'}));
									layout.add('west',  new Ext.ContentPanel('library_div', {title: 'Library'}));
									layout.add('west',  new Ext.ContentPanel('icons_div_eerm', {title: 'ERM'}));
									layout.add('west',  new Ext.ContentPanel('icons_div_aris', {title: 'ARIS'}));
                  layout.add('center',  new Ext.ContentPanel('center2', {title: 'Info'}));
									layout.add('center',center);
									layout.endUpdate();
                  workflow.scrollArea = document.getElementById("center1").parentNode;

								//case "aris":
									addLibraryIconText('event'); addLibraryIcon('event','aris');
									addLibraryIconText('xor'); addLibraryIcon('xor','aris');
									addLibraryIconText('and'); addLibraryIcon('and','aris');
									addLibraryIconText('or'); addLibraryIcon('or','aris');
									addLibraryIconText('activity'); addLibraryIcon('activity','aris');
									addLibraryIconText('process'); addLibraryIcon('process','aris');
									addLibraryIconText('related_process'); addLibraryIcon('related_process','aris');
									addLibraryIconText('document'); addLibraryIcon('document','aris');
									addLibraryIconText('department'); addLibraryIcon('department','aris');
									addLibraryIconText('group'); addLibraryIcon('group','aris');
									addLibraryIconText('position'); addLibraryIcon('position','aris');
									addLibraryIconText('person'); addLibraryIcon('person','aris');
									addLibraryIconText('external_person'); addLibraryIcon('external_person','aris');
									addLibraryIconText('information_system'); addLibraryIcon('information_system','aris');
									addLibraryIconText('modul'); addLibraryIcon('modul','aris');
									addLibraryIconText('connector'); addLibraryIcon('connector','aris');

								//case "eerm":
									addLibraryIconText('entity'); addLibraryIcon('entity','eerm');
									addLibraryIconText('isa'); addLibraryIcon('isa','eerm');
									addLibraryIconText('isa2'); addLibraryIcon('isa2','eerm');
									addLibraryIconText('property'); addLibraryIcon('property','eerm');
									addLibraryIconText('identifier'); addLibraryIcon('identifier','eerm');
									addLibraryIconText('multi-property'); addLibraryIcon('multi-property','eerm');
									addLibraryIconText('relation'); addLibraryIcon('relation','eerm');


               var droptarget=new Ext.dd.DropTarget("center1",{ddGroup:'TreeDD'});
                   droptarget.notifyDrop=function(dd, e, data)
                   {
                        if(data.name)
                        {
                           var xOffset    = workflow.getAbsoluteX();
                           var yOffset    = workflow.getAbsoluteY();
                           var scrollLeft = workflow.getScrollLeft();
                           var scrollTop  = workflow.getScrollTop();
                           if(typeof(data.pic) != "undefined") {
			     var el = document.getElementById("drag_" + data.type);
			     var aWidth = 32;
			     var aHeight = 32;
			     if (el) {
			       aWidth = el.width;
			       aHeight = el.height;
			     }
			     var aFig = eval("new "+data.name+"()");
			     aFig.setDimension(aWidth, aHeight);
			     aFig.setPic(data.pic);
			     aFig.subtype = data.type;

                             workflow.addFigure(aFig,e.xy[0]-xOffset+scrollLeft,e.xy[1]-yOffset+scrollTop);

			   } else {
                             workflow.addFigure(eval("new "+data.name+"()"),e.xy[0]-xOffset+scrollLeft,e.xy[1]-yOffset+scrollTop);
			   }
                           return true;
                        }
                   }
                   var aJSON = getQueryVariable("url");
                   if(aJSON != "") {
                       loadJSON(aJSON);
                   }
               }

         };

   }();
   Ext.EventManager.onDocumentReady(Example.init(), Example, true);
   //var simpleToolbar = new Ext.Toolbar('toolbar');
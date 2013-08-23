(function(){

	function imageEditor(){}
	
	imageEditor.imageClick =function(event){
			
			var img = new Image();
			//this引用被单击的图像元素
			img.src = this.src;
			var windowSize = getWindowSize();
			//
			var backdrop = document.createElement('div');
			setStyleById(backdrop,{
				'position':'absolute',
				'background-color':'black',
				'opacity':'0.8',
				'width':windowSize.width,
				'height':windowSize.height,
                'z-index':1000,
				'filter':'alpha(opacity=80)'
			});

			document.body.appendChild(backdrop);
			//alert('imageclick');

			setDimensions(backdrop,{
				'left':0,
				'top':0	,
				'width':windowSize.width,
				'height':windowSize.height						
			});


	}

	imageEditor.init = function(){
		//alert('init');
		addEvent('mintImage','click',imageEditor.imageClick);
	}

	addLoadEvent(imageEditor.init);

	


	//得到浏览器窗口的宽和高
	function getWindowSize(){
		//alert('getWindowSize');
		if(self.innerHeight){
			//w3c
			return {width:self.innerWidth,height:self.innerHeight};
		}else if(document.documentElement && document.documentElement.clientHeight){
			//ie normal			
			return {width:document.documentElement.clientWidth,
				    height:document.documentElement.clientHeight};
		}else if(document.body){
			//ie quirk
			return {width:document.body.clientWidth,height:document.body.clientHeight};
		}
	}
   //得到所给元素的高度，宽度，顶部边距，左侧边距
   function getDimensions(e){
		return {top:e.offsetTop,
			    left:e.offsetLeft,
			width:e.offsetWidth,
			height:e.offseHeight};
   }



   function setDimensions(e,dim,updateMessage){
		updateMessage = updateMessage || false;
		var style = {};
		for(var i in dim){
			if(!dim.hasOwnProperty(i)) continue;
			style[i] = (dim[i] || '0')+'px';
		}
		setStyleById(e,style);
		if(updateMessage){
			imageEditor.elements.cropSizeDisplay.firstChild.nodeValue = dim.width+'x'+dim.height;
		}

   }

   function setStyleById(element, styles) {
		// Retrieve an object reference
		if(!(element = $(element))) return false;
		// Loop through  the styles object an apply each property
		for (property in styles) {
			if(!styles.hasOwnProperty(property)) continue;
		
			if(element.style.setProperty) {
				//DOM2 Style method
				element.style.setProperty(
				uncamelize(property,'-'),styles[property],null);
			} else {
				//Alternative method
				element.style[camelize(property)] = styles[property];
			}
		}
		return true;
	}
	/**
	 * Convert hyphenated word-word strings to camel case wordWord strings.
	 */
	function camelize(s) {
		return s.replace(/-(\w)/g, function (strMatch, p1){
			return p1.toUpperCase();
		});
	}
	/**
	 * Convert camel case wordWord strings to hyphenated word-word strings.
	 */
	function uncamelize(s, sep) {
		sep = sep || '-';
		return s.replace(/([a-z])([A-Z])/g, function (strMatch, p1, p2){
			return p1 + sep + p2.toLowerCase();
		});
	}
	function $() {
		var elements = new Array();
		
		// Find all the elements supplied as arguments
		for (var i = 0; i < arguments.length; i++) {
			var element = arguments[i];
			
			// If the argument is a string assume it's an id
			if (typeof element == 'string') {
				element = document.getElementById(element);
			}
			
			// If only one argument was supplied, return the element immediately
			if (arguments.length == 1) {
				return element;
			}
			
			// Otherwise add it to the array
			elements.push(element);
		}
		
		// Return the array of multiple requested elements
		return elements;
	}

	/**
	 * Register an event listener on an element
	 */
	function addEvent( node, type, listener ) {
		if(!(node = $(node))) return false;
		//alert('addevent');
		
		if (node.addEventListener) {
			// W3C method
			node.addEventListener( type, listener, false );
			return true;
		} else if(node.attachEvent) {
			// MSIE method
			node['e'+type+listener] = listener;
			node[type+listener] = function(){node['e'+type+listener]( window.event );}
			node.attachEvent( 'on'+type, node[type+listener] );
			return true;
		}
		
		// Didn't have either so return false
		return false;
	}



function addLoadEvent(loadEvent,waitForImages) {
    //alert('addloadEvent');
    
    // If the wait flag is true use the regular add event method
    if(waitForImages) {
        return addEvent(window, 'load', loadEvent);
    }
    
    // Otherwise use a number of different methods
    
    // Wrap the loadEvent method to assign the correct content for the
    // this keyword and ensure that the event doesn't execute twice
    var init = function() {

        if (arguments.callee.done) return;
        // Return if this function has already been called

        // Mark this function so you can verify if it was already run
        arguments.callee.done = true;

        // Run the load event in the context of the document
        loadEvent.apply(document,arguments);
    };
    
    // Register the event using the DOMContentLoaded event
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", init, false);
    }
    
    // For Safari, use a setInterval() to see if the document has loaded 
    if (/WebKit/i.test(navigator.userAgent)) {
        var _timer = setInterval(function() {
            if (/loaded|complete/.test(document.readyState)) {
                clearInterval(_timer);
                init();
            }
        },10);
    }
    // For Internet Explorer (using conditional comments) attach a script 
    // that is deferred to the end of the load process and then check to see
    // if it has loaded
    /*@cc_on @*/
    /*@if (@_win32)
    document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
    var script = document.getElementById("__ie_onload");
    script.onreadystatechange = function() {
        if (this.readyState == "complete") {
            init();
        }
    };
    /*@end @*/
    return true;
}
	
})();


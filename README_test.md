CJ Date Picker Bar v1.0
=======================

Copyright (c) 2011 Creative Juices Bo. Co.
Author: Doug Jones [www.cjboco.com](http://www.cjboco.com/)
Licensed under the MIT.

A jQuery plugin to display a horizontal date picker bar to allow quick and easy date selection.
Returns a JS date object.

HTML
```
<div class="cj-datenav"></div>
```

JS
```
<script src="assets/js/jquery.cj-date-picker-bar.js"></script>
<script>
(function($) {
   "use strict";
   $('.cj-datenav').cjDatePickerBar({
	  date: '10/31/2011',
	  callback: function(dateObj) {
		 console.log(dateObj)
	  }
   });
}(jQuery));
</script>
```

CSS
The ID and CLASS naming conventions allow for jQuery UI theme styling, but
additional items are available to style.

```
.cj-datenav              - The main block.
.cj-datenav .nav-months  - The month button set
.cj-datenav .nav-years   - The year button set
.cj-datenav .cj-button   - The buttons
```


SETTINGS
These are the items which you can pass to the function when initializing.

option         type         default
---------------------------------------------------------------------------
date          string        null (will use current date if not passed)
dateMin       string        null
dateMax       string        null
bigInc        number        10
tinyInc       number        5
monthNames    array         ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
showInc       boolean       false
showFuture    boolean       true
callback      function      null

Please review included index.html for further details and help.
/*!
  jquery.webClock.js
 */
(function($){

    var gVars = {}; // Global Array for rotating Clock

    // extending jquery core library to add a function named webClock():
    $.fn.webClock = function(opts){
        var container = this.eq(0);
        if(!container)
        {
            try{
                console.log("Please Select a Valid Selector");
            } catch(e){}

            return false;
        }

        if(!opts) opts = {};

        var defaults = {}; // add defaults if needed
        
        /* Merging the provided options with the default ones (will be used in future versions of the plugin): */
        $.each(defaults,function(k,v){
            opts[k] = opts[k] || defaults[k];
        })
        // Calling the setUp function and passing the container,
        // will be available to the setUp function as "this":
        setUp.call(container);

        return this;
    }

    function setUp()
    {
        // The colors of the dials:
        var colors = ['orange','blue','green'];

        var hand;

        for(var i=0;i<3;i++)
        {
            // Creating a new element and setting the color as a class name:

            hand = $('<div>').attr('class',colors[i]+' webclock').html(
                '<div class="display"></div>'+

                    '<div class="front left"></div>'+

                    '<div class="rotate left">'+
                    '<div class="bg left"></div>'+
                    '</div>'+

                    '<div class="rotate right">'+
                    '<div class="bg right"></div>'+
                    '</div>'
            );

            // Appending to the container:
            $(this).append(hand);

            // Assigning some of the elements as variables for speed:
            hand.rotateLeft = hand.find('.rotate.left');
            hand.rotateRight = hand.find('.rotate.right');
            hand.display = hand.find('.display');

            // Adding the dial as a global variable. Will be available as gVars.colorName
            gVars[colors[i]] = hand;
        }

        // Setting up a interval, executed every 1000 milliseconds:
        setInterval(function(){

            var currentTime = new Date();
            var h = currentTime.getHours();
            var m = currentTime.getMinutes();
            var s = currentTime.getSeconds();

            animation(gVars.green, s, 60, "Second");
            animation(gVars.blue, m, 60, "Minute");
            animation(gVars.orange, h, 24, "Hour");

        },1000);
    }

    function animation(webclock, current, total,unit)
    {
        // Calculating the current angle:
        var angle = (360/total)*(current+1);

        var element;

        if(current==0)
        {
            // Hiding the right half of the background:
            webclock.rotateRight.hide();

            // Resetting the rotation of the left part:
            rotateElement(webclock.rotateLeft,0);
        }

        if(angle<=180)
        {
            // The left part is rotated, and the right is currently hidden:
            element = webclock.rotateLeft;
        }
        else
        {
            // The first part of the rotation has completed, so we start rotating the right part:
            webclock.rotateRight.show();
            webclock.rotateLeft.show();

            rotateElement(webclock.rotateLeft,180);

            element = webclock.rotateRight;
            angle = angle-180;
        }

        rotateElement(element,angle);

        // Setting the text inside of the display element, inserting a leading zero if needed:
        webclock.display.html(current<10? '0'+current+" "+unit : current+" "+unit);
    }

    function rotateElement(element,angle)
    {
        // Rotating the element, depending on the browser:
        var rotate = 'rotate('+angle+'deg)';

        if(element.css('MozTransform')!=undefined)
            element.css('MozTransform',rotate);

        else if(element.css('WebkitTransform')!=undefined)
            element.css('WebkitTransform',rotate);

        // A version for internet explorer using filters, works but is a bit buggy (no surprise here):
        else if(element.css("filter")!=undefined)
        {
            var cos = Math.cos(Math.PI * 2 / 360 * angle);
            var sin = Math.sin(Math.PI * 2 / 360 * angle);

            element.css("filter","progid:DXImageTransform.Microsoft.Matrix(M11="+cos+",M12=-"+sin+",M21="+sin+",M22="+cos+",SizingMethod='auto expand',FilterType='nearest neighbor')");

            element.css("left",-Math.floor((element.width()-200)/2));
            element.css("top",-Math.floor((element.height()-200)/2));
        }
        $(".webclock .display").css("color","#"+((1<<24)*Math.random()|0).toString(16));

    }

})(jQuery)
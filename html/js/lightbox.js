/**
 * Lightbox Class
 */
var lightBox = function(lightbox, lightbox_container, lightbox_background, closeBtn, myImage){
    //Global Variables
    this.lightbox = lightbox;
    this.lightbox_container = lightbox_container;
    this.lightbox_background = lightbox_background;
    this.closeBtn = closeBtn;
    this.myImage = myImage;

    //Lightbox Events
    this.lightBoxEvents();
};

/**
 * Prototype methods of lightbox class
 */

lightBox.prototype = {

    //LigthBoxEvents Function
    lightBoxEvents: function() {
        //a new variable self is created and is assigned the value self in this
        var self = this;
        //lightbox image click function
        //when we click on any image of carousel it will be shown to us in an lightbox
        $(this.lightbox+" img").click(function() {
            // calculating the value of image clicked by user and storing in srcimg
            var srcimg = $(this).attr("src");
            //here the src attribute of id myImage is replaced by the value stored in variable srcimg
            //as we have to show that image clicked by user in an light box
            $(self.myImage).attr("src",srcimg);
            //here image is shown on the screen when we click on the image
            $(self.lightbox_container).fadeIn(300);
            //here lightbox background is shown on the screen when we click on the image
            $(self.lightbox_background).fadeIn(300);
        });

        /**
         * close function code of lightbox
         */
        $(this.closeBtn).click(function(){
            $(self.lightbox_container).fadeOut(300);
            $(self.lightbox_background).fadeOut(300);
        });

        /**
        * Close the lightbox when escape key is pressed 
        */
       $(document).bind('keydown', function(e) { 
            if (e.which == 27) {
                $(self.lightbox_container).fadeOut(300);
                $(self.lightbox_background).fadeOut(300);
            }
        }); 
    }
};
    
$(document).ready(function() {
    var myLightBox = new lightBox(".lightbox",".lightbox-container",".lightbox-background","#closeBtn","#myImage");
});
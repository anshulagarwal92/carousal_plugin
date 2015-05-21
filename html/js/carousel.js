/**
 * Carousal Class
 * @param kwargs JSON
 */
var carousal = function(kwargs) {

    //Global Variables

    //it will check if the container is defined or not,if it is not defined then will show an error 
    if(typeof kwargs.container !== "undefined") {
        this.container = kwargs.container;
    }

    //it will check if the nextButton is defined or not,if it is not defined then will show an error 
    if(typeof kwargs.nextButton !== "undefined") {
        this.nextButton = kwargs.nextButton;
    }

    //it will check if the previousButton is defined or not,if it is not defined then will show an error 
    if(typeof kwargs.previousButton !== "undefined") {
        this.previousButton = kwargs.previousButton;
    }

    //it will check if the numberofpages is defined or not,if it is not defined then will show an error 
    if(typeof kwargs.numberofpages !== "undefined") {
        this.numberofpages = kwargs.numberofpages;
    }

    //the width of each image is initialized as zero here
    this.eachLiWidth = 0;

    this.totalPagesMod = 0;

    this.totalLis = 0;

    this.myTimer = false;

    //the value of the current page is set to 1 
    this.currentPage = 1;

    //the value of the total pages is declared and defined as zero 
    this.totalPages = 0;

    //it will check if is imagesPerPage is defined 
    if(typeof kwargs.imagesPerPage !== "undefined") {
        this.noOfImagesToShowInOnePage = kwargs.imagesPerPage;
    }

    this.numberOfImageMove = this.noOfImagesToShowInOnePage;

    if(typeof kwargs.isLinear !== "undefined" && kwargs.isLinear){
        this.isLinear = kwargs.isLinear;
    }

    //Init plugin
    this.init();

    //here we will check that the paging enabled or disabled
    if(typeof kwargs.isPagingEnabled !== "undefined" && kwargs.isPagingEnabled) {
            this.showPaging();
            this.highlightPaging();
    }

    //Bind Events.
    this.bindEvents();

    if(typeof kwargs.isAutoRotateEnabled !== "undefined" && kwargs.isAutoRotateEnabled) {
        if(typeof this.isLinear !== "undefined" && this.isLinear ){
            this.autoRotateLinear();  
        } else{
            this.autorotateCircular();
        }
    }    
};

/**
 * Prototype methods of carousal class 
 */
carousal.prototype = {

    //Init function
    init: function() {
        this.timer = 3000;
        //this will calculate the width of each image
        this.eachLiWidth = $(this.container+' li:first').width();
        this.left_indent = (this.eachLiWidth);
        console.log("this.left_indent",this.left_indent);
        $(this.container).parent().width(this.eachLiWidth*this.noOfImagesToShowInOnePage);
        $(this.container).width(this.eachLiWidth*$(this.container+' li').length);
        //here we are calculating the total number of pages in carousel according to the user input 
        this.totalPages = parseInt((($(this.container+' li').length)) / this.noOfImagesToShowInOnePage);

        this.totalPagesCircular = parseInt(($(this.container+' li').length));
        //we are calculating the Modulus for the remaining number of Images
        this.totalPagesMod = ((($(this.container+' li').length)) % this.noOfImagesToShowInOnePage);
        //we are checking if Modulus is remaining then to add extra one page in pagination
        if( this.totalPagesMod >= 1 ){
            this.totalPages =  this.totalPages + 1;
        }
    },

    //this function is used to show paging or not
    showPaging: function() {
        if(typeof this.isLinear !== "undefined" && this.isLinear ){
            for(var i=1;i<=(this.totalPages);i++) {
                //this is placing the number of pages in the anchor tag inside the div element in html
                $(this.numberofpages).append('<a href="javascript:void(0)">'+i+'</a>');
            } 
        } else{
            for(var i=1;i<=(this.totalPagesCircular);i++){
                $(this.numberofpages).append('<a href="javascript:void(0)">'+i+'</a>');
            }
        } 
    },

    autoRotateLinear: function(){
        //Autorotate code for carousel
        var self = this;
        //we will initialize current page with 2 because the page number one is already shown in carousel
        //and if we will put page number 1 instead of 2 then for first animation it will take the double time
        //as provided in setInterval function and here it will take 6seconds.
        self.currentPage = 2;
        //setinterval function is used for setting a particular time interval for a particular function
        self.myTimer = setInterval(function(){
        //if current page is last then it will move to the first page again
            if(self.currentPage > self.totalPages) {
                self.currentPage = 1;
            }
            self.moveToPagelinear(self.currentPage, function() {
                self.currentPage++;
            });
        }, this.timer); 
    },

    autorotateCircular:function(){
        //Autorotate code for carousel
        var self = this;
        //we will initialize current page with 2 because the page number one is already shown in carousel
        //and if we will put page number 1 instead of 2 then for first animation it will take the double time
        //as provided in setInterval function and here it will take 6seconds.
        self.currentPage = 1;
        self.myTimer = setInterval(function(){
            //if current page is last then it will move to the first page again
            if(self.currentPage > self.totalPagesCircular) {
                self.currentPage = 1;
            }
            self.currentPage++;
            $(self.container).animate({
                'left':"-="+self.eachLiWidth
            },500,function(){
                $(self.container+' li:last').after($(self.container+' li:first'));
                $(self.container).css({"left":-(self.left_indent)});
                if(self.currentPage > self.totalPagesCircular){
                    self.currentPage = 1;
                }
                self.highlightPaging();
            });    
        }, this.timer);
    },

    //this function is used to animate the carousel when we click on the page number in pagination
    pageClickLinear :function(){
        var self = this;
        $(this.numberofpages+" a").click(function() {
            if(self.myTimer) {
                clearInterval(self.myTimer);
            }
            //in currentPage the value is taken from html page that on which page numbr user has clicked
            self.currentPage = parseInt($(this).html());
            self.moveToPagelinear();
        }); 
    },

    //this function is used to highlight the page number which the user is viewing or it has been clicked by user
    highlightPaging: function() {
        var self = this;
        $(this.numberofpages+" a").removeClass("active");
        $(this.numberofpages+" a").each(function() {
            if($(this).html() == self.currentPage) {
                $(this).addClass("active");
            }
        });
    },

    //this is the function which is used for animation according to the clicke page number 
    //and it is also been used in autorotate for the animation when the page is loaded 
    moveToPagelinear: function(pageNo, callback) {
        var self = this;

        if(typeof pageNo !== "undefined") {
            this.currentPage = pageNo;
        }

        if(!self.totalPagesMod){
            if(self.currentPage <= self.totalPages ){
                $(self.container).animate({
                    'left':"-"+((self.eachLiWidth*self.numberOfImageMove*self.currentPage)-(self.eachLiWidth*self.numberOfImageMove))
                },500,function(){
                    //the callback function is called after finishing animation to show or hide the left and right 
                    //arrows according to user click
                    self.highlightPaging();
                    if(typeof callback !== "undefined")
                        callback();
                });
            }
            //if Modulus is not equal to zero then this loop will execute i.e for images left after dividing it
            //by numberofImagemove
        } else {
            //if the value of the clicked page is less than the total number of page then this loop will execute
            //otherwise else will execute if the value of clicked page is equal to the total number of pages 
            if(self.currentPage < self.totalPages){
                $(self.container).animate({
                    'left':"-"+((self.eachLiWidth*self.numberOfImageMove*self.currentPage)-(self.eachLiWidth*self.numberOfImageMove))
                },500,function(){
                    //the callback function is called after finishing animation to show or hide the left and right 
                    //arrows according to user click
                    self.highlightPaging();
                    if(typeof callback !== "undefined")
                        callback();
                });
            } else {
                $(self.container).animate({
                    'left':"-"+((self.eachLiWidth*self.numberOfImageMove*self.currentPage)-(self.eachLiWidth*self.numberOfImageMove)-((self.numberOfImageMove - self.totalPagesMod)*self.eachLiWidth))
                },500,function(){
                    //the callback function is called after finishing animation to show or hide the left and right 
                    //arrows according to user click
                    self.highlightPaging();
                    if(typeof callback !== "undefined")
                        callback();
                });
            } 
        }
    },

    nextButtonClickCircular :function(){
        var self = this;
        self.currentPage++;
        $(self.container).animate({
            'left':"-="+self.eachLiWidth
        },500,function(){
            $(self.container+' li:last').after($(self.container+' li:first'));
            $(self.container).css({"left":-(self.left_indent)});
            if(self.currentPage > self.totalPagesCircular){
                self.currentPage = 1;
            }
            self.highlightPaging();
        }); 
    },

    //this is used for the anim,ation when user clicks on previous button
    previousButtonClickCircular :function(){
        var self = this;
        self.currentPage--;
        $(self.container).animate({
            'left':"+="+self.eachLiWidth
        },500,function() {
            $(self.container+' li:first').before($(self.container+' li:last'));
            $(self.container).css({'left' :-(self.left_indent)});
            if(self.currentPage < 1){
                self.currentPage = self.totalPagesCircular;
            }
            self.highlightPaging();
        });
    },

    //this is used for the animation when user clicks on next button
    nextButtonClickLinear :function(){
        var self = this;
        self.currentPage++;
        //if Modulus is zero i.e if we divide number of images to move by the number of images to show in 
        //one page then if remainder is zero then this loop will execute otherwise else part will execute
        if( !self.totalPagesMod){
            if(self.currentPage <=self.totalPages){
                $(self.container).animate({
                    'left': "-="+self.eachLiWidth*self.numberOfImageMove
                },500,function() {
                    //Callback function will execute after finishing animation.
                    self.highlightPaging();
                }); 
            }
            if(self.currentPage > self.totalPages){
                self.currentPage = 1;
                self.moveToPagelinear(self.currentPage, function() {
                });
            }
        } else{
            //if value of the page clicked i.e current page is less than the value of the total pages then
            //this will execute otherwise the else part will execute
            if(self.currentPage < self.totalPages ){
                $(self.container).animate({
                    'left': "-="+self.eachLiWidth*self.numberOfImageMove
                },500,function() {
                    //Callback function will execute after finishing animation.
                    self.highlightPaging();
                });
                if(self.currentPage > self.totalPages){
                    self.currentPage = 1;
                    self.moveToPagelinear(self.currentPage, function() {
                    });
                } 
            }else{
                if(self.currentPage == self.totalPages){
                    $(self.container).animate({
                        'left': "-="+self.eachLiWidth*self.totalPagesMod
                    },500,function() {
                        //Callback function will execute after finishing animation.
                        self.highlightPaging();
                    });
                }
                if(self.currentPage > self.totalPages){
                    self.currentPage = 1;
                    self.moveToPagelinear(self.currentPage, function() {
                    });
                }     
            }
        }
    },

    //this is used for the anim,ation when user clicks on previous button
    previousButtonClickLinear :function(){
        var self = this;
        //if Modulus is zero i.e if we divide number of images to move by the number of images to show in 
        //one page then if remainder is zero then this loop will execute otherwise else part will execute
        if(!self.totalPagesMod){
            self.currentPage--;
            if(self.currentPage <= self.totalPages && self.currentPage >= 1){
                $(self.container).animate({
                    'left':"+="+self.eachLiWidth*self.numberOfImageMove
                },500,function() {
                    //Callback function will execute after finishing animation.
                    self.highlightPaging();
                });
            }
            if(self.currentPage < 1) {
                self.currentPage = self.totalPages;
                self.moveToPagelinear(self.currentPage, function() {
                });
            }
        } else {
            //if value of the page clicked i.e current page is less than the value of the total pages then
            //this will execute otherwise the else part will execute
            if(self.currentPage < self.totalPages){
                self.currentPage--;
                if(self.currentPage < self.totalPages && self.currentPage >= 1){
                    $(self.container).animate({
                        'left':"+="+self.eachLiWidth*self.numberOfImageMove
                    },500,function() {
                    //Callback function will execute after finishing animation.
                    self.highlightPaging();
                    });
                }
                if( self.currentPage < 1){
                    self.currentPage = self.totalPages;
                    self.moveToPagelinear(self.currentPage, function() {
                    });
                }
                
            } else {
                if(self.currentPage == self.totalPages){
                    $(self.container).animate({
                        'left':"+="+self.eachLiWidth*self.totalPagesMod
                    },500,function() {
                    //Callback function will execute after finishing animation.
                    self.currentPage--;
                    self.highlightPaging();
                    }); 
                } 
            }
        }
    },

    //bindEvents Function
    bindEvents: function() {
        var self = this;
        if(typeof this.linear === "undefined" && !this.isLinear){
            $(self.container+' li:first').before($(self.container+' li:last'));
            $(self.container).css({'left' :-self.left_indent});
        }
        
        //paging click event
        if(typeof this.isLinear !== "undefined" && this.isLinear ){
            self.pageClickLinear();
        } 

        if(typeof this.isLinear === "undefined" && !this.isLinear ){
            $(self.nextButton+" img").click(function() {
                //when user clicks on button the autorotate function will not be working by clearing interval 
                //using clearInterval function
                if(self.myTimer) {
                    clearInterval(self.myTimer);
                }
                self.nextButtonClickCircular(); 
            });
        } else{
            $(self.nextButton+" img").click(function() {
                //when user clicks on button the autorotate function will not be working by clearing interval 
                //using clearInterval function
                if(self.myTimer) {
                    clearInterval(self.myTimer);
                }
                self.nextButtonClickLinear(); 
            });
        }

        if(typeof this.isLinear === "undefined" && !this.isLinear ){
            $(self.previousButton+" img").click(function() {
                //when user clicks on button the autorotate function will not be working by clearing interval 
                //using clearInterval function
                if(self.myTimer) {
                    clearInterval(self.myTimer);
                }
                self.previousButtonClickCircular(); 
            });
        } else{
            $(self.previousButton+" img").click(function() {
                //when user clicks on button the autorotate function will not be working by clearing interval 
                //using clearInterval function
                if(self.myTimer) {
                    clearInterval(self.myTimer);
                }
                self.previousButtonClickLinear(); 
            });
        }
    }
};


$(document).ready(function() {
    new carousal({
        "container": "#carousel_ul", 
        "nextButton": "#right_scroll", 
        "previousButton": "#left_scroll",
        "numberofpages":"#numofpages",
        "isPagingEnabled": true,
        "imagesPerPage":3,
        "isAutoRotateEnabled": true,
        "isLinear":true
    });
});

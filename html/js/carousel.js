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
    if(typeof kwargs.imagesPerPage !== "undefined") {
        this.noOfImagesToShowInOnePage = kwargs.imagesPerPage;
    }
    this.numberOfImageMove = this.noOfImagesToShowInOnePage; 
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
        this.autoRotate();
    }
};

/**
 * Prototype methods of carousal class 
 */
carousal.prototype = {

    //Init function
    init: function() {
        //this will calculate the width of each image
        this.eachLiWidth = $(this.container+' li:first').width();
        $(this.container).parent().width(this.eachLiWidth*this.noOfImagesToShowInOnePage);
        $(this.container).width(this.eachLiWidth*$(this.container+' li').length);
        //here we are calculating the total number of pages in carousel according to the user input 
        this.totalPages = parseInt((($(this.container+' li').length)) / this.noOfImagesToShowInOnePage);
        //we are calculating the Modulus for the remaining number of Images
        this.totalPagesMod = ((($(this.container+' li').length)) % this.noOfImagesToShowInOnePage);
        //we are checking if Modulus is remaining then to add extra one page in pagination
        if( this.totalPagesMod >= 1 ){
            this.totalPages =  this.totalPages + 1;
        }
    },

    //this function is used to show paging or not
    showPaging: function() {
        for(var i=1;i<=(this.totalPages);i++) {
            //this is placing the number of pages in the anchor tag inside the div element in html
            $(this.numberofpages).append('<a href="javascript:void(0)">'+i+'</a>');
        }
    },

    autoRotate: function(){
        //Autorotate code for carousel
        var self = this;
        self.currentPage = 2;
        self.myTimer = setInterval(function(){
            if(self.currentPage > self.totalPages) {
                self.currentPage = 1;
            }
            self.moveToPage(self.currentPage, function() {
                self.currentPage++;
            });
        }, 3000);
    },

    scrollHideAndShowPagination: function() {
        var self = this;
        if(self.currentPage >= self.totalPages){
            $(self.nextButton+" img").hide();
            $(self.previousButton+" img").show();
        } else if(self.currentPage <= 1){
            $(self.previousButton+" img").hide();
            $(self.nextButton+" img").show();
        } else if(self.currentPage > 1){
            $(self.previousButton+" img").show();
            $(self.nextButton+" img").show();
        }
    },

    scrollHideAndShowButtons:function(){
        var self = this;
        if(self.currentPage == 1) {
            $(self.nextButton+" img").show();
            $(self.previousButton+" img").hide();
        }
        if(self.currentPage > 1 && self.currentPage < self.totalPages){
            $(self.nextButton+" img").show();
            $(self.previousButton+" img").show();
        }
        if(self.currentPage == self.totalPages) {
            $(self.nextButton+" img").hide();
            $(self.previousButton+" img").show();
        }
    },

    hidePreviousButtonUpFront:function(){
        var self = this;
        if(self.currentPage == 1){
            $(self.previousButton+" img").hide();
        }
    },

    pageClick :function(){
        var self = this;
        $(this.numberofpages+" a").click(function() {
            if(self.myTimer) {
                clearInterval(self.myTimer);
            }
            //in currentPage the value is taken from html page that on which page numbr user has clicked
            self.currentPage = parseInt($(this).html());
            self.moveToPage();
        }); 
    },
    highlightPaging: function() {
        var self = this;
        $(this.numberofpages+" a").removeClass("active");
        $(this.numberofpages+" a").each(function() {
            if($(this).html().trim() == self.currentPage) {
                $(this).addClass("active");
            }
        });
    },
    moveToPage: function(pageNo, callback) {
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
                    self.scrollHideAndShowPagination();
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
                    self.scrollHideAndShowPagination();
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
                    self.scrollHideAndShowPagination();
                    self.highlightPaging();
                    if(typeof callback !== "undefined")
                        callback();
                });
            } 
        }
    },
    nextButtonClick :function(){
        var self = this;
        self.currentPage++;
        //if Modulus is zero i.e if we divide number of images to move by the number of images to show in 
        //one page then if remainder is zero then this loop will execute otherwise else part will execute
        if( self.totalPagesMod == 0){
            if(self.currentPage <= self.totalPages ){
                $(self.container).animate({
                    'left': "-="+self.eachLiWidth*self.numberOfImageMove
                },500,function() {
                    //Callback function will execute after finishing animation.
                    self.scrollHideAndShowButtons();
                    self.highlightPaging();
                }); 
            }
        } else if(self.totalPagesMod != 0) {
            //if value of the page clicked i.e current page is less than the value of the total pages then
            //this will execute otherwise the else part will execute
            if(self.currentPage < self.totalPages ){
                $(self.container).animate({
                    'left': "-="+self.eachLiWidth*self.numberOfImageMove
                },500,function() {
                    //Callback function will execute after finishing animation.
                    self.scrollHideAndShowButtons();
                    self.highlightPaging();
                }); 
            }else{
                $(self.container).animate({
                    'left': "-="+self.eachLiWidth*self.totalPagesMod
                },500,function() {
                    //Callback function will execute after finishing animation.
                    self.scrollHideAndShowButtons();
                    self.highlightPaging();
                });    
            }
        }
    },

    previousButtonClick :function(){
        var self = this;
        //if Modulus is zero i.e if we divide number of images to move by the number of images to show in 
        //one page then if remainder is zero then this loop will execute otherwise else part will execute
        if(!self.totalPagesMod){
            if(self.currentPage <= self.totalPages){
                self.currentPage--;
                $(self.container).animate({
                    'left':"+="+self.eachLiWidth*self.numberOfImageMove
                },500,function() {
                    //Callback function will execute after finishing animation.
                    console.log("self.currentPage =",self.currentPage)
                    self.scrollHideAndShowButtons();
                    self.highlightPaging();
                });
            }
        } else {
            //if value of the page clicked i.e current page is less than the value of the total pages then
            //this will execute otherwise the else part will execute
            if(self.currentPage < self.totalPages){
                self.currentPage--;
                $(self.container).animate({
                    'left':"+="+self.eachLiWidth*self.numberOfImageMove
                },500,function() {
                    //Callback function will execute after finishing animation.
                    self.scrollHideAndShowButtons();
                    self.highlightPaging();
                });
            } else {
                self.currentPage--;
                $(self.container).animate({
                    'left':"+="+self.eachLiWidth*self.totalPagesMod
                },500,function() {
                //Callback function will execute after finishing animation.
                    self.scrollHideAndShowButtons();
                    self.highlightPaging();
                }); 
            }
        }
    },

    //bindEvents Function
    bindEvents: function() {
        var self = this;
        self.hidePreviousButtonUpFront();

        //paging click event
        self.pageClick();

        //Next Button Click event
        $(self.nextButton+" img").click(function() {
            if(self.myTimer) {
                clearInterval(self.myTimer);
            }
            self.nextButtonClick();
        });

        //Previous Button Click Event
        $(self.previousButton+" img").click(function(){
            if(self.myTimer) {
                clearInterval(self.myTimer);
            }
            self.previousButtonClick();
        });
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
        "isAutoRotateEnabled": true
    });
});

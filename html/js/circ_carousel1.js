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
        this.totalPages = parseInt((($(this.container+' li').length)) - this.noOfImagesToShowInOnePage);
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
            self.moveToPage(self.currentPage, function() {
                self.currentPage++;
            });
        }, 3000);
    },

    //this function is used to show and hide arrows according to pagination
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

    //this function is used to show and hide arrows according to the click of next and previous buttons
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

    //this function is used to hide the previous button when the html page is loaded
    hidePreviousButtonUpFront:function(){
        var self = this;
        if(self.currentPage == 1){
            $(self.previousButton+" img").hide();
        }
    },

    //this function is used to animate the carousel when we click on the page number in pagination
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
    moveToPage: function(pageNo, callback) {
        var self = this;
        //self.currentPage++;
        $(self.container).animate({
            'left':"-="+self.eachLiWidth
        },500,function(){
            $(self.container+' li:last').after($(self.container+' li:first'));
            $(self.container).css({"left":"-200px"});
            //self.highlightPaging();
        }); 
    },

    //this is used for the animation when user clicks on next button
    nextButtonClickCircular :function(){
        var self = this;
        //self.currentPage++;
        $(self.container).animate({
            'left':"-="+self.eachLiWidth
        },500,function(){
            $(self.container+' li:last').after($(self.container+' li:first'));
            $(self.container).css({"left":"-200px"});
            //self.highlightPaging();
        }); 
    },

    //this is used for the anim,ation when user clicks on previous button
    previousButtonClickCircular :function(){
        var self = this;
        //self.currentPage--;

        $(self.container).animate({
            'left':"+="+self.eachLiWidth
        },500,function() {
            $(self.container+' li:first').before($(self.container+' li:last'));
            $(self.container).css({'left' : '-200px'});
            //self.highlightPaging();
        });
    },

    //bindEvents Function
    bindEvents: function() {
        var self = this;
        $(self.container).addClass("carousel_ul1");
        $('#carousel_ul li:first').before($('#carousel_ul li:last'));
        //paging click event
        self.pageClick();

        //Next Button Click event
        $(self.nextButton+" img").click(function() {
            //when user clicks on button the autorotate function will not be working by clearing interval 
            //using clearInterval function
            if(self.myTimer) {
                clearInterval(self.myTimer);
            }
            self.nextButtonClickCircular();
        });

        //Previous Button Click Event
        $(self.previousButton+" img").click(function(){
            //when user clicks on button the autorotate function will not be working by clearing interval 
            //using clearInterval function
            if(self.myTimer) {
                clearInterval(self.myTimer);
            }
            self.previousButtonClickCircular();
        });
    }
};


$(document).ready(function() {
    new carousal({
        "container": "#carousel_ul", 
        "nextButton": "#right_scroll", 
        "previousButton": "#left_scroll",
        "numberofpages":"#numofpages",
        "isPagingEnabled": false,
        "imagesPerPage":3,
        "isAutoRotateEnabled": true
    });
});

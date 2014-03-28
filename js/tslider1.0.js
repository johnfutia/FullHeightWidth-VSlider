(function($) {
    $.TSlider = function(element, options) {

        this.options = {};

        element.data("TSlider", this);

        //element is the DOM element that gets passed into the plugin

        this.init = function(element, options) {
          this.options = $.extend({}, $.TSlider.defaultOptions, options);

          //Assign the options to a variable
          options = this.options;
          var slides = options['class'] + "-slides";
          var thumbs = options['class'] + "-thumbs";
          var timer = null;

          //element.find('img').hide();

          //This function adds the class names based on the base class name that was passed into the options
          addClasses(element, options, slides, thumbs);

          //element.prepend('<div class="tslider-display"></div><div class="tslider-display2"></div>');

          //Grab the slide and thumb containers and make them jQuery selectors
          var $slides = $('.' + slides);
          var $thumbs = $('.' + thumbs);

          //Black/White thumbnail is set to false by default
          var bw = false;

          if (options.bwToColor === true) {
            bw = true;
          }

          //Populate the Thumbnails
          var $bwthumbs  = setThumbImg(options, element, $thumbs, bw);


          var imgsrc = new Array();
          var htmlsrc = new Array();

          //create a new div for each slide, and set the background to the image in the foreground
          element.prepend('<div class="tdisplay"></div>');
          var $display = $('.tdisplay');
          var slidecount = 0;

          $slides.children().each(function(){
            imgsrc[slidecount] = $(this).data('imgsrc');
            htmlsrc[slidecount] = $(this).html();
            $display.append('<div class="tslider-display-new t-display' + slidecount + '" style="background-image: url(\''+ options.cssFilePrefix + imgsrc[slidecount] + '\');">' + htmlsrc[slidecount] + '</div>');
            slidecount ++;
          });

          setCurrent(options, $bwthumbs, $thumbs, $display);

          //Create a counter that will increase to the number of thumbnails in the slider then reset to 0
          var i = 0;
          var nextIndex;
          var currentIndex;

          //Auto Scroll through the images
          if (options.autoScroll === true) {
            timer = setInterval(function(){
              currentIndex = $('.current-tslide').index();

              if ((i + 1) < imgsrc.length) {
                i++;
              }

              else {
                i = 0;
              }


              advance(options, $bwthumbs, $thumbs, $display, i, currentIndex);


            }, options.speed);

          }

          //Click to move through the images, then autoscroll again
          element.on('click', 'li', function(e) {
            e.preventDefault();
            clearInterval(timer);
            currentIndex = $('.current-tslide').index();
            nextIndex = $(this).index();
            //$('.current-tslide').removeClass('current-tslide');
            advance(options, $bwthumbs, $thumbs, $display, nextIndex, currentIndex);

            if (options.autoScroll === true) {
              i =  nextIndex ++;
              timer = setInterval(function(){
                currentIndex = $('.current-tslide').index();

                if ((i + 1) < imgsrc.length) {
                  i++;
                }

                else {
                  i = 0;
                }

                advance(options, $bwthumbs, $thumbs, $display, i, currentIndex);


              }, options.speed);
            }
          });



        };

        this.init(element, options);
    };

  //Public function
    $.fn.TSlider = function(options) {
      return this.each(function() {
         var newTslider = new $.TSlider($(this), options);
      });
    };

    function addClasses(element, options, slides, thumbs) {
      element.addClass(options['class']);
      element.children().first().addClass(slides);
      element.children().last().addClass(thumbs);
    }

    function setThumbImg(options, element, $thumbs, bw) {

      //Go through each thumb and set the background to the image in the foreground
      var $bwthumbs;
      if (bw) {
        $bwthumbs = $thumbs.clone().appendTo(element);
        $bwthumbs.addClass('bw');

        var bwsrc = new Array();
        $bwthumbs.children().each(function(i) {
          bwsrc[i] = $(this).find('img').attr('src');
          $(this).css('background-image', "url('" + options.cssFilePrefix + bwsrc[i] + "')");
        });

        var colorsrc = new Array();
        $thumbs.children().each(function(i){
           colorsrc[i] = $(this).data('colorsrc');
           $(this).css('background-image', "url('" + options.cssFilePrefix + colorsrc[i] + "')");
        });

        return $bwthumbs;

      }

      else {
        var newcolorsrc = new Array();
        $bwthumbs.children().each(function(i) {
          newcolorsrc[i] = $(this).find('img').attr('src');
          $(this).css('background-image', "url('" + options.cssFilePrefix + newcolorsrc[i] + "')");
        });
        return false;
      }
    }

    function setCurrent(options, $bwthumbs, $thumbs, $display) {
      var currentIndex = $thumbs.children().first().index();
      showThumbSlide(options, $bwthumbs, $thumbs, $display,  currentIndex);
    }

    function advance(options, $bwthumbs, $thumbs, $display, nextIndex, currentIndex) {
      //var currentIndex = $('.current-tslide').index();
      hideThumbSlide(options, $bwthumbs, $thumbs, $display, currentIndex);
      showThumbSlide(options, $bwthumbs, $thumbs, $display, nextIndex);
    }

    function hideThumbSlide(options, $bwthumbs, $thumbs, $display, currentIndex) {
      $.fx.off = true;
      $.fx.off = !$.fx.off;
      $bwthumbs.children().eq(currentIndex).css({
        'opacity' : '0',
        'visibility' : 'visible'
      }).animate({
        opacity: 1,
      }, 100, function() { });
      $bwthumbs.children().css('visibility', 'visible');

      $display.children().eq(currentIndex).fadeOut().removeClass('current-tslide');
    }

    function showThumbSlide(options, $bwthumbs, $thumbs, $display, nextIndex) {
      $.fx.off = true;
      $.fx.off = !$.fx.off;
      $bwthumbs.children().eq(nextIndex).animate({
        opacity: 0,
      }, 100, function() {
        $(this).css({
          'visibility' : 'hidden',
          'opacity' : '1'
        });
      });


      $display.children().eq(nextIndex).fadeIn().addClass('current-tslide');



    }


    $.TSlider.defaultOptions = {
      "class": "t-slider",
      autoScroll: true,
      speed: 10000,
      fadeSpeed: 1000,
      bwToColor: true,
      cssFilePrefix: ''
    };

  })(jQuery);

/*=========================================
Wow animation js
==========================================*/
jQuery(function ($) {
    wow = new WOW({
        animateClass: 'animated',
        offset: 100
    });
    wow.init();
});
/*=========================================
Page preloader
==========================================*/
function preloader() {
    $(() => {
        setInterval(() => {
            let p = $('.preloader');

            p.css('opacity', 0);

            setInterval(
                () => p.remove(),
                parseInt(p.css('1000'))
            );
        }, 1000);
    });
}
setInterval(() => preloader(), 1000);

/*=========================================
Smooth-scrolling navigation
==========================================*/
$(document).on("scroll", onScroll);
// Select all links with hashes
$('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
        // On-page links
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function () {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    };
                });
            }
        }
    });

/*=========================================
Active navigation when scrolling
==========================================*/
function onScroll(event) {
    var scrollPosition = $(document).scrollTop();
    $('nav ul li a').each(function () {
        var currentLink = $(this);
        var refElement = $(currentLink.attr("href"));
        if (refElement.position().top <= scrollPosition && refElement.position().top + refElement.height() > scrollPosition) {
            $('nav ul li a').removeClass("focus");
            currentLink.addClass("focus");
        } else {
            currentLink.removeClass("focus");
        }
    });
}

/*=========================================
Sticky navigation
==========================================*/
$(window).scroll(function () {
    if ($(document).scrollTop() > 15) {
        $('.navbar').addClass('shrink');
    } else {
        $('.navbar').removeClass('shrink');
    }
});

/*=========================================
Autotyped JS
==========================================*/
//set animation timing
	var animationDelay = 2500,
		//loading bar effect
		barAnimationDelay = 3800,
		barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
		//letters effect
		lettersDelay = 50,
		//type effect
		typeLettersDelay = 150,
		selectionDuration = 500,
		typeAnimationDelay = selectionDuration + 800,
		//clip effect
		revealDuration = 600,
		revealAnimationDelay = 1500,
  	stopAnimation = false;

	initHeadline();


	function initHeadline() {
		//insert <i> element for each letter of a changing word
		singleLetters($('.cd-headline.letters').find('b'));
		//initialise headline animation
		animateHeadline($('.cd-headline'));
	}

	function singleLetters($words) {
		$words.each(function(){
			var word = $(this),
				letters = word.text().split(''),
				selected = word.hasClass('is-visible');
			for (i in letters) {
				if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
				letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
			}
		    var newLetters = letters.join('');
		    word.html(newLetters);
		});
	}

	function animateHeadline($headlines) {
		var duration = animationDelay;
		$headlines.each(function(){
			var headline = $(this);
			if(headline.hasClass('loading-bar')) {
				duration = barAnimationDelay;
				setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
			} else if (headline.hasClass('clip')){
				var spanWrapper = headline.find('.cd-words-wrapper'),
					newWidth = spanWrapper.width() + 10
				spanWrapper.css('width', newWidth);
			} else if (!headline.hasClass('type') ) {
				//assign to .cd-words-wrapper the width of its longest word
				var words = headline.find('.cd-words-wrapper b'),
					width = 0;
				words.each(function(){
					var wordWidth = $(this).width();
				    if (wordWidth > width) width = wordWidth;
				});
				headline.find('.cd-words-wrapper').css('width', width);
			};

			//trigger animation
			setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
		});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);

    if(stopAnimation){
      return false;
    }

		if($word.parents('.cd-headline').hasClass('type')) {
			var parentSpan = $word.parent('.cd-words-wrapper');
			parentSpan.addClass('selected').removeClass('waiting');
			setTimeout(function(){
				parentSpan.removeClass('selected');
				$word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
			}, selectionDuration);
			setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

		} else if($word.parents('.cd-headline').hasClass('letters')) {
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
				switchWord($word, nextWord);
				showWord(nextWord);
			});

		} else if ($word.parents('.cd-headline').hasClass('loading-bar')){
			$word.parents('.cd-words-wrapper').removeClass('is-loading');
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
			setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

		} else {
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, animationDelay);
		}
	}

	function showWord($word, $duration) {
		if($word.parents('.cd-headline').hasClass('type')) {
			showLetter($word.find('i').eq(0), $word, false, $duration);
			$word.addClass('is-visible').removeClass('is-hidden');

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){
				setTimeout(function(){ hideWord($word) }, revealAnimationDelay);
			});
		}
	}

	function hideLetter($letter, $word, $bool, $duration) {
		$letter.removeClass('in').addClass('out');

		if(!$letter.is(':last-child')) {
		 	setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
		} else if($bool) {
		 	setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
		}

		if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
		}
	}

	function showLetter($letter, $word, $bool, $duration) {
		$letter.addClass('in').removeClass('out');

		if(!$letter.is(':last-child')) {
			setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration);
		} else {
			if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
			if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
		}
	}

	function takeNext($word) {
		return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
	}

	function takePrev($word) {
		return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
	}

	function switchWord($oldWord, $newWord) {
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');
	}

  var icon = $('#player');
  icon.click(function() {
    if(icon.hasClass("on")){
    	icon.removeClass("on icon-pause-circle-fill").addClass("off icon-play-circle-fill");
      stopAnimation = true;
    } else {
      icon.removeClass("off icon-play-circle-fill").addClass("on icon-pause-circle-fill");
      stopAnimation = false;
      animationDelay = 1000;
      initHeadline();
    }
    return false;
  });

  /*=========================================
  Parallax Background
  ==========================================*/
  $('.banner-parallax').parallax({
      imageSrc: 'images/slide2.jpg'
  });

/*=========================================
Author image hover effect
==========================================*/
$(".author").hover3d({
    selector: ".author-card",
    shine: false,
});

$(".author").hover3d({
    // selector for element
    selector: null,

    // Perspective value for 3d space
    perspective: 1000,

    // Mouse movement sensitivity
    sensitivity: 20,

    // Default behavior is the element will follow the mouse, look like it facing the mouse
    invert: false,

    // Add shining layer
    shine: false,

    // Helper class when mouse hover in the element
    hoverInClass: "hover-in",

    // Helper class when mouse hover Out the element
    hoverOutClass: "hover-out",

    // Helper class when the mouse is hovering the element
    hoverClass: "hover-3d"
});


/*=========================================
Skill progress-bar
==========================================*/
$('.skillbar').each(function () {
    $(this).find('.skillbar-bar').animate({
        width: $(this).attr('data-percent')
    }, 6000);
});

/*=========================================
Client testimonial slider
==========================================*/
$('.client-testimonial').owlCarousel({
    loop: true,
    autoplay: true,
    smartSpeed: 3000,
    autoplayHoverPause: false,
    autoplayTimeout: 5000,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 1
        },
        1000: {
            items: 2
        }
    }
})
$('.play').on('click', function () {
    owl.trigger('play.owl.autoplay', [4000])
})
$('.stop').on('click', function () {
    owl.trigger('stop.owl.autoplay')
})

/*=========================================
Back to top button
==========================================*/
var offset = 220;
var duration = 1000;
$(window).scroll(function () {
    if ($(this).scrollTop() > offset) {
        $('.back-to-top').fadeIn(duration);
    } else {
        $('.back-to-top').fadeOut(duration);
    }
});

$('.back-to-top').click(function (event) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: 0
    }, duration);
    return false;
})

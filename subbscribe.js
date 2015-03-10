/**
 * Subbscibe.js (http://www.subbscribe.com)
 * Copyright (c) 2014 (v3.0) Shlomi Nissan, 1ByteBeta (http://www.1bytebeta.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function($) {

    $.fn.subbscribe = function( options ) {

        var obj = this;

        // Default settings
        var settings = $.extend({
            url          : '',
            title        : 'Never miss a post!',
            text         : 'Get our latest posts and announcements in your inbox. You won\'t regret it!',
            name         : 'Subbscribe',
            color        : '#ee6262',
            thumbnail    : 'https://s3-ap-southeast-2.amazonaws.com/subbscribe/img/avatar.png'
        }, options);

        // Make sure a URL has been passed through
        if ( settings.url == '' ) {

            console.log('Subbscribe Error: You must provide a valid MailChimp form URL.');
            return;

        };

        var html = '<div id="subbscribe"> <div class="subb-title">' + settings.title + ' <img class="close-x" src="https://s3-ap-southeast-2.amazonaws.com/subbscribe/img/close.svg" />  </div> <div class="subb-body"> <div class="subb-hidden"> <div class="subb-thumbnail"> <img style="width: 40px; height: 40px;" src="' + settings.thumbnail + '" /> </div> <div class="subb-hidden"> <div class="subb-site"> &nbsp;' + settings.name + ' </div> <button class="subb-button show-form">Subscribe</button> </div> </div> <div class="subb-form" style="display: none"> <p>' + settings.text + '</p> <form id="mc-embedded-subbscribe-form" method="post" action="' + settings.url + '"> <div class="subbscribe-alert subbscribe-error" style="display: none">Oops! Check your details and try again.</div> <div class="subbscribe-alert subbscribe-success" style="display: none">Thanks! Check your email for confirmation.</div> <div class="text-input"> <input type="text" name="NAME" id="mce-NAME" placeholder="Name" /> </div> <div class="text-input"> <input type="email" name="EMAIL" id="mce-EMAIL" placeholder="Email Address" /> </div> <button class="subb-button submit-form" type="submit" style="width: 100%; margin-bottom: 10px;"><i class="fa fa-plus"></i>&nbsp; Subscribe</button> </form> </div> </div> </div>';
        
        if(getCookie('subbscribe-hidden') != 1) {

            this.append(html);
            $('#subbscribe').addClass('animated slideInRight');

        }

        // Update CSS classes
        $('#subbscribe .subb-button').css('background-color', settings.color);

  
        /*
        ===============================================================================
          Events
        ===============================================================================
        */


        $('#subbscribe .close-x').click(function(){


            $('#subbscribe').addClass('animated fadeOut');
            $('#subbscribe').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){

                $('#subbscribe').remove();
                setCookie('subbscribe-hidden', 1, 1); // Hide for a day

            });

            
        });

        $('#subbscribe .show-form').click(function(){

            $('#subbscribe .subb-hidden').hide();
            $('#subbscribe .subb-form').show();

        });

        $('#mc-embedded-subbscribe-form').submit(function(e){

           e.preventDefault();

           if( formValidation() ) {

                $('#subbscribe .subbscribe-error').slideUp();
                $('#subbscribe .submit-form').attr('disabled', 'disabled');

                $.ajax({

                    url: $(this).attr('action').replace('/post?', '/post-json?').concat('&c=?'),
                    type: 'post',
                    data: $(this).serialize(),
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    
                    success: function (data) {

                       if (data['result'] != "success") {

                            //ERROR
                            console.log(data['msg']);

                       } else {

                            //SUCCESS
                            resetFormFields()
                            $('.subbscribe-success').slideDown();
                            
                            setTimeout(function(){ $('#subbscribe').addClass('animated fadeOut'); }, 2000);
                            $('#subbscribe').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                
                                $('#subbscribe').remove();
                                setCookie('subbscribe-hidden', 1, 365); // Hide for a year

                            });

                       }
                    }

                });

           } else {

                $('#subbscribe .subbscribe-error').slideDown();

           }

        });

        /*
        ===============================================================================
          Helpers
        ===============================================================================
        */

        function resetFormFields() {

            $('#subbscribe input').each(function(){
                $(this).val('');
            });

        }

        function validateEmail(email) {

            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);

        }

        function formValidation() {

            var valid   = true;
            var name    = $('#mce-NAME');
            var email   = $('#mce-EMAIL');

            if( name.val().length < 2 ) {

                valid = false;
                name.addClass('error');

            } else {

                name.removeClass('error');

            }

            if ( !validateEmail( email.val() ) ) {

                valid = false;
                email.addClass('error');

            } else {

                email.removeClass('error');

            }

            return valid;

        }

        function setCookie(cname, cvalue, exdays) {
            /*
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
            */
        }

        function getCookie(cname) {

            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
            }

            return "";

        }

    }

}(jQuery));
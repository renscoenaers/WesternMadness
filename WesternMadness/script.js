$(function () {

    'use strict';

    //saving dom objects to variables

    var anim_id;


    var cowboy = $('#cowboy');
    var badguy1 = $('#badguy1');
    var badguy2 = $('#badguy2');
    var badguy3 = $('#badguy3');
    var badguy4 = $('#badguy4');
    var background_2 = $('#background_2');
    var background_3 = $('#background_3');
    var background_4 = $('#background_4');
    var background_5 = $('#background_5');
    var score = $('#score');

    //saving some initial setup
    var container = $('#container'),
        container_left = parseInt(container.css('left')),
        container_width = parseInt(container.width()),
        container_height = parseInt(container.height()),
        cowboy_width = parseInt(cowboy.width()),
        cowboy_height = parseInt(cowboy.height()),
        badguy_width = parseInt(badguy1.width());

    //some other declarations
    var game_over = false;

    var score_counter = 1;
    var jump_height = 50;
    var speed = 3;
    var background_speed = 1;

    var move_right = false;
    var move_left = false;
    var move_jump = false;
    var in_air = false;

    var place_badguy_left = parseInt(Math.random() * (container_width + badguy_width));
    
    badguy1.css('left', parseInt(Math.random() * (container_width + badguy_width)));
    badguy2.css('left', parseInt(Math.random() * (container_width + badguy_width)));
    badguy3.css('left', parseInt(Math.random() * (container_width + badguy_width)));
    badguy4.css('left', parseInt(Math.random() * (container_width + badguy_width)));

    /* Move the cowboy */
    $(document).on('keydown', function (e) {
        if (game_over === false) {
            var key = e.keyCode;
            if (key === 37 && move_left === false) {
                move_left = requestAnimationFrame(left);
            } else if (key === 39 && move_right === false) {
                move_right = requestAnimationFrame(right);
            } else if (key === 32 && move_jump === false) {
                move_jump = requestAnimationFrame(jump);
            }
        }
    });

    $(document).on('keyup', function (e) {
        if (game_over === false) {
            var key = e.keyCode;
            if (key === 37) {
                cancelAnimationFrame(move_left);
                move_left = false;
            } else if (key === 39) {
                cancelAnimationFrame(move_right);
                move_right = false;
            } else if (key === 32) {
                cancelAnimationFrame(move_jump);
                move_jump = false;
            }
        }
    });

    function left() {
        if (game_over === false && parseInt(cowboy.css('left')) > 0) {
            cowboy.css('left', parseInt(cowboy.css('left')) - 5);
            move_left = requestAnimationFrame(left);
        }
    }

    function right() {
        if (game_over === false && parseInt(cowboy.css('left')) < container_width - cowboy_width) {
            cowboy.css('left', parseInt(cowboy.css('left')) + 5);
            move_right = requestAnimationFrame(right);
        }
    }

    function jump() {
        if (in_air === false && game_over === false && parseInt(cowboy.css('bottom')) >= 0) {
            cowboy.css('bottom', parseInt(cowboy.css('bottom')) + jump_height);
            in_air = true;
             setTimeout(fall, 400);
            move_jump = requestAnimationFrame(jump);
        }
    }

    /* Nog niet functionele code
    
    function rise_fall() {
        if (in_air === false && game_over === false && parseInt(cowboy.css('bottom')) >= 0) {
            var i;
            for (i = 0; i < jump_height; i + 10) {
                cowboy.css('bottom', parseInt(cowboy.css('bottom')) + 10);
            }

            for (i = jump_height; i > 0; i - 10) {
                cowboy.css('bottom', parseInt(cowboy.css('bottom')) - 10);
            }
            var counter = 0;
            var height = 30;
            rise(counter, height);
            setTimeout(falldown(counter, height), 300);
            move_jump = requestAnimationFrame(rise_fall);
        }
    }
    
    function rise(counter, height){
        while (counter <= height) {
                counter + 10;
                cowboy.css('bottom', parseInt(cowboy.css('bottom')) + 10);
            }
    }
    
    function falldown(counter, height){
        while (counter >= height) {
                counter - 10;
                cowboy.css('bottom', parseInt(cowboy.css('bottom')) - 10);
            }
    }

    */


    function fall() {
        cowboy.css('bottom', parseInt(cowboy.css('bottom')) - jump_height);
        setTimeout(function () {
            in_air = false;
        }, 100);
    }

    //Spellus en beweging achtergrond adhv snelheid spel
    anim_id = requestAnimationFrame(repeat);

    function repeat() {

        score_counter++;
        //animatie_cowboy();

        if (score_counter % 20 == 0) {
            score.text(parseInt(score.text()) + 1);
        }
        if (score_counter % 500 == 0) {
            speed++;
            background_speed += 0.1;
        }

        badguy_left(badguy1);
        badguy_left(badguy2);
        badguy_left(badguy3);
        badguy_left(badguy4);
        background_left(background_2, 2);
        background_left(background_3, 3);
        background_left(background_4, 4);
        background_left(background_5, 5);

        anim_id = requestAnimationFrame(repeat);
    }

    /*Animatie Cowboy
    function animatie_cowboy() {
        
        var cowboy = document.getElementById("cowboy");
        var currentPos = 0;
        var sprites = ["joehorse2.png", "joehorse3.png"]

        function nextSprite() {
            if (++currentPos >= sprites.length) currentPos = 0;
            cowboy.src = sprites[currentPos];
        }

        setInterval(nextSprite, 200);
    } */

    function background_left(background, indiv_speed) {
        var background_current_left = parseInt(background.css('left'));
        var background_width = parseInt(background.css('width'))
        var background_half = background_width / 2;
        if (background_current_left < -background_half) {
            background_current_left = 0;
        }
        background.css('left', background_current_left - (background_speed * indiv_speed));
    }

    //parseInt(Math.random() * (container_width + badguy_width))
    
    //Beweging badguys
    function badguy_left(badguy) {
        var badguy_current_left = parseInt(badguy.css('left'));
        var distance = container_width + badguy_width;
        if (badguy_current_left < -badguy_width) {
            badguy_current_left = parseInt((Math.random() * (distance / 2)) + distance);
            var badguy_left = parseInt(Math.random() * (distance));
            badguy.css('left', badguy_left);
        }
        badguy.css('left', badguy_current_left - speed);
    }

    /*Animatie mannetjes
    function Animate(character, sprite1, sprite2, sprite3, sprite4) {
            var character = document.getElementById(character);
            var currentPos = 0;
            var sprites = [sprite1, sprite2, sprite3, sprite4]

            function nextSprite() {
                if (++currentPos >= sprites.length) currentPos = 0;
                cowboy.src = sprites[currentPos];
            }

            setInterval(nextSprite, 220);
        } */



});




/* Temp

        var cowboy = document.getElementById("cowboy");
        var currentPos = 0;
        var sprites = ["joehorse2.png", "joehorse3.png"]

        function nextSprite() {
            if (++currentPos >= sprites.length) currentPos = 0;
            cowboy.src = sprites[currentPos];
        }

        setInterval(nextSprite, 220);

        var badguy = document.getElementById("badguy");
        var currentPos2 = 0;
        var sprites2 = ["blue1.png", "blue2.png", "blue3.png", "blue4.png"]

        function nextSprite2() {
            if (++currentPos2 >= sprites2.length) currentPos2 = 0;
            badguy.src = sprites2[currentPos2];
        }

        setInterval(nextSprite2, 220); */

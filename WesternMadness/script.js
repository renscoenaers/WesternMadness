$(function () {

    'use strict';


    var anim_id;

    var cowboy = $('#cowboy');
    var woodenbox = $('#woodenbox');
    var woodenbox2 = $('#woodenbox2');
    var badguy1 = $('#badguy1');
    var badguy2 = $('#badguy2');
    var badguy3 = $('#badguy3');
    var badguy4 = $('#badguy4');
    var background_2 = $('#background_2');
    var background_3 = $('#background_3');
    var background_4 = $('#background_4');
    var background_5 = $('#background_5');
    var restart_div = $('#restart_div');
    var restart_btn = $('#restart');
    var score = $('#score');

    var container = $('#container'),
        container_left = parseInt(container.css('left')),
        container_width = parseInt(container.width()),
        container_height = parseInt(container.height()),
        cowboy_width = parseInt(cowboy.width()),
        cowboy_height = parseInt(cowboy.height()),
        badguy_width = parseInt(badguy1.width()),
        woodenbox_width = parseInt(woodenbox.width());

    var game_over = false;

    var score_counter = 1;
    var jump_height = 100;
    var speed = 3;
    var bad_speed = 12;
    var background_speed = 2;
    var box_speed = 10;
    var jump_duration = 1000;
    var current_height = 0;
    var yVelocity = 0;
    var bottom = 0;
    var move_right = false;
    var move_left = false;
    var move_jump = false;
    var in_air = false;
    var double_jump = false;
    var jump_count = 0;

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
                move_jump = false;
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

    function jump() { //dubbeljump: if in air and pressed -> nog eens springen, anders rest van de code.

        if (in_air == false) {
            in_air = true;
            up();
            down(jump_height, jump_duration);
        } else if (in_air == true) {
            up();
            down(jump_height, jump_duration);
        }

    }


    /*
    function fall() {
        cowboy.css('bottom', 0);
        setTimeout(function () {
            if (parseInt(cowboy.css('bottom')) == 0) {
                jump_count = 0;
            }
        }, 750);
    }
    */

    function up() {
        var i;
        for (i = 0; i < jump_height; i++) {
            setTimeout(function () {
                cowboy.css('bottom', parseInt(cowboy.css('bottom')) + 1)
            }, 100);
        }
    }

    function down(height, time) {
        var i;
        for (i = height; i > 0; i--) {
            setTimeout(function () {
                cowboy.css('bottom', parseInt(cowboy.css('bottom')) - 1)
            }, time);
            height--;
        }
        if (parseInt(cowboy.css('bottom')) == 0) {
            in_air = false;
        }
        /*
                var i;
                for (i = jump_height; i > 0; i--) {
                    setTimeout(function () {
                        cowboy.css('bottom', parseInt(cowboy.css('bottom')) - 1)
                    }, jump_duration);
                }
                if (parseInt(cowboy.css('bottom')) == 0) {
                    jump_count = 0;
                    current_height = 0;
                } */
    }

    //Spellus en beweging achtergrond adhv snelheid spel
    anim_id = requestAnimationFrame(repeat);

    function repeat() {

        if (collision(cowboy, woodenbox) || collision(cowboy, woodenbox2)) {
            stop_the_game();
            return;
        }
        score_counter++;

        if (score_counter % 20 == 0) {
            score.text(parseInt(score.text()) + 1);
        }
        if (score_counter % 500 == 0) {
            speed++;
            background_speed += 0.1;
            box_speed += 0.1;
        }

        badguy_left(badguy1);
        badguy_left(badguy2);
        badguy_left(badguy3);
        badguy_left(badguy4);
        box_left(woodenbox);
        setTimeout(box_left(woodenbox2), 400);
        background_left(background_2, 2);
        background_left(background_3, 3);
        background_left(background_4, 4);
        background_left(background_5, 5);

        anim_id = requestAnimationFrame(repeat);
    }

    function stop_the_game() {
        game_over = true;
        restart_div.slideDown();
        restart_btn.focus();
    }

    restart_btn.click(function () {
        location.reload();
    });

    function background_left(background, indiv_speed) {
        var background_current_left = parseInt(background.css('left'));
        var background_width = parseInt(background.css('width'))
        var background_half = background_width / 2;
        if (background_current_left < -background_half) {
            background_current_left = 0;
        }
        background.css('left', background_current_left - (background_speed * indiv_speed));
    }

    //Beweging badguys
    function badguy_left(badguy) {
        var badguy_current_left = parseInt(badguy.css('left'));
        var distance = container_width + badguy_width;
        if (badguy_current_left < -badguy_width) {
            badguy_current_left = parseInt((Math.random() * (distance / 2)) + distance);
            var badguy_left = parseInt(Math.random() * (distance));
            badguy.css('left', badguy_left);
        }
        badguy.css('left', badguy_current_left - bad_speed);
    }

    function box_left(box) {
        var box_current_left = parseInt(box.css('left'));
        var distance = container_width + woodenbox_width;
        if (box_current_left < -woodenbox_width) {
            box_current_left = parseInt((Math.random() * (distance)) + distance);
            var box_left = parseInt(Math.random() * (distance));
            box.css('left', box_left);
        }
        box.css('left', box_current_left - box_speed);
    }

    function collision($div1, $div2) {
        var l1 = $div1.offset().left; //left
        var y1 = $div1.offset().top; //top
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = l1 + w1; //right
        var l2 = $div2.offset().left; //left
        var y2 = $div2.offset().top; //top
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = l2 + w2; //right

        if (b1 < y2 || y1 > b2 || r1 < l2 + 40 || l1 > r2 - 40) return false;
        return true;
    }

});

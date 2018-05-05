$(function () {

    'use strict';

    //DECLARATIES
    var anim_id;

    var cowboy = $('#cowboy'),
        obstacle = $('#obstacle'),
        obstacle2 = $('#obstacle2'),
        npc1 = $('#npc1'),
        npc2 = $('#npc2'),
        npc3 = $('#npc3'),
        npc4 = $('#npc4'),
        background_2 = $('#background_2'),
        background_3 = $('#background_3'),
        background_4 = $('#background_4'),
        background_5 = $('#background_5'),
        restart_div = $('#restart_div'),
        restart_btn = $('#restart'),
        score = $('#score');

    var container = $('#container'),
        container_left = parseInt(container.css('left')),
        container_width = parseInt(container.width()),
        container_height = parseInt(container.height()),
        cowboy_width = parseInt(cowboy.width()),
        cowboy_height = parseInt(cowboy.height()),
        npc_width = parseInt(npc1.width()),
        obstacle_width = parseInt(obstacle.width());

    var score_counter = 1,
        jump_height = 100,
        npc_speed = 12,
        background_speed = 2,
        obstacle_speed = 10,
        jump_duration = 1000;

    var move_right = false,
        move_left = false,
        move_jump = false,
        in_air = false,
        game_over = false;

    //Spawnen van de NPC's
    npc1.css('left', parseInt(Math.random() * (container_width + npc_width)));
    npc2.css('left', parseInt(Math.random() * (container_width + npc_width)));
    npc3.css('left', parseInt(Math.random() * (container_width + npc_width)));
    npc4.css('left', parseInt(Math.random() * (container_width + npc_width)));


    //Cowboy Controller
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

    function jump() {

        if (in_air == false) {
            in_air = true;
            up();
            down(jump_height, jump_duration);
        } else if (in_air == true) {
            up();
            down(jump_height, jump_duration);
        }

    }

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
    }


    //Spellus die elke tick herhaalt wordt.

    anim_id = requestAnimationFrame(repeat);

    function repeat() {

        if (collision(cowboy, obstacle) || collision(cowboy, obstacle2)) {
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
            obstacle_speed += 0.1;
        }

        npc_left(npc1);
        npc_left(npc2);
        npc_left(npc3);
        npc_left(npc4);
        obstacle_left(obstacle);
        setTimeout(obstacle_left(obstacle2), 400);
        background_left(background_2, 2);
        background_left(background_3, 3);
        background_left(background_4, 4);
        background_left(background_5, 5);

        anim_id = requestAnimationFrame(repeat);
    }

    //Einde van het spel
    function stop_the_game() {
        game_over = true;
        restart_div.slideDown();
        restart_btn.focus();
    }

    //Herstart het spel
    restart_btn.click(function () {
        location.reload();
    });

    //Het bewegen van de achtergronden met zelfgemaakt parallax-effect.
    function background_left(background, indiv_speed) {
        var background_current_left = parseInt(background.css('left'));
        var background_width = parseInt(background.css('width'))
        var background_half = background_width / 2;
        if (background_current_left < -background_half) {
            background_current_left = 0;
        }
        background.css('left', background_current_left - (background_speed * indiv_speed));
    }

    //Bewegen van de NPC's
    function npc_left(npc) {
        var npc_current_left = parseInt(npc.css('left'));
        var distance = container_width + npc_width;
        if (npc_current_left < -npc_width) {
            npc_current_left = parseInt((Math.random() * (distance / 2)) + distance);
            var npc_left = parseInt(Math.random() * (distance));
            npc.css('left', npc_left);
        }
        npc.css('left', npc_current_left - npc_speed);
    }

    //Bewegen van dee obstakels
    function obstacle_left(obstacle) {
        var obstacle_current_left = parseInt(obstacle.css('left'));
        var distance = container_width + obstacle_width;
        if (obstacle_current_left < -obstacle_width) {
            obstacle_current_left = parseInt((Math.random() * (distance)) + distance);
            var obstacle_left = parseInt(Math.random() * (distance));
            obstacle.css('left', obstacle_left);
        }
        obstacle.css('left', obstacle_current_left - obstacle_speed);
    }

    //Collision detection 
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

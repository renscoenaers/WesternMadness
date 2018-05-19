$(function () {

    'use strict';

    //DECLARATIES
    var anim_id;
    var cowboy = $('#cowboy'),
        obstacle1 = $('#obstacle1'),
        obstacle2 = $('#obstacle2'),
        obstacle3 = $('#obstacle3'),
        npc1 = $('#npc1'),
        npc2 = $('#npc2'),
        npc3 = $('#npc3'),
        npc4 = $('#npc4'),
        background_1 = $('#background_1'),
        background_2 = $('#background_2'),
        background_3 = $('#background_3'),
        background_4 = $('#background_4'),
        background_5 = $('#background_5'),
        restart_div = $('#restart_div'),
        restart_btn = $('#restart'),
        score = $('#score'),
        highscoretxt = $('#highscoretxt'),
        safezone = $('#safezone'),
        westernsong = new sound("sounds/westernmadness8bit.mp3"),
        entersandman = new sound("sounds/entersandman8bit.mp3"),
        duhast = new sound("sounds/duhast8bit.mp3"),
        trooper = new sound("sounds/trooper8bit.mp3"),
        shootingstars = new sound("sounds/shootingstars8bit.mp3"),
        gameoversong = new sound("sounds/gameover8bit.mp3"),
        song = new sound();

    var container = $('#container'),
        container_width = parseInt(container.width()),
        npc_width = parseInt(npc1.width()),
        cowboy_height = parseInt(cowboy.height()),
        obstacle_width = parseInt(obstacle1.width());

    var score_counter = 1,
        jump_height = (cowboy_height / 3 * 2),
        npc_speed = 14,
        background_speed = 4,
        obstacle_speed = 12,
        currentscore = 0;

    var best = JSON.parse(localStorage.getItem('highscore'));
    localStorage.setItem("highscore", JSON.stringify(best));

    var move_right = false,
        move_left = false,
        move_jump = false,
        in_air = false,
        game_over = false,
        obs_visible = false;

    //Spawnen van de NPC's
    npc1.css('left', parseInt(Math.random() * (container_width + npc_width)));
    npc2.css('left', parseInt(Math.random() * (container_width + npc_width)));
    npc3.css('left', parseInt(Math.random() * (container_width + npc_width)));
    npc4.css('left', parseInt(Math.random() * (container_width + npc_width)));


    //Sound functie van op https://www.w3schools.com/graphics/game_sound.asp
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        }
        this.stop = function () {
            this.sound.pause();
        }
    }

    //Detect if on mobile //not my code
    function detectmob() {
        if (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        } else {
            return false;
        }
    }

    var mobile = detectmob();

    //Cowboy Controller
    if (!mobile) {
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
    } else {
        document.getElementById("container").addEventListener("touchstart", jump);
    }


    function jump() {
        function up() {
            cowboy.css('bottom', parseInt(cowboy.css('bottom')) + jump_height);
        }

        function down() {
            cowboy.css('bottom', parseInt(cowboy.css('bottom')) - jump_height);
        }
        if (in_air == false) {
            in_air = true;
            up();
        } else if (in_air == true) {
            down();
            in_air = false;
        }
    }

    //Spellus die elke tick herhaalt wordt.
    anim_id = requestAnimationFrame(repeat);
    safeZone();
    playsong();

    function playsong() {
        westernsong.play();
        song = westernsong;
        var i = Math.floor(Math.random() * 10);
        switch (i) {
            case 1:
                song.stop();
                duhast.play();
                song = duhast;
                break;
            case 2:
                song.stop();
                entersandman.play();
                song = entersandman;
                break;
            case 3:
                song.stop();
                trooper.play();
                song = trooper;
                break;
            case 4:
                song.stop();
                shootingstars.play();
                song = shootingstars;
                break;
        }
    }



    function repeat() {
        if (collision(cowboy, obstacle1) || collision(cowboy, obstacle2) || collision(cowboy, obstacle3) && obs_visible == true) {
            if (obs_visible == true) {
                stop_the_game();
                return;
            }
        }
        score_counter++;
        highscoreUpdate();
        if (onGround() && obs_visible) {
            if (score_counter % 10 == 0) {
                score.text(parseInt(score.text()) + 1);
                currentscore++;
            }
            if (score_counter % 100 == 0) {
                background_speed += 0.1;
                obstacle_speed += 0.1;
                npc_speed += 0.1;
            }
        }
        animate_npcs();
        animate_bgs();
        animate_obs();

        anim_id = requestAnimationFrame(repeat);
    }

    //Highscores;
    function highscoreUpdate() {
        if (currentscore > best) {
            localStorage.setItem('highscore', JSON.stringify(currentscore));
            best = currentscore;
            highscoretxt.text(best);
        } else {
            highscoretxt.text(JSON.parse(localStorage.getItem('highscore')));
        }
    }

    //Animeer de obstakels
    function animate_obs() {
        if (obs_visible === true) {
            obstacle_left(obstacle1);
            setTimeout(obstacle_left(obstacle2), 4000);
            setTimeout(obstacle_left(obstacle3), 8000);
        }
    }

    function safeZone() {
        if (obs_visible === true) {
            obstacle_left(obstacle1);
            setTimeout(obstacle_left(obstacle2), 4000);
            setTimeout(obstacle_left(obstacle3), 8000);
        } else {
            setTimeout(function () {
                safezone.text('3');
            }, 1000);
            setTimeout(function () {
                safezone.text('2');
            }, 2000);
            setTimeout(function () {
                safezone.text('1');
            }, 3000);
            setTimeout(function () {
                safezone.css('display', 'none');
            }, 4000);
            setTimeout(function () {
                obs_visible = true;
                obstacle1.css('display', 'inherit');
                obstacle2.css('display', 'inherit');
                obstacle3.css('display', 'inherit');
            }, 4000);
        }
    }

    //Animeer alle NPC's
    function animate_npcs() {
        npc_left(npc1);
        npc_left(npc2);
        npc_left(npc3);
        npc_left(npc4);
    }

    //Animeer alle achtergronden
    function animate_bgs() {
        background_left(background_1, 5);
        background_left(background_2, 4);
        background_left(background_3, 3);
        background_left(background_4, 2);
        background_left(background_5, 1);
    }

    //Einde van het spel
    function stop_the_game() {
        game_over = true;
        restart_div.slideDown();
        song.stop();
        gameoversong.play();
    }

    //Herstart het spel
    restart_btn.click(function () {
        location.reload();
    });

    //Het bewegen van de achtergronden met zelfgemaakt parallax-effect.
    function background_left(background, indiv_speed) {
        var background_current_left = parseInt(background.css('left'));
        var background_width = parseInt(background.css('width'));
        var background_half = background_width / 2;
        if (background_current_left < -background_half) {
            background_current_left = 0;
        }
        background.css('left', background_current_left - (background_speed * (indiv_speed / 2)));
    }

    //Bewegen van de NPC's
    function npc_left(npc) {
        var npc_current_left = parseInt(npc.css('left'));
        var distance = container_width + npc_width;
        if (npc_current_left < -npc_width) {
            npc_current_left = parseInt(Math.random() * (distance / (Math.random() * 3)) + distance);
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

    //Checkt if on ground
    function onGround() {
        if (parseInt(cowboy.css('bottom')) == 0) {
            return true;
        } else return false;
    }

    //Collision detection - Niet zelf gecodeerd, wel aangepast
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
        if (b1 < y2 || y1 > b2 || r1 < (l2 + 32) || l1 > (r2 - 32)) {
            return false;
        } else {
            return true;
        }
    }
});

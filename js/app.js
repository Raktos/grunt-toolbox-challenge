"use strict";

$(document).ready(function() {
    $('#instructionsModal').modal();

    var gameBoard = $('#gameBoard');
    var stats = $('#stats');
    var tileBackSrc = 'img/tile-back.png';
    var timer;
    var matches;
    var misses;

    var tileFlipArr;

    var win = false;

    var  i;

    //fills an array with objects for the images
    var tiles = [];
    for(i = 1; i <= 32; ++i) {
        tiles.push({
            tileNum: i,
            src: 'img/tile' + i + '.jpg'
        });
    }

    $(window).resize(tileScale);

    $('.newGameButton').click(function() {
        populateBoard();
        initStats();
        gameplay();
    });

    function populateBoard() {
        //clear old gameBoard
        $(gameBoard).empty();
        gameBoard.fadeOut(250);

        //shuffle the tiles
        console.log(tiles);
        var shuffledTiles = _.shuffle(tiles);
        console.log(shuffledTiles);

        //select 8 of the shuffled tiles
        var selectedTiles = shuffledTiles.slice(0,8);
        console.log(selectedTiles);

        //create pair sets of selected tiles
        var tilePairs = [];
        _.forEach(selectedTiles, function(tile) {
            tilePairs.push(_.clone(tile));
            tilePairs.push(_.clone(tile));
        });
        console.log(tilePairs);
        tilePairs = _.shuffle(tilePairs); //shuffle the tile pairs so pairs are not always adjacent

        //begin populating the gameboard
        var row = $(document.createElement('div'));
        row.addClass('gameRow');
        var img;

        //TODO string for the key 'tile' is used more than once, create a defined variable for it
        //populate the gameboard
        _.forEach(tilePairs, function(tile, elemIndex) {
            //create a new row every 4 tiles (max 4 tiles per row)
            if(elemIndex > 0 && 0 == elemIndex % 4) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
                row.addClass('gameRow');
            }

            //create image and append it to the current row
            img = $(document.createElement('img'));
            img.attr({
                src: tileBackSrc,
                alt: 'image of tile ' + tile.tileNum
            });

            img.data('tile', tile);
            row.append(img);
        });
        gameBoard.append(row);

        tileScale();

        gameBoard.fadeIn(250);
    }

    //TODO animations on check are going way too fast
    function gameplay() {
        //flip tiles on click
        $('#gameBoard').find('img').click(function() {
            var img = $(this);
            var tile = img.data('tile');
            var flipNum;
            var prevImg;
            var prevTile;

            if(!tile.flipped) {
                animateFlip(img, tile);
                tileFlipArr.push(img);
                flipNum = tileFlipArr.length;

                if(0 == flipNum % 2) {
                    prevImg = tileFlipArr[flipNum - 2];
                    prevTile = prevImg.data('tile');

                    if(tile.tileNum == prevTile.tileNum) {
                        ++matches;
                    } else {
                        ++misses;
                        setTimeout(function() {
                            animateFlip(img, tile);
                            animateFlip(prevImg, prevTile);
                        }, 1000);
                    }
                } else {
                }
            }

            $('#matches').text(matches + ' matches');
            $('#misses').text(misses + ' misses');

            if(matches >= 8) {
                win = true;
            }

            if(win) {
                window.clearInterval(timer);
                $('#winModal').modal();
            }
        }); //onClick of gameBoard tiles
    }

    //animate the flip
    function animateFlip(img, tile) {
        img.fadeOut(100, function() {
            if(tile.flipped) {
                img.attr('src', tileBackSrc);
            } else {
                img.attr('src', tile.src);
            }
            img.fadeIn(100);
            tile.flipped = !tile.flipped;
        }); //after fadeOut
    }


    function startTimer() {
        //stop old timer
        window.clearInterval(timer);
        $('#elapsedSeconds').text('Time: ' + 0 + ' seconds');

        //start new timer
        var startTime = _.now();
        timer = window.setInterval(function() {
            var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            $('#elapsedSeconds').text('Time: ' + elapsedSeconds + ' seconds');

            //stop the timer at 10 seconds
            if(win) {
                window.clearInterval(timer);
            }
        }, 1000);
    }

    function initStats() {
        stats.fadeOut(250, function() {
            win = false;
            matches = 0;
            misses = 0;

            tileFlipArr = [];

            $('#matches').text('Matches: ' + matches);
            $('#misses').text('Misses: ' + misses);
            startTimer();
            stats.fadeIn(250);
        });
    }

    function tileScale() {
        var width = window.innerWidth * 0.15;
        var height = window.innerHeight * 0.2;
        var edge;
        if(width < height) {
            edge = width;
        } else {
            edge = height;
        }
        gameBoard.find('img').css({
            'height':edge + 'px',
            'width':edge + 'px',
            'border-radius':edge / 20 + 'px',
            'margin-right':edge / 40 + 'px',
            'margin-bottom':edge / 40 + 'px'
        });
    }
}); //onReady
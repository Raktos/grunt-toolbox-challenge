"use strict";

$(document).ready(function() {
    //open instructions on page load
    $('#helpModal').modal();

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
            src: 'img/tile' + i + '.jpg',
            flipped: false
        });
    }

    //resize tiles on window resize event
    $(window).resize(tileScale);

    //Opens instructions dialogue, changed buttons
    $('.helpButton').click(function() {
        var helpModal = $('#helpModal');
        helpModal.find('.newGameButton').css('display', 'none');
        helpModal.find('.helpDismissButton').css('display', 'inline');
        helpModal.modal();
    });

    //start a new game
    $('.newGameButton').click(function() {
        populateBoard();
        initStats();
        gameplay();
    });

    //create a fill a gameboard
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

        //TODO string for the key 'tile' is used more than once, create a defined variable for it maybe
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
    } //populateBoard()

    //registers clicks event to all tiles
    function gameplay() {
        //flip tiles on click
        gameBoard.find('img').click(function() {
            var img = $(this);
            var tile = img.data('tile');
            var flipNum;
            var prevImg;
            var prevTile;

            //only flip if he tile was upside down
            if(!tile.flipped) {
                animateFlip(img, tile);
                tileFlipArr.push(img);
                flipNum = tileFlipArr.length;

                //if this is an even tile flip
                if(0 == flipNum % 2) {
                    prevImg = tileFlipArr[flipNum - 2];
                    prevTile = prevImg.data('tile');

                    //check for a matched pair
                    if(tile.tileNum == prevTile.tileNum) {
                        ++matches;
                    } else {
                        ++misses;
                        setTimeout(function() {
                            animateFlip(img, tile);
                            animateFlip(prevImg, prevTile);
                        }, 750);
                    }
                }
            }

            $('#matches').text('Matches: ' + matches + ' (' + (8 - matches) + ' left)');
            $('#misses').text('Misses: ' + misses);

            if(matches >= 8) {
                win = true;
            }

            if(win) {
                window.clearInterval(timer);
                $('#winModal').modal();
            }
        }); //gameplay
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


    //start a timer
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

    //initialize stats
    function initStats() {
        //fade out before changing anything
        stats.fadeOut(250, function() {
            //reset stats to 0
            win = false;
            matches = 0;
            misses = 0;

            tileFlipArr = [];

            $('#matches').text('Matches: ' + matches + ' (' + (8 - matches) + ' left)');
            $('#misses').text('Misses: ' + misses);
            startTimer();
            stats.fadeIn(250);
        });
    }

    //scale tiles to window size
    //also scales columns
    function tileScale() {
        var width = window.innerWidth * 0.15;
        var height = window.innerHeight * 0.2;
        var edge;

        //TODO column size scaling
        //pick the smaller of relative height or width
        if(width < height) {
            edge = width;
        } else {
            edge = height;
        }

        //set image sizing
        gameBoard.find('img').css({
            'height':edge + 'px',
            'width':edge + 'px',
            'border-radius':edge / 20 + 'px',
            'margin-right':edge / 40 + 'px',
            'margin-bottom':edge / 40 + 'px'
        });
    }
}); //onReady
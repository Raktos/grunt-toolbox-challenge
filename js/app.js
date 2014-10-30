"use strict";

$(document).ready(function() {
    //open instructions on page load
    $('#helpModal').modal();

    var gameBoard = $('#gameBoard');
    var stats = $('#statControlWrap');
    var tileBackSrc = 'img/tile-back.png';
    var timer;
    var matches;
    var misses;

    var tileFlipArr;

//    var win = false;

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
        var tileElem;
        var flipper;
        var front;
        var back;
        var frontImg;
        var backImg;

        //TODO string for the key 'tile' is used more than once, create a defined variable for it maybe
        //populate the gameboard
        _.forEach(tilePairs, function(tile, elemIndex) {
            //create a new row every 4 tiles (max 4 tiles per row)
            if(elemIndex > 0 && 0 == elemIndex % 4) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
                row.addClass('gameRow');
            }

            //TODO frontImg and backImg may not be entirely necessary
            //create each element used in a tile
            tileElem = $(document.createElement('div'));
            flipper = $(document.createElement('div'));
            front = $(document.createElement('div'));
            back = $(document.createElement('div'));
            frontImg= $(document.createElement('img'));
            backImg = $(document.createElement('img'));

            //assign each element its necessary class
            tileElem.addClass('flipContainer');
            flipper.addClass('flipper');
            front.addClass('front');
            back.addClass('back');
            frontImg.addClass('frontImg');
            backImg.addClass('backImg');

            //put all the pieces together
            tileElem.append(flipper);
            flipper.append(front, back);
            front.append(frontImg);
            back.append(backImg);

            //assign the tile data to the container that accepts the click event
            tileElem.data('tile', tile);

            //assign the images
            frontImg.attr({
                src: tileBackSrc,
                alt: 'tile backside'
            });
            backImg.attr({
                src: tile.src,
                alt: 'image of tile ' + tile.tileNum
            });

            //put the tile in the row
            row.append(tileElem);
        });
        gameBoard.append(row); // finish gameboard population

        tileScale();

        gameBoard.fadeIn(250);
    } //populateBoard()

    //registers clicks event to all tiles
    function gameplay() {
        //initiates game play on click
        gameBoard.find('.flipContainer').click(function() {
            var tileElem = $(this);
            var tile = tileElem.data('tile');
            var flipNum;
            var prevTileElem;
            var prevTile;

            //only flip if he tile was upside down
            if(!tile.flipped) {
                animateFlip(tileElem, tile);
                tileFlipArr.push(tileElem);
                flipNum = tileFlipArr.length;

                //if this is an even tile flip
                if(0 == flipNum % 2) {
                    prevTileElem = tileFlipArr[flipNum - 2];
                    prevTile = prevTileElem.data('tile');

                    //check for a matched pair
                    if(tile.tileNum == prevTile.tileNum) {
                        ++matches;
                    } else {
                        ++misses;
                        setTimeout(function() {
                            animateFlip(tileElem, tile);
                            animateFlip(prevTileElem, prevTile);
                        }, 750); //1 second was too long.
                    }
                }
                $('#matches').text('Matches: ' + matches + ' (' + (8 - matches) + ' left)');
                $('#misses').text('Misses: ' + misses);
            }

            if(matches >= 8) {
                win();
            }
        }); //gameplay
    }

    //animate the flip
    function animateFlip(tileElem, tile) {
        tileElem.find('.flipper').toggleClass('flipperFlip');
        tile.flipped = !tile.flipped;
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
//            if(win) {
//                window.clearInterval(timer);
//            }
        }, 1000);
    }

    //initialize stats
    function initStats() {
        //fade out before changing anything
        stats.fadeOut(250, function() {
            //reset stats to 0
//            win = false;
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

        //pick the smaller of relative height or width
        if(width < height) {
            edge = width;
        } else {
            edge = height;
        }

        //set image sizing
        gameBoard.find('.flipContainer').css({
            'margin-right':edge / 40 + 'px',
            'margin-bottom':edge / 40 + 'px'
        });

        gameBoard.find('.flipContainer, .flipper, .front, .back, .frontImg, .backImg').css({
            'height':edge + 'px',
            'width':edge + 'px',
            'border-radius':edge / 20 + 'px'
        });
    }

    //display win information
    function win() {
        var winModal = $('#winModal');

        window.clearInterval(timer);
        winModal.find('p').text(
            'Congratulations! You won in ' +
            $('#elapsedSeconds').text().replace(/\D/g, '') + ' seconds with ' +
            misses + ' misses for a total of ' + tileFlipArr.length / 2 + ' turns!');
        winModal.modal();
    }
}); //onReady
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
    var score;
    var tileDataKey = 'tile';

    //for storing previous moves
    var tileFlipArr;

    var  i;

    //fills an array with objects for the images
    var tiles = [];
    for(i = 1; i <= 32; ++i) {
        tiles.push({
            tileNum: i,
            src: 'img/tile' + i + '.jpg',
            faceUp: false
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
        var shuffledTiles = _.shuffle(tiles);

        //select 8 of the shuffled tiles
        var selectedTiles = shuffledTiles.slice(0,8);

        //create pair sets of selected tiles
        var tilePairs = [];
        _.forEach(selectedTiles, function(tile) {
            tilePairs.push(_.clone(tile));
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs); //shuffle the tile pairs so pairs are not always adjacent

        //begin populating the gameboard
        var row = $(document.createElement('div'));
        row.addClass('gameRow');
        var tileContainer;
        var flipper;
        var back;
        var face;

        //populate the gameboard
        _.forEach(tilePairs, function(tile, elemIndex) {
            //create a new row every 4 tiles (max 4 tiles per row)
            if(elemIndex > 0 && 0 == elemIndex % 4) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
                row.addClass('gameRow');
            }

            //create each element used in a tile
            tileContainer = $(document.createElement('div'));
            flipper = $(document.createElement('div'));
            back = $(document.createElement('img'));
            face = $(document.createElement('img'));

            //assign each element its necessary class
            tileContainer.addClass('flipContainer');
            flipper.addClass('flipper');
            back.addClass('back');
            face.addClass('face');

            //put all the pieces together
            tileContainer.append(flipper);
            flipper.append(back, face);

            //assign the images
            back.attr({
                src: tileBackSrc,
                alt: 'tile backside'
            });
            face.attr({
                src: tile.src,
                alt: 'image of tile ' + tile.tileNum
            });

            //assign the tile data to the container that accepts the click event
            tileContainer.data(tileDataKey, tile);

            //put the tile in the row
            row.append(tileContainer);
        });
        gameBoard.append(row); // finish gameboard population

        tileScale();

        gameBoard.fadeIn(250);
    } //populateBoard()

    //registers clicks event to all tiles
    function gameplay() {
        //initiates game play on click
        gameBoard.find('.flipContainer').click(function() {
            var tileContainer = $(this);
            var tile = tileContainer.data(tileDataKey);
            var flipNum;
            var prevTileContainer;
            var prevTile;

            //only flip if he tile was upside down
            if(!tile.faceUp) {
                animateFlip(tileContainer, tile);
                tileFlipArr.push(tileContainer);
                flipNum = tileFlipArr.length;

                //if this is an even tile flip
                if(0 == flipNum % 2) {
                    prevTileContainer = tileFlipArr[flipNum - 2];
                    prevTile = prevTileContainer.data(tileDataKey);

                    //check for a matched pair
                    if(tile.tileNum == prevTile.tileNum) {
                        ++matches;
                    } else {
                        ++misses;
                        setTimeout(function() {
                            animateFlip(tileContainer, tile);
                            animateFlip(prevTileContainer, prevTile);
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
    function animateFlip(tileContainer, tile) {
        tileContainer.find('.flipper').toggleClass('flipperFlip');
        tile.faceUp = !tile.faceUp;
    }


    //start and run a timer; also update score
    function startTimer() {
        //stop old timer
        window.clearInterval(timer);
        $('#elapsedSeconds').text('Time: ' + 0 + ' seconds');

        //start new timer
        var startTime = _.now();
        timer = window.setInterval(function() {
            var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            $('#elapsedSeconds').text('Time: ' + elapsedSeconds + ' seconds');

            updateScore(elapsedSeconds);
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
            score = 0;

            tileFlipArr = [];

            $('#matches').text('Matches: ' + matches + ' (' + (8 - matches) + ' left)');
            $('#misses').text('Misses: ' + misses);
            $('#score').text('Score: ' + score);
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

        gameBoard.find('.flipContainer, .flipper, .back, .face, .backImg, .faceImg').css({
            'height':edge + 'px',
            'width':edge + 'px',
            'border-radius':edge / 20 + 'px'
        });
    }

    //TODO display score in winModal
    //display win information
    function win() {
        var winModal = $('#winModal');
        var time = parseInt($('#elapsedSeconds').text().replace(/\D/g, ''));
        updateScore(time);

        window.clearInterval(timer);
        winModal.find('p').text(
            'Congratulations! You won in ' +
            time + ' seconds with ' +
            misses + ' misses for a total of ' + tileFlipArr.length / 2 + ' turns!');
        winModal.modal();
    }

    //TODO decide on a score formula
    //update player score and display
    function updateScore(time) {
        //old score formula
        score = Math.floor(((matches / (time + 1)) / (misses + 1)) * 10000);
        $('#score').text('Score: ' + score);
    }
}); //onReady
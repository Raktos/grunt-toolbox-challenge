"use strict";

$(document).ready(function() {
    var tiles = [];
    var  i;

    //fillls an array with objects for the images
    for(i = 1; i <= 32; ++i) {
        tiles.push({
            tileNum: i,
            src: 'img/tile' + i + '.jpg'
        });
    }

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
    var gameBoard = $('#gameBoard');
    var row = $(document.createElement('div'));
    var img; //TODO ask about this

    //TODO string for he key 'tile' is used more than once, create a defined variable for it
    //populate the gameboard
    _.forEach(tilePairs, function(tile, elemIndex) {
        //create a new row every 4 tiles (max 4 tiles per row)
        if(elemIndex > 0 && 0 == elemIndex % 4) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }

        //create image and append it to the current row
        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'image of tile ' + tile.tileNum
        });

        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);

    //flip tiles on click
    $('#gameBoard img').click(function() {
        var img = $(this);
        var tile = img.data('tile');
        img.fadeOut(100, function() {
            if(tile.flipped) {
                img.attr('src', 'img/tile-back.png');
            } else {
                img.attr('src', tile.src);
            }
            img.fadeIn(100);
            tile.flipped = !tile.flipped;
        }); //after fadeOut
    }); //onClick of gameBoard tiles

    //make a timer
    var startTime = _.now();
    var timer = window.setInterval(function() {
        var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
        $('#elapsedSeconds').text(elapsedSeconds);

        //stop the timer at 10 seconds
        if(elapsedSeconds >= 10) {
            window.clearInterval(timer);
        }
    }, 1000);
}); //onReady
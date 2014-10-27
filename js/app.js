"use strict";

$(document).ready(function() {
    var tiles = [];
    var  i;

    for(i = 1; i <= 32; ++i) {
        tiles.push({
            tileNum: i,
            src: 'img/tile' + i + '.jpg'
        });
    }

    console.log(tiles);
    var shuffledTiles = _.shuffle(tiles);
    console.log(shuffledTiles);

    var selectedTiles = shuffledTiles.slice(0,8);
    console.log(selectedTiles);

    var tilePairs = [];
    _.forEach(selectedTiles, function(tile) {
        tilePairs.push(_.clone(tile));
        tilePairs.push(_.clone(tile));
    });
    console.log(tilePairs);

    
});
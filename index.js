class GamePuzzle {
    constructor(itemsAmount) {
        this.canvas = document.querySelector('canvas');
        this.itemsAmount = itemsAmount;
        this.ctx = this.canvas.getContext('2d');
        this.width = parseInt(this.canvas.width) / itemsAmount;
        this.height = parseInt(this.canvas.height) / itemsAmount;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);
        this.clicks = 0;
        this.arrOfValues;
        this.sortValues;
    }

    move(x, y, currentValues) {
        if (((x - 1 == this.nullX || x + 1 == this.nullX) && y == this.nullY)
            || ((y - 1 == this.nullY || y + 1 == this.nullY) && x == this.nullX)
        ) {
            currentValues[this.nullY][this.nullX] = currentValues[y][x];
            currentValues[y][x] = 0;
            this.ctx.clearRect(x * this.width + 1, y * this.height + 1, this.width - 2, this.height - 2);
            this.draw(currentValues);
            this.clicks++;
        }
    };

    getMixedItems() {
        let value = 0;
        let arr = new Array(this.itemsAmount);
        this.arrOfValues = new Array(this.itemsAmount);
        for (let i = 0; i < Math.pow(this.itemsAmount, 2); i++) {
            arr[i] = value;
            value++;
        }
        console.log(this.arrOfValues + "-MASSIVE");
        (arr.sort(function () {
            return Math.random() - 0.5;
        })).sort((function () {
            return Math.random() - 0.5;
        }));
        let k = 0;
        for (let i = 0; i < this.itemsAmount; i++) {
            this.arrOfValues[i] = new Array(this.itemsAmount);
            for (let j = 0; j < this.itemsAmount; j++) {
                this.arrOfValues[i][j] = arr[k];
                k++;
            }
        }
        console.log(this.arrOfValues);
        return this.arrOfValues;
    }

    draw(currentValues) {
        this.ctx.font = "bold " +
            (this.width / 2) + "px Sans";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        for (let i = 0; i < this.itemsAmount; i++) {
            for (let j = 0; j < this.itemsAmount; j++) {
                if (currentValues[i][j] > 0) {
                    this.ctx.fillStyle = 'greenyellow';
                    this.ctx.fillRect(j * this.width + 1, i * this.height + 1, this.width - 2, this.height - 2);
                    this.ctx.fillStyle = "#222";
                    this.ctx.fillText(currentValues[i][j], j * this.width + this.width / 2, i * this.width + this.width / 2);
                    console.log(this.width);
                }
                else {
                    this.nullX = j;
                    this.nullY = i;
                }
                console.log(this.nullX, this.nullY);
            }
        }
    }
    victory(currentValues) {
        this.getSortValues();

        let res = true;
        for (let i = 0; i < this.itemsAmount; i++) {
            for (let j = 0; j < this.itemsAmount; j++) {
                if (this.sortValues[i][j] !== currentValues[i][j]) {
                    return false;
                }
            }
        }
        return res;
    };

    getSortValues() {
        let value = 1;
        let arr = new Array(this.itemsAmount);
        this.sortValues = new Array(this.itemsAmount);
        for (let i = 0; i < Math.pow(this.itemsAmount, 2); i++) {
            arr[i] = value;
            value++;
            if (i === Math.pow(this.itemsAmount, 2) - 1) {
                arr[i] = 0;
            }
        }

        let k = 0;
        for (let i = 0; i < this.itemsAmount; i++) {
            this.sortValues[i] = new Array(this.itemsAmount);
            for (let j = 0; j < this.itemsAmount; j++) {
                this.sortValues[i][j] = arr[k];
                k++;
            }
        }
        console.log(this.sortValues + 'sortArray');
    }

}


function loadTheGameField() {
    let canvas = '<canvas class = "canvas" id = "canvas"></canvas>';
    let container = document.createElement('div');
    let canvasWrapper = document.createElement('div');
    container.classList.add('container');
    canvasWrapper.classList.add('canvas-wrapper');
    canvasWrapper.innerHTML += canvas;
    container.append(canvasWrapper);
    document.body.append(container);
    document.getElementById('canvas').setAttribute('width', `400vw`);
    document.getElementById('canvas').setAttribute('height', `400vh`);
    let options = document.createElement('div');
    options.classList.add('options');
    let list = document.createElement('ul');
    list.classList.add('options-list');
    for (let i = 0; i < 7; i++) {
        let listItem = document.createElement('li');
        listItem.innerHTML = `${i + 2} x ${i + 2}`;
        listItem.setAttribute('id', i + 2);
        listItem.classList.add('listItem');
        list.append(listItem);

    }
    options.append(list);
    canvasWrapper.append(options);
}
loadTheGameField();

let newGame = new GamePuzzle(2);
let currentValues = newGame.getMixedItems();
newGame.draw(currentValues);


document.querySelector('ul').addEventListener('mousedown', function (event) {
    let pressedKey = event.target.closest('li');
    newGame = new GamePuzzle(pressedKey.getAttribute('id'));
    currentValues = newGame.getMixedItems();
    newGame.draw(currentValues);
});


document.querySelector('canvas').addEventListener('mouseup', function (e) {
    var x = (e.pageX - newGame.canvas.offsetLeft) / newGame.width | 0;
    var y = (e.pageY - newGame.canvas.offsetTop) / newGame.height | 0;
    console.log(e.pageY, newGame.canvas.offsetTop, e.pageX, newGame.canvas.offsetLeft);
    newGame.move(x, y, currentValues);
});

document.querySelector('canvas').addEventListener('click', function (e) {

    if (newGame.victory(currentValues)) {
        setTimeout(function () { alert("Собрано за " + newGame.clicks + " касание!") }, 500);
    }
});

console.log(newGame.getMixedItems() + 'mixedValues');
console.log(newGame.getSortValues() + 'sortValues');


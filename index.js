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
        this.lastRecord = localStorage.getItem('lastRecord') | 0;
        this.currentSize = localStorage.getItem('currentSize') | 0;
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
        if (this.clicks < this.lastRecord)
        localStorage.setAttribute('lastRecord', this.clicks);
        this.lastRecord = this.clicks;
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
    document.getElementById('canvas').setAttribute('width', `600`);
    document.getElementById('canvas').setAttribute('height', `600`);
    let sizeInfo = document.createElement('div');
    sizeInfo.classList.add('size-info');
    sizeInfo.innerHTML = `Размер поля: ${2} x ${2}`
    canvasWrapper.append(sizeInfo);
    let options = document.createElement('div');
    options.classList.add('options');
    let list = document.createElement('ul');
    list.classList.add('options-list');
    for (let i = 0; i < 7; i++) {
        let listItem = document.createElement('li');
        listItem.innerHTML = `${i + 2} x ${i + 2}`;
        listItem.setAttribute('id', i + 2);
        listItem.classList.add('list-item');
        list.append(listItem);
    }
    options.append(list);
    canvasWrapper.append(options);
    let menu = document.createElement('div');
    menu.classList.add('menu');
    menu.insertAdjacentHTML('afterbegin', `<div class = "menu-item" id = "split">Размешать и начать</div><div class = "menu-item" id = "stop">Стоп</div><div class = "menu-item" id = "save">Сохранить</div><div class = "menu-item" id = "results">Результаты</div>`);
    canvasWrapper.prepend(menu);
}
loadTheGameField();

let newGame = new GamePuzzle(2);
let currentValues = newGame.getMixedItems();
newGame.draw(currentValues);


document.querySelector('ul').addEventListener('mousedown', function (event) {
    let pressedKey = event.target.closest('li');
    let size = pressedKey.getAttribute('id');
    localStorage.setItem('currentSize', size);
    document.querySelector('.size-info').innerHTML = `Размер поля: ${size} x ${size}`
    newGame = new GamePuzzle(size);
    currentValues = newGame.getMixedItems();
    newGame.draw(currentValues);
});


document.querySelector('canvas').addEventListener('mouseup', function (e) {
    var x = (e.pageX - newGame.canvas.offsetLeft) / newGame.width | 0;
    var y = (e.pageY - newGame.canvas.offsetTop) / newGame.height | 0;
    console.log(e.pageY, newGame.canvas.offsetTop, e.pageX, newGame.canvas.offsetLeft);
    newGame.move(x, y, currentValues);
});

document.querySelector('canvas').addEventListener('click', function (event) {
    if (newGame.victory(currentValues)) {
        
        setTimeout(function () { alert("Собрано за " + newGame.clicks + " касание!") }, 500);
    }
});

function menuEventHandler(event) {
    if (event.target.closest('div').getAttribute('id') === 'split') {
        let currentSize = newGame.currentSize;
        newGame = new GamePuzzle(currentSize);
        currentValues = newGame.getMixedItems();
        newGame.draw(currentValues);
        return;
    }
    if (event.target.closest('div').getAttribute('id') === 'stop') {
        alert(`current step is ${newGame.clicks}`);
        return;
    }
    if (event.target.closest('div').getAttribute('id') === 'save') {
        localStorage.setItem('lastRecord', newGame.clicks);
        alert(` YOUR LAST RECORD IS ${newGame.lastRecord}`);
        return;
    }
    if (event.target.closest('div').getAttribute('id') === 'results') {
        localStorage.setItem('lastRecord', newGame.clicks);
        alert(` Your current result is ${newGame.clicks} your Record is ${newGame.lastRecord}`);
        return;
    }
}

document.querySelector('.menu').addEventListener('click', menuEventHandler);

console.log(newGame.getMixedItems() + 'mixedValues');
console.log(newGame.getSortValues() + 'sortValues');


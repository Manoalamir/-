document.addEventListener('DOMContentLoaded', () => {
    const car = document.getElementById('car');
    let carPosition = 175;
    const gameContainer = document.querySelector('.game-container');
    const road = gameContainer.querySelector('.road');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const timeDisplay = document.getElementById('time');
    const highScoreDisplay = document.getElementById('high-score');
    const levelDisplay = document.getElementById('level');
    let gameInterval;
    let obstacleInterval;
    let timeInterval;
    let isGameActive = false;
    let time = 0;
    let highScore = parseInt(localStorage.getItem('highScore')) || 0;
    let level = 1;
    let speed = 2;
    let position = 0;

    highScoreDisplay.textContent = highScore;

    const carSound = new Audio('car-sound.mp3');
    carSound.loop = true;

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);

    document.addEventListener('keydown', (event) => {
        if (!isGameActive) return;

        switch (event.key) {
            case 'ArrowLeft':
                if (carPosition > 0) carPosition -= 10; // Increase movement speed
                break;
            case 'ArrowRight':
                if (carPosition < 350) carPosition += 10; // Increase movement speed
                break;
        }
        car.style.left = carPosition + 'px';
    });

    function startGame() {
        isGameActive = true;
        startBtn.style.display = 'none';
        restartBtn.style.display = 'block';
        carSound.play();
        gameInterval = requestAnimationFrame(moveRoad);
        obstacleInterval = setInterval(createObstacle, 2000 - level * 50);
        timeInterval = setInterval(updateTime, 1000);
    }

    function restartGame() {
        window.location.reload();
    }

    function moveRoad() {
        if (!isGameActive) return;

        position += speed;
        if (position > 40) position = 0;
        road.style.backgroundPositionY = position + 'px';
        moveObstacles();
        checkCollision();
        gameInterval = requestAnimationFrame(moveRoad);
    }

    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = Math.floor(Math.random() * 350) + 'px';
        road.appendChild(obstacle);
    }

    function moveObstacles() {
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => {
            let obstacleTop = parseInt(window.getComputedStyle(obstacle).getPropertyValue('top'));
            if (obstacleTop >= 600) {
                obstacle.remove();
            } else {
                obstacle.style.top = (obstacleTop + speed) + 'px';
            }
        });
    }

    function checkCollision() {
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => {
            const carRect = car.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();

            if (carRect.left < obstacleRect.left + obstacleRect.width &&
                carRect.left + carRect.width > obstacleRect.left &&
                carRect.top < obstacleRect.top + obstacleRect.height &&
                carRect.height + carRect.top > obstacleRect.top) {
                alert('تصادم! انتهت اللعبة.');
                isGameActive = false;
                carSound.pause();
                cancelAnimationFrame(gameInterval);
                clearInterval(obstacleInterval);
                clearInterval(timeInterval);
                if (time > highScore) {
                    highScore = time;
                    localStorage.setItem('highScore', highScore);
                    highScoreDisplay.textContent = highScore;
                }
            }
        });
    }

    function updateTime() {
        time++;
        timeDisplay.textContent = time;
        if (time % 10 === 0) {
            level++;
            levelDisplay.textContent = level;
            speed += 0.5;
            clearInterval(obstacleInterval);
            obstacleInterval = setInterval(createObstacle, 2000 - level * 50);
        }
    }
});


// GameCanvas.js
import React, { useRef, useEffect, useState } from "react";
import { tileSize, maze, findFreeCell, bonuses, collectBonuses, checkCollision } from "./MazeGenerator";
import heroSprite from "./assets/hero.png";
const initialPosition = findFreeCell();

const hero = {
  x: initialPosition.x,
  y: initialPosition.y,
  size: tileSize,
  sprite: new Image(),
  isMoving: true,
  frameWidth: tileSize - 3, // Ширина одного кадру в спрайтовій смузі
  frameHeight: tileSize, // Висота одного кадру в спрайтовій смузі
  currentFrame: 0, // Поточний кадр для відображення
  totalFrames: 9, // Загальна кількість кадрів в анімації ходьби
  directionY: 98,
};
hero.sprite.src = heroSprite; // Встановлюємо джерело зображення спрайта
// Функция для отрисовки бонусов
function drawBonuses(context) {
  context.fillStyle = "gold"; // Цвет бонусов
  bonuses.forEach((bonus) => {
    context.beginPath();
    context.arc(bonus.x + tileSize / 2, bonus.y + tileSize / 2, tileSize / 4, 0, 2 * Math.PI);
    context.fill();
  });
}

function GameCanvas() {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState(hero);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    // Обновление позиции игрока
    const movePlayer = (dx, dy) => {
      const newPos = { ...player, x: player.x + dx, y: player.y + dy };
      if (!checkCollision(newPos, maze)) {
        // Оновлення позиції гравця
        setPlayer(newPos);
        // Перевіряємо і оновлюємо бонуси, якщо вони зібрані
        collectBonuses(newPos, bonuses);
      }
    };

    const drawMaze = () => {
      maze.forEach((row, y) => {
        row.forEach((cell, x) => {
          context.fillStyle = cell === 1 ? "black" : "white";
          context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        });
      });
    };

    const drawPlayer = () => {
      //   context.fillStyle = "blue";
      context.drawImage(
        hero.sprite,
        hero.frameWidth * hero.currentFrame,
        hero.directionY, // Y-позиція на спрайтовій смузі (якщо є різні рядки для різних напрямків) н-98 л-121 п-167 в-144;
        hero.frameWidth,
        hero.frameHeight,
        player.x,
        player.y,
        hero.frameWidth,
        hero.frameHeight
      );

      //context.drawImage(player.sprite, player.x, player.y, player.size, player.size);
      //   context.fillRect(player.x, player.y, player.size, player.size);
      // Оновлення кадру
      if (player.isMoving) {
        hero.currentFrame = (hero.currentFrame + 1) % hero.totalFrames;
      } else {
        // Можна встановити статичний кадр, коли герой не рухається
        hero.currentFrame = 0;
      }
    };
    if (hero.sprite.complete && hero.sprite.naturalHeight !== 0) {
      drawPlayer(); 
    } else {
      hero.sprite.onload = () => {
        drawPlayer(); // Перерисовуємо гравця після завантаження зображення
      };
    }

    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawMaze(context);
      drawBonuses(context); // Отрисовать бонусы

      drawPlayer(context);
    };

    render();

    const handleKeyDown = (e) => {
      const speed = 5;
      switch (e.key) {
        //н-98 л-121 п-167 в-144
        case "ArrowUp":
          hero.directionY = 144;
          movePlayer(0, -speed);
          break;
        case "ArrowDown":
          hero.directionY = 98;
          movePlayer(0, speed);
          break;
        case "ArrowLeft":
          hero.directionY = 119;
          movePlayer(-speed, 0);
          break;
        case "ArrowRight":
          hero.directionY = 167;
          movePlayer(speed, 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, bonuses]);

  return <canvas ref={canvasRef} width={1000} height={1000} />;
}

export default GameCanvas;

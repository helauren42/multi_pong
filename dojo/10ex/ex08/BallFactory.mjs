import {Ball} from "./Ball.mjs";

export function createBall(type)
{
    switch (type)
    {
        case 'fast':
            return new Ball(10, 10, 20, 20);
          case 'slow':
            return new Ball(10, 10, 2, 2);
          case 'large':
            return new Ball(50, 50, 5, 5);
          default:
            return new Ball(10, 10, 10, 10);
    }
}

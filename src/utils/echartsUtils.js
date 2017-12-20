export const clipRectByRect = function (targetRect, rect) {
  var x = Math.max(targetRect.x, rect.x);
  var x2 = Math.min(targetRect.x + targetRect.width, rect.x + rect.width);
  var y = Math.max(targetRect.y, rect.y);
  var y2 = Math.min(targetRect.y + targetRect.height, rect.y + rect.height);

  if (x2 >= x && y2 >= y) {
    return {
      x: x,
      y: y,
      width: x2 - x,
      height: y2 - y
    };
  }
};

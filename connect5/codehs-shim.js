// Minimal shim that implements enough of the CodeHS-style API used by connect5.js.
// Save this as codehs-shim.js alongside connect5.js and index.html.

// Canvas & context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Internal state
let canvasW = 456;
let canvasH = 400;
let backgroundColor = '#000000';
const drawables = []; // objects added via add()
const registeredMouseHandler = { fn: null };
const registeredKeyHandler = { fn: null };

// Basic helpers that connect5.js expects
function setSize(w, h) {
  canvasW = w; canvasH = h;
  canvas.width = w;
  canvas.height = h;
  redraw();
}
function getWidth(){ return canvasW; }
function getHeight(){ return canvasH; }
function setBackgroundColor(color){
  backgroundColor = colorToHex(color);
  redraw();
}

// Simple Color map (strings must match what connect5.js expects, e.g. "#FFFFFF")
const Color = {
  white: '#FFFFFF',
  black: '#000000',
  red: '#FF0000',
  yellow: '#FFFF00',
  blue: '#0000FF'
};

// Utility to accept either hex string or Color.* value and return hex string
function colorToHex(c){
  if(!c) return '#000000';
  if(typeof c === 'string') return c;
  return String(c);
}

// Grid class used by the game to store Circles
class Grid {
  constructor(rows, cols){
    this.rows = rows;
    this.cols = cols;
    this._data = [];
    for(let r=0;r<rows;r++){
      this._data[r] = new Array(cols).fill(null);
    }
  }
  set(r,c, val){
    this._data[r][c] = val;
  }
  get(r,c){
    return this._data[r][c];
  }
}

// Circle primitive
class Circle {
  constructor(radius){
    this.type = 'circle';
    this.r = radius;
    this.x = 0;
    this.y = 0;
    this._color = '#000000';
    this._added = false;
  }
  setColor(c){
    this._color = colorToHex(c);
    // Important: some code checks getColor() equality to "#FFFFFF"
    // so always return uppercase hex
    this._color = this._color.toUpperCase();
    redraw();
  }
  getColor(){
    return (this._color || '#000000').toUpperCase();
  }
  setPosition(x,y){
    this.x = x;
    this.y = y;
    redraw();
  }
}

// Text primitive (very small subset)
class Text {
  constructor(text, font){
    this.type = 'text';
    this.text = text;
    this.font = font || '16px Arial';
    this.x = 0;
    this.y = 0;
  }
  setPosition(x,y){
    this.x = x; this.y = y;
    redraw();
  }
  getWidth(){
    ctx.save();
    ctx.font = this.font;
    const w = ctx.measureText(this.text).width;
    ctx.restore();
    return w;
  }
}

// Add a drawable to the scene
function add(obj){
  // Avoid duplicates
  if(!drawables.includes(obj)) drawables.push(obj);
  redraw();
}

// Event registration
function keyDownMethod(fn){
  registeredKeyHandler.fn = fn;
}
function mouseClickMethod(fn){
  registeredMouseHandler.fn = fn;
}

// Keyboard utility
const Keyboard = {
  letter(ch){
    // Return keyCode for a single char (space, letters, etc.)
    if (!ch || ch.length === 0) return 0;
    return ch.charCodeAt(0);
  }
};

// Convert browser mouse event to the tiny wrapper connect5.js expects
function makeClickWrapper(evt){
  // get canvas-relative coords
  const rect = canvas.getBoundingClientRect();
  const x = evt.clientX - rect.left;
  const y = evt.clientY - rect.top;
  return {
    getX(){ return x; },
    getY(){ return y; }
  };
}

// Hook browser events to registered handlers
window.addEventListener('keydown', function(e){
  if (registeredKeyHandler.fn) {
    // provide event with keyCode preserved
    registeredKeyHandler.fn(e);
  }
});
canvas.addEventListener('click', function(e){
  if (registeredMouseHandler.fn) {
    registeredMouseHandler.fn(makeClickWrapper(e));
  }
});

// Drawing logic
function clearCanvas(){
  ctx.fillStyle = backgroundColor || '#000000';
  ctx.fillRect(0,0,canvasW,canvasH);
}
function redraw(){
  if(!ctx) return;
  // clear
  clearCanvas();
  // Draw all circles and texts
  for(const obj of drawables){
    if(obj.type === 'circle'){
      ctx.beginPath();
      ctx.fillStyle = obj.getColor ? obj.getColor() : (obj._color || '#000000');
      ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI*2);
      ctx.fill();
      ctx.closePath();
    } else if(obj.type === 'text'){
      ctx.save();
      ctx.font = obj.font || '16px Arial';
      ctx.fillStyle = '#FFFFFF';
      // Text in the original game likely expects y as baseline equal to provided coordinate
      ctx.fillText(obj.text, obj.x, obj.y);
      ctx.restore();
    }
  }
}

// expose to global scope (CodeHS-style API)
window.setSize = setSize;
window.setBackgroundColor = setBackgroundColor;
window.Color = Color;
window.Grid = Grid;
window.Circle = Circle;
window.add = add;
window.keyDownMethod = keyDownMethod;
window.mouseClickMethod = mouseClickMethod;
window.Keyboard = Keyboard;
window.Text = Text;
window.getWidth = getWidth;
window.getHeight = getHeight;

// Initialize default canvas size used by the original script if it calls setSize immediately
setSize(canvasW, canvasH);

var drawPoolLotteryData = 0.0;   // 数据量
var canvas = document.getElementById("drawPoolLottery");
var ctx  = canvas.getContext("2d");
var M = Math;
var Sin = M.sin;
var Cos = M.cos;
var Sqrt = M.sqrt;
var Pow = M.pow;
var PI = M.PI;
var Round = M.round;
var oW = canvas.width = 250;
var oH = canvas.height = 250;
  // 线宽
var lineWidth = 2;
  // 大半径
var r = (oW / 2);
var cR = r - 10*lineWidth;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  // 水波动画初始参数
var axisLength = 2*r - 16*lineWidth;  // Sin 图形长度
var unit = axisLength / 9; // 波浪宽
var range = .4 // 浪幅
var nowrange = range;  
var xoffset = 8*lineWidth; // x 轴偏移量
var sp = 0; // 周期偏移量
var nowdata = 0;
var waveupsp = 0.006; // 水波上涨速度
  // 圆动画初始参数
var arcStack = [];  // 圆栈
var bR = r-8*lineWidth;
var soffset = -(PI/2); // 圆动画起始位置
var circleLock = true; // 起始动画锁
  // 获取圆动画轨迹点集
  for(var i = soffset; i< soffset + 2*PI; i+=1/(8*PI)) {
    arcStack.push([
      r + bR * Cos(i),
      r + bR * Sin(i)
    ])
  }
  // 圆起始点
var cStartPoint = arcStack.shift();  
  ctx.strokeStyle = "#1c86d1";
  ctx.moveTo(cStartPoint[0],cStartPoint[1]);
  // 开始渲染
  render();  
  function drawSine () {
    ctx.beginPath();
    ctx.save();
    var Stack = []; // 记录起始点和终点坐标
    for (var i = xoffset; i<=xoffset + axisLength; i+=20/axisLength) {
      var x = sp + (xoffset + i) / unit;
      var y = Sin(x) * nowrange;
      var dx = i;
      var dy = 2*cR*(1-nowdata) + (r - cR) - (unit * y);
      ctx.lineTo(dx, dy);
      Stack.push([dx,dy])
    }
    // 获取初始点和结束点
    var startP = Stack[0]
    var endP = Stack[Stack.length - 1]
    ctx.lineTo(xoffset + axisLength,oW);
    ctx.lineTo(xoffset,oW);
    ctx.lineTo(startP[0], startP[1])
    ctx.fillStyle = "#f6b71e";
    ctx.fill();
    ctx.restore();
  }

  function drawText () {
    ctx.globalCompositeOperation = 'source-over';
    var size = 0.3*cR;
    ctx.font = 'bold ' + size + 'px Microsoft Yahei';
    txt = (drawPoolLotteryData.toFixed(4)*100).toFixed(2) + '%';
    var fonty = r + size/2;
    var fontx = r - size * 0.8;
    ctx.fillStyle = "white";
    ctx.textAlign = 'center';
    ctx.fillText(txt, r+5, r+8)
  }
  //最外面淡黄色圈
  function drawCircle(){
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'gold';
    ctx.arc(r, r, cR+7, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }
  //灰色圆圈
  function grayCircle(){
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#eaeaea';
    ctx.arc(r, r, cR-3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();
  }
  //橘黄色进度圈
  function orangeCircle(){
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    //使用这个使圆环两端是圆弧形状
    ctx.lineCap = 'round';
    ctx.arc(r, r, cR-3,0 * (Math.PI / 180.0) - (Math.PI / 2),(nowdata * 360) * (Math.PI / 180.0) - (Math.PI / 2));
    ctx.stroke();
    ctx.save()
  }
  //裁剪中间水圈
  function clipCircle(){
    ctx.beginPath();
    ctx.arc(r, r, cR-6, 0, 2 * Math.PI,false);
    ctx.clip();
  }
  //渲染canvas
  function render () {
    ctx.clearRect(0,0,oW,oH);
    //最外面淡黄色圈
    drawCircle();
    //灰色圆圈  
    grayCircle();
    //橘黄色进度圈
    orangeCircle();
    //裁剪中间水圈  
    clipCircle();
    if (drawPoolLotteryData >= 0.85) {
      if (nowrange > range/4) {
        var t = range * 0.01;
        nowrange -= t;   
      }
    } else if (drawPoolLotteryData <= 0.1) {
      if (nowrange < range*1.5) {
        var t = range * 0.01;
        nowrange += t;   
      }
    } else {
      if (nowrange <= range) {
        var t = range * 0.01;
        nowrange += t;   
      }      
      if (nowrange >= range) {
        var t = range * 0.01;
        nowrange -= t;
      }
    }
    if((drawPoolLotteryData - nowdata) > 0) {
      nowdata += waveupsp;      
    }
    if((drawPoolLotteryData - nowdata) < 0){
      nowdata -= waveupsp
    }
    sp += 0.07;
    // 开始水波动画
    drawSine();
    // 写字
    drawText();  
    requestAnimationFrame(render)
  }
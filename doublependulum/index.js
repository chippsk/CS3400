var simulator;

function double_pendulum(canvas) {

  if ( ! canvas || ! canvas.getContext ) { return false; }
  this.canvas = canvas;
  var ctx = this.ctx = canvas.getContext("2d");

  this.qp = new Array(4);
  this.qp_ = new Array(4);

  for(var j=0; j<4; ++j) {
    this.qp[j] = 0;
    this.qp_[j] = 0;
  }
  this.qp[0] = 0.5;

  this.length1 = 1;
  this.length2 = 0.5;

  this.mass1 = 1;
  this.mass2 = 0.5;

  this.gravity = 9.8;

  var width = canvas.width;
  var height = canvas.height;

  var bgcanvas = this.bgcanvas = document.createElement("canvas");
  bgcanvas.width = width;
  bgcanvas.height = height;
  var bgctx = this.bgctx = bgcanvas.getContext("2d");

  this.update_x2y2_canvas();

  this.timer = setInterval("simulator.update();", 1000/30);

}

double_pendulum.prototype.dt = (1/30)/5;
double_pendulum.prototype.size_ref = 256;
double_pendulum.prototype.linewidth_ref = 5;


double_pendulum.prototype.update_fixed_point = function()
{

  var qp_m = new Array(4);

  for(var i = 0; i < 4; i++)
  {
    qp_m[i] = 0.5 * ( this.qp[i] + this.qp_[i] );
  }

  var delta_theta = qp_m[0] - qp_m[1];
  var cos_delta = Math.cos(delta_theta);
  var sin_delta = Math.sin(delta_theta);
  var sin_2delta = 2 * cos_delta * sin_delta;

  var l1l2m1pm2sin2delta = this.length1 * this.length2 * ( this.mass1 + this.mass2 * sin_delta * sin_delta);
  
  var sin1 = Math.sin(qp_m[0]);
  var sin2 = Math.sin(qp_m[1]);
  var p1 = qp_m[2];
  var p2 = qp_m[3];

  var c1 = p1 * p2 * sin_delta / l1l2m1pm2sin2delta;
  var c2 = (this.length2 * this.length2 * this.mass2 * p1 * p1 + this.length1 * this.length1 * ( this.mass1 + this.mass2 ) * p2 * p2 - 2 * this.length1 * this.length2 * this.mass2 * p1 * p2 * cos_delta) * sin_2delta / ( 2 * l1l2m1pm2sin2delta * l1l2m1pm2sin2delta );

  var qp_0_new = this.qp[0] + this.dt * (this.length2 * p1 - this.length1 * p2 * cos_delta ) / ( l1l2m1pm2sin2delta * this.length1 );
  this.qp_[0] = qp_0_new;

  var qp_1_new = this.qp[1] + this.dt * (this.length1 * (this.mass1 + this.mass2) * p2 - this.length2 * this.mass2 * p1 * cos_delta) / ( l1l2m1pm2sin2delta * this.length2 * this.mass2 );
  this.qp_[1] = qp_1_new;

  this.qp_[2] = this.qp[2] + this.dt * ( - ( this.mass1 + this.mass2 ) * this.gravity * this.length1 * sin1 - c1 + c2);
  this.qp_[3] = this.qp[3] + this.dt * ( - this.mass2 * this.gravity * this.length2 * sin2 + c1 - c2 );

}
//returns position and change in position
double_pendulum.prototype.calc_energy = function() {

  var delta_theta = this.qp[0] - this.qp[1];
  var cos_delta = Math.cos(delta_theta);
  var sin_delta = Math.sin(delta_theta);

  var cos1 = Math.cos(this.qp[0]);
  var cos2 = Math.cos(this.qp[1]);
  var p1 = this.qp[2];
  var p2 = this.qp[3];

  var K = ( this.length2*this.length2 * this.mass2 * p1*p1 + this.length1 * this.length1 * ( this.mass1 + this.mass2 ) * p2 * p2 - 2 * this.mass2 * this.length1 * this.length2 * p1 * p2 * cos_delta ) / ( 2 * this.length1 * this.length1 * this.length2 * this.length2 * this.mass2 * (this.mass1 + this.mass2 * sin_delta * sin_delta ) );
  var U = - this.mass2 * this.gravity * this.length2 * cos2 - ( this.mass1 + this.mass2 ) * this.gravity * this.length1 * cos1;

  return K + U;
}
//Translating from world coords to device coords
double_pendulum.prototype.update_x2y2_canvas = function() {
  var width = this.canvas.width;
  var height = this.canvas.height;
  var size = Math.min(width, height);

  var length_canvas = size / 4;

  var center_x = width / 2;
  var center_y = height / 2;

  var theta1 = this.qp[0];
  var theta2 = this.qp[1];

  var x1 = this.length1 * Math.sin(theta1);
  var y1 = this.length1 * Math.cos(theta1);
  var x2 = this.length2 * Math.sin(theta2);
  var y2 = this.length2 * Math.cos(theta2);

  this.x2_canvas_old = center_x + length_canvas * (x1 + x2);
  this.y2_canvas_old = center_x + length_canvas * (y1 + y2);

  var bgctx = this.bgctx;
  bgctx.fillStyle="rgb(0,0,0)";
  var width = this.canvas.width;
  var height = this.canvas.height;
  bgctx.fillRect(0, 0, width ,height);

  
}

//Update coords before translating coords
double_pendulum.prototype.update = function() {

  for(var l = 0; l < 5; l++) {

  for(var i = 0; i < 10; i++) {
    this.update_fixed_point();
  }

  var qp_new = this.qp_;
  this.qp_ = this.qp;
  this.qp = qp_new;

  }

  document.dpform.energy.value = this.calc_energy().toFixed(9);

  var width = this.canvas.width;
  var height = this.canvas.height;

  var size = Math.min(width, height);
  var length_canvas = size / 4;

  var center_x = width / 2;
  var center_y = height / 2;

  var theta1 = this.qp[0];
  var theta2 = this.qp[1];

  var x1 = this.length1 * Math.sin(theta1);
  var y1 = this.length1 * Math.cos(theta1);
  var x2 = this.length2 * Math.sin(theta2);
  var y2 = this.length2 * Math.cos(theta2);

  var x1_canvas = center_x + length_canvas * x1;
  var y1_canvas = center_y + length_canvas * y1;

  var x2_canvas = center_x + length_canvas * (x1 + x2);
  var y2_canvas = center_x + length_canvas * (y1 + y2);

//Variables for the pendulum and the trace
  var ctx = this.ctx;
//Determines color of the trace
  var bgctx = this.bgctx;
  bgctx.fillStyle="rgba(0,0,0, 0.015)";
  bgctx.fillRect(0, 0, width ,height);

  bgctx.beginPath();
  bgctx.lineWidth = 0.5;
  bgctx.strokeStyle = "rgb(255,255,255)";
  bgctx.moveTo(this.x2_canvas_old, this.y2_canvas_old);
  bgctx.lineTo(x2_canvas, y2_canvas);
  //bgctx.stroke();

  //bgctx.fillStyle = "rgb(255,255,255)";
  //bgctx.fillRect(x2_canvas, y2_canvas, 0.1, 0.1);


  this.x2_canvas_old = x2_canvas;
  this.y2_canvas_old = y2_canvas;

  var bgimage = bgctx.getImageData(0,0,width,height);
  ctx.putImageData(bgimage,0,0);

  //ctx.fillStyle="rgb(0,0,0)";
  //ctx.fillRect(0, 0, width ,height);
//Color of the pendelum
  ctx.strokeStyle = "rgb(184,134,11)";
  
  ctx.beginPath();
  ctx.lineWidth = this.linewidth_ref * this.size_ref / size;
  ctx.moveTo(center_x, center_y);
  ctx.lineTo(x1_canvas, y1_canvas);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = this.linewidth_ref * this.size_ref / size;
  ctx.moveTo(x1_canvas, y1_canvas);
  ctx.lineTo(x2_canvas, y2_canvas);

  ctx.stroke();

}


double_pendulum.prototype.mouse_op = function(x, y) {
  var width = this.canvas.width;
  var height = this.canvas.height;
  var size = Math.min(width, height);

  var center_x = width / 2;
  var center_y = height / 2;

  var delta_x = x - center_x;
  var delta_y = y - center_y;
  var theta = Math.atan2(delta_x, delta_y);
  this.qp[0] = theta;
  this.qp[2] = 0;

  this.update_x2y2_canvas();

}

window.onload = function() {

  var canvas = document.getElementById('canvas');
  simulator = new double_pendulum(canvas);

  canvas.onmousedown = function (e) {
    var rect = e.target.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;
    simulator.mouse_op(mouseX, mouseY);
    return true;
  };

  return true;
};
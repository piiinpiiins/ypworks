# Writing Automaton

分類：Interaction Design

Original Fab Academy page: [https://fabacademy.org/2015/as/students/huang.yi-pin/finalProject.html](https://fabacademy.org/2015/as/students/huang.yi-pin/finalProject.html)

18 - Final Project

My final project is Writing Automaton. I like this project very much because I can integrate lots of skill I
learn in Fab Academy.

Demonstration

Arm Design
Arm design is the most important part. I study arm structure by using paper prototype. Hand made prototype
helps me understand where to put servo and how they move.

Automaton Body
The design goal of body should have enough space for at least 2 curcuit boards and 2 servo motors. I create a
3D model to study the shape, space and mechanical structure.

A plugin [Flattery](http://www.pumpkinpirate.info/flattery/) in sketchup is a nice
tool to help unfold a 3D model to paper craft. Paper craft layout can be saved as SVG, but I should add some
screw holes and latches manually in illustrator. The first prototype is shown below:

There is not enough space for servo motor to LIFT the arm. And the bending curve of MDF can be easily break
when I assembled parts.

I did some experiments on laser curve bent wood with MDF. Hinge gaps are too big in the first generation, so
that it sometimes slplited when I bent. The 2nd generation is the worst. The 3rd one is not bad.

Assembling:

[](https://fabacademy.org/2015/as/students/huang.yi-pin/18_files/FabAcademy2015_WritingAutomaton_yi-pinHuang.ai)

Shoulder joint is recommended using a [3D
printed part](https://fabacademy.org/2015/as/students/huang.yi-pin/18_files/3d_models/shoulder.skp). Because 3D part has some tolerance.

Hand
I think that will be great to create a [hand](https://fabacademy.org/2015/as/students/huang.yi-pin/18_files/3d_models/hand.skp).

Hand is cool, but 3d printed parts are to heavy. It causes arm unable to lift up.

Input devices
I hacked a mouse to get an optical sensor, and redesign it to become a optical sensor pen.

There was a small lens inside optical mouse. I used wire saw to cut the size I want. In order to make it work,
the relationship among red LED, optical sensor and lens can not be changed.

If it is possible, measure the parts with a calipers.

Mechnical test. I tried to add a switch in my input device. The original idea is like when I push this pen
(which means when I am writing), Writing Automaton's arm will put on writing surface. vice versa, when I lift
the pen, Automaton's arm also lifts.

I desoldered the optical sensor very carefully. Luckly, I found snesor(PAW3512DK)'s scheme and data sheet on
Internet.

Simulating a cursor. I am lucky again, it works!

Coding
I developmented the system with Processing and Arduino IDE. Most of the computing is done in Processing. I
setup serial communication between Processing and the board. The only thing my board need to do is assign angles
value to each motor.

1. Angle value in Processing:

int rootX;
int rootY;
int ex, ey, hx, hy;
int armLength;

import processing.serial.*;
Serial myPort;
String value;

float upperDegree;
float lowerDegree;

int upperDegreeInt;
int lowerDegreeInt;

int servoLowerAngle;
int servoUpperAngle;

void setup() {
size(1000, 1000);
background(#ff9900);
String portName = Serial.list()[4]; //change the 0 to a 1 or 2 etc. to match your port
myPort = new Serial(this, portName, 115200);
rootX = width/2;
rootY = 800;
armLength = 400;
}

void draw() {
fill(255);
rect(0, 0, width, height);
upperArm();
}

void upperArm() {
print("x: "+mouseX+" / ");
println("y: "+mouseY);

int dx = mouseX - rootX;
int dy = mouseY - rootY;

float distance = sqrt(dx*dx+dy*dy);

int a = armLength;
int b = armLength;
float c = min(distance, a + b);

float B = acos((b*b-a*a-c*c)/(-2*a*c));
float C = acos((c*c-a*a-b*b)/(-2*a*b));

float D = atan2(dy, dx);
float E = D + B + PI + C;

ex = int((cos(E) * a)) + rootX;
ey = int((sin(E) * a)) + rootY;
print("UpperArm Angle= "+degrees(E)+" ");
upperDegree = degrees(E);

hx = int((cos(D+B) * b)) + ex;
hy = int((sin(D+B) * b)) + ey;
println("LowerArm Angle= "+degrees((D+B)));
lowerDegree = degrees((C));

upperDegreeInt = int(upperDegree);
lowerDegreeInt = int(lowerDegree);
println("convert degree to int: "+upperDegreeInt+" / "+ lowerDegreeInt);
drawIK();
// mapping angle value to servo motor angle
servoUpperAngle = int(map(upperDegreeInt, 180, 360, 0, 180));
servoLowerAngle = abs(lowerDegreeInt);
//println("upper: "+servoUpperAngle);
sendDegree();
}

void drawIK(){
stroke(255, 0, 0);
fill(240, 0, 0);
ellipse(rootX, rootY, 20, 20); // root
ellipse(ex, ey, 10, 10); // end point of upper arm
ellipse(hx, hy, 6, 6); // end point of lower arm
stroke(0);
strokeWeight(3);
line(rootX, rootY, ex, ey);
line(ex, ey, hx, hy);
stroke(0);
}

void sendDegree() {
String upperAngle;
String lowerAngle;

if (servoUpperAngle<100) { upperAngle="0" +str(servoUpperAngle); } else { upperAngle=str(servoUpperAngle); } if
(servoLowerAngle<100) { lowerAngle="0" +str(servoLowerAngle); } else { lowerAngle=str(servoLowerAngle); }
value=upperAngle+","+lowerAngle+"\n"; println(value); myPort.write(value); }

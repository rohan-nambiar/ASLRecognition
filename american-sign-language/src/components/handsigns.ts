import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

// Create a new gesture description for the letter "A"
export const aSign = new GestureDescription('A');

// Thumb: No curl and diagonal up right.
aSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
aSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.70);

// Index: Full curl and vertical up.
aSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1);
aSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.70);

// Middle: Full curl and vertical up.
aSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1);
aSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.70);

// Ring: Full curl and vertical up.
aSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1);
aSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.70);

// Pinky: Full curl and vertical up.
aSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1);
aSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.70);

// Create a new gesture description for the letter "B"
export const bSign = new GestureDescription('B');

// All fingers are straight up
for(let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  bSign.addCurl(finger, FingerCurl.NoCurl, 1.0);
  bSign.addDirection(finger, FingerDirection.VerticalUp, 0.70);
}

// Create a new gesture description for the letter "C"
export const cSign = new GestureDescription('C');

// All fingers are half curled in a C shape
for(let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  cSign.addCurl(finger, FingerCurl.HalfCurl, 1.0);
  cSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.70);
}

// Create a new gesture description for the letter "D"
export const dSign = new GestureDescription('D');

// Index finger is straight up, others are curled
dSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
dSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.70);

// Other fingers are curled
for(let finger of [Finger.Thumb, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  dSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
  dSign.addDirection(finger, FingerDirection.VerticalUp, 0.70);
}

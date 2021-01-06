//script de Baptiste ZLOCH
var window = ImageWindow.activeWindow;
//var view;
//var TargetView;

function copyView( view, newName){//creation de clone
   var P = new PixelMath;
   P.expression = "$T";
   P.expression1 = "";
   P.expression2 = "";
   P.expression3 = "";
   P.useSingleExpression = true;
   P.symbols = "";
   P.generateOutput = true;
   P.singleThreaded = false;
   P.use64BitWorkingImage = false;
   P.rescale = false;
   P.rescaleLower = 0;
   P.rescaleUpper = 1;
   P.truncate = true;
   P.truncateLower = 0;
   P.truncateUpper = 1;
   P.createNewImage = true;
   P.showNewImage = true;
   P.newImageId = newName;
   P.newImageWidth = 0;
   P.newImageHeight = 0;
   P.newImageAlpha = false;
   P.newImageColorSpace = PixelMath.prototype.SameAsTarget;
   P.newImageSampleFormat = PixelMath.prototype.SameAsTarget;
   if (P.executeOn(view))
      return View.viewById(newName);
   {
      message("Mask creation failed in function copyView", "Error");
      return null;
   }
}

function CreateMask(view){
   console.show();
   //retrait des étoiles sur clone 1
   var P = new StarNet;
	with ( P ) {
               P.stride = StarNet.prototype.itemOne;
               P.mask = false;
               var starless = P.executeOn(copyView(view, "starless"));
               var window = ImageWindow.activeWindow;
               }
   //creation du clone2 pour creer les etoiles
   console.show();
   //Ceation des étoiles
   var P2 = new StarNet;
	with ( P2 ) {
               P2.stride = StarNet.prototype.itemOne;
               P2.mask = true;
               var starmask = P2.executeOn(copyView(view, "starmask"));
               var window1 = ImageWindow.activeWindow;
               }
   var P3 = new Convolution;
   with(P3){
               P3.mode = Convolution.prototype.Parametric;
               P3.sigma = 4.60;
               P3.shape = 2.00;
               P3.aspectRatio = 1.00;
               P3.rotationAngle = 0.00;
               P3.filterSource = "";
               P3.rescaleHighPass = false;
               P3.viewId = "";
               P3.executeOn(window1.currentView, false);
               }
               //application du masque
    window.maskVisible = true;
    window.maskInverted = false;
    window.mask = window1;

               copyView(view, "cloneimage");
               var window2 = ImageWindow.activeWindow;

    var P1 = new PixelMath;
    with ( P1 ) {
                  P1.expression = window.mainView.id+" - "+window2.mainView.id+" * 0.5";
                  P1.expression1 = "";
                  P1.expression2 = "";
                  P1.expression3 = "";
                  P1.useSingleExpression = true;
                  P1.symbols = "";
                  P1.generateOutput = true;
                  P1.singleThreaded = false;
                  P1.use64BitWorkingImage = false;
                  P1.rescale = false;
                  P1.rescaleLower = 0;
                  P1.rescaleUpper = 1;
                  P1.truncate = true;
                  P1.truncateLower = 0;
                  P1.truncateUpper = 1;
                  P1.createNewImage = false;
                  P1.showNewImage = true;
                  P1.newImageId = "";
                  P1.newImageWidth = 0;
                  P1.newImageHeight = 0;
                  P1.newImageAlpha = false;
                  P1.newImageColorSpace = PixelMath.prototype.SameAsTarget;
                  P1.newImageSampleFormat = PixelMath.prototype.SameAsTarget;
                  P1.executeOn(window.currentView, false);
    }
    window2.forceClose();
    window1.forceClose();
    //window = notre masque
    var imagestat = new ImageStatistics( window.currentView.image )
    var P4 = new HistogramTransformation;
    with(P4){
P4.H = [ // c0, m, c1, r0, r1
   [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
   [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
   [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
   [imagestat.mean/2, imagestat.mean, 1.00000000, 0.00000000, 1.00000000],
   [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000]
];
P4.executeOn(window.currentView, false);
}
var P5 = new ATrousWaveletTransform;//floutage
with(P5){
P5.layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionIterations
   [false, true, 0.000, false, 3.000, 1.00, 1],
   [false, true, 0.000, false, 3.000, 1.00, 1],
   [false, true, 0.000, false, 3.000, 1.00, 1],
   [true, true, 0.000, false, 3.000, 1.00, 1],
   [true, true, 0.000, false, 3.000, 1.00, 1]
];
P5.scaleDelta = 0;
P5.scalingFunctionData = [
   0.25,0.5,0.25,
   0.5,1,0.5,
   0.25,0.5,0.25
];
P5.scalingFunctionRowFilter = [
   0.5,
   1,
   0.5
];
P5.scalingFunctionColFilter = [
   0.5,
   1,
   0.5
];
P5.scalingFunctionNoiseSigma = [
   0.8003,0.2729,0.1198,
   0.0578,0.0287,0.0143,
   0.0072,0.0036,0.0019,
   0.001
];
P5.scalingFunctionName = "Linear Interpolation (3)";
P5.largeScaleFunction = ATrousWaveletTransform.prototype.NoFunction;
P5.curveBreakPoint = 0.75;
P5.noiseThresholding = false;
P5.noiseThresholdingAmount = 1.00;
P5.noiseThreshold = 3.00;
P5.softThresholding = true;
P5.useMultiresolutionSupport = false;
P5.deringing = false;
P5.deringingDark = 0.1000;
P5.deringingBright = 0.0000;
P5.outputDeringingMaps = false;
P5.lowRange = 0.0000;
P5.highRange = 0.0000;
P5.previewMode = ATrousWaveletTransform.prototype.Disabled;
P5.previewLayer = 0;
P5.toLuminance = true;
P5.toChrominance = false;
P5.linear = false;
P5.executeOn(window.currentView, false);
}
var P = new CurvesTransformation;
P.R = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.Rt = CurvesTransformation.prototype.AkimaSubsplines;
P.G = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.Gt = CurvesTransformation.prototype.AkimaSubsplines;
P.B = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.Bt = CurvesTransformation.prototype.AkimaSubsplines;
P.K = [ // x, y
   [0.00000, 0.00000],
   [0.14987, 0.11370],
   [0.26098, 0.26615],
   [1.00000, 1.00000]
];
P.Kt = CurvesTransformation.prototype.AkimaSubsplines;
P.A = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.At = CurvesTransformation.prototype.AkimaSubsplines;
P.L = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.Lt = CurvesTransformation.prototype.AkimaSubsplines;
P.a = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.at = CurvesTransformation.prototype.AkimaSubsplines;
P.b = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.bt = CurvesTransformation.prototype.AkimaSubsplines;
P.c = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.ct = CurvesTransformation.prototype.AkimaSubsplines;
P.H = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.Ht = CurvesTransformation.prototype.AkimaSubsplines;
P.S = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.St = CurvesTransformation.prototype.AkimaSubsplines;
P.executeOn(window.currentView);//rehausse dynamique

copyView(view, "clone");
var windowClone = ImageWindow.activeWindow;//assignation a une fenetre
    //application du masque sur le clone
    windowClone.maskVisible = true;
    windowClone.maskInverted = false;
    windowClone.mask = window;

var P = new HDRMultiscaleTransform;
P.numberOfLayers = 8;
P.numberOfIterations = 1;
P.invertedIterations = true;
P.overdrive = 0.100;
P.medianTransform = false;
P.scalingFunctionData = [
   0.003906,0.015625,0.023438,0.015625,0.003906,
   0.015625,0.0625,0.09375,0.0625,0.015625,
   0.023438,0.09375,0.140625,0.09375,0.023438,
   0.015625,0.0625,0.09375,0.0625,0.015625,
   0.003906,0.015625,0.023438,0.015625,0.003906
];
P.scalingFunctionRowFilter = [
   0.0625,0.25,
   0.375,0.25,
   0.0625
];
P.scalingFunctionColFilter = [
   0.0625,0.25,
   0.375,0.25,
   0.0625
];
P.scalingFunctionName = "B3 Spline (5)";
P.deringing = false;
P.smallScaleDeringing = 0.000;
P.largeScaleDeringing = 0.250;
P.outputDeringingMaps = false;
P.midtonesBalanceMode = HDRMultiscaleTransform.prototype.Automatic;
P.midtonesBalance = 0.500000;
P.toLightness = true;
P.preserveHue = false;
P.luminanceMask = true;
P.executeOn(windowClone.mainView);
P.numberOfLayers = 6;
P.executeOn(windowClone.mainView);
//retrait du masque
windowClone.removeMask();//retrait du masque
copyView(view, "cloneu");
var windowi = ImageWindow.activeWindow;

var Pm = new PixelMath;
Pm.expression = "avg("+windowi.mainView.id + ","+ windowClone.mainView.id +")";
Pm.expression1 = "";
Pm.expression2 = "";
Pm.expression3 = "";
Pm.useSingleExpression = true;
Pm.symbols = "";
Pm.generateOutput = true;
Pm.singleThreaded = false;
Pm.use64BitWorkingImage = false;
Pm.rescale = false;
Pm.rescaleLower = 0;
Pm.rescaleUpper = 1;
Pm.truncate = true;
Pm.truncateLower = 0;
Pm.truncateUpper = 1;
Pm.createNewImage = false;
Pm.showNewImage = true;
Pm.newImageId = "integration";
Pm.newImageWidth = 0;
Pm.newImageHeight = 0;
Pm.newImageAlpha = false;
Pm.newImageColorSpace = PixelMath.prototype.SameAsTarget;
Pm.newImageSampleFormat = PixelMath.prototype.SameAsTarget;
Pm.executeOn(view);
windowi.forceClose();
windowClone.forceClose();

var P = new CurvesTransformation;
with(P){
P.R = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.Rt = CurvesTransformation.prototype.AkimaSubsplines;
P.G = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.Gt = CurvesTransformation.prototype.AkimaSubsplines;
P.B = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.Bt = CurvesTransformation.prototype.AkimaSubsplines;
P.K = [ // x, y
   [0.00000, 0.00000],
   [0.13953, 0.10853],
   [0.22739, 0.21964],
   [0.74419, 0.76227],
   [1.00000, 1.00000]
];
P.Kt = CurvesTransformation.prototype.AkimaSubsplines;
P.A = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.At = CurvesTransformation.prototype.AkimaSubsplines;
P.L = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.Lt = CurvesTransformation.prototype.AkimaSubsplines;
P.a = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.at = CurvesTransformation.prototype.AkimaSubsplines;
P.b = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.bt = CurvesTransformation.prototype.AkimaSubsplines;
P.c = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.ct = CurvesTransformation.prototype.AkimaSubsplines;
P.H = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.Ht = CurvesTransformation.prototype.AkimaSubsplines;
P.S = [ // x, y
   [0.00000, 0.00000],
   [1.00000, 1.00000]
];
P.St = CurvesTransformation.prototype.AkimaSubsplines;
P.executeOn(view);
}
    view.window.maskVisible = true;
    view.window.maskInverted = false;
    view.window.mask = window;
var P = new UnsharpMask;
P.sigma = 2.10;
P.amount = 0.71;
P.useLuminance = true;
P.linear = false;
P.deringing = true;
P.deringingDark = 0.0200;
P.deringingBright = 0.0000;
P.outputDeringingMaps = false;
P.rangeLow = 0.0000000;
P.rangeHigh = 0.0000000;
P.executeOn(view);
var P = new LocalHistogramEqualization;
P.radius = 125;
P.histogramBins = LocalHistogramEqualization.prototype.Bit8;
P.slopeLimit = 3.5;
P.amount = 0.250;
P.circularKernel = true;
P.executeOn(view);
view.window.maskInverted = true;
var P = new LocalHistogramEqualization;
P.radius = 125;
P.histogramBins = LocalHistogramEqualization.prototype.Bit8;
P.slopeLimit = 3.5;
P.amount = 0.090;
P.circularKernel = true;
P.executeOn(view);




}

   function main()
{

   // Get access to the current active image window.
   console.hide();
   var window = ImageWindow.activeWindow;
   if ( window.isNull )
   {
      message( "No active image" );
   }
   else
   {
      var dialog = null;
      var view = window.currentView;
      CreateMask(view, "clone");
   }
};

main();

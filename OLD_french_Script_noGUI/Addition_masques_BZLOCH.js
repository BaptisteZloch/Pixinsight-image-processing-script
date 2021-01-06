



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


function CreateMask(view)
{
   var imgStat = new ImageStatistics(view.image)
   copyView(view, "clone");
   var windowclone = ImageWindow.activeWindow;
   var P = new HDRMultiscaleTransform;
P.numberOfLayers = 3;
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
P.executeOn(windowclone.currentView);

var P = new ATrousWaveletTransform;
P.layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionIterations
   [false, true, 0.000, false, 3.000, 1.00, 1],
   [true, true, 0.000, false, 3.000, 1.00, 1],
   [true, true, 0.000, false, 3.000, 1.00, 1],
   [true, true, 0.000, false, 3.000, 1.00, 1],
   [true, true, 0.000, false, 3.000, 1.00, 1]
];
P.scaleDelta = 0;
P.scalingFunctionData = [
   0.25,0.5,0.25,
   0.5,1,0.5,
   0.25,0.5,0.25
];
P.scalingFunctionRowFilter = [
   0.5,
   1,
   0.5
];
P.scalingFunctionColFilter = [
   0.5,
   1,
   0.5
];
P.scalingFunctionNoiseSigma = [
   0.8003,0.2729,0.1198,
   0.0578,0.0287,0.0143,
   0.0072,0.0036,0.0019,
   0.001
];
P.scalingFunctionName = "Linear Interpolation (3)";
P.largeScaleFunction = ATrousWaveletTransform.prototype.NoFunction;
P.curveBreakPoint = 0.75;
P.noiseThresholding = false;
P.noiseThresholdingAmount = 1.00;
P.noiseThreshold = 3.00;
P.softThresholding = true;
P.useMultiresolutionSupport = false;
P.deringing = false;
P.deringingDark = 0.1000;
P.deringingBright = 0.0000;
P.outputDeringingMaps = false;
P.lowRange = 0.0000;
P.highRange = 0.0000;
P.previewMode = ATrousWaveletTransform.prototype.Disabled;
P.previewLayer = 0;
P.toLuminance = true;
P.toChrominance = true;
P.linear = false;
P.executeOn(windowclone.currentView);

   var values = new Array(0.1, 0.25, 0.5, 0.75, 0.98);
   var window = new Array();
   for(let i = 0; i<values.length; i++){

   var starmask = new StarMask;
	with ( starmask ) {
		shadowsClipping = 0.1;
		midtonesBalance = values[i];
		highlightsClipping = 1.00000;
		waveletLayers = 6;
		noiseThreshold = imgStat.mean+0.05;
		mode = StructureMap;
	}
	starmask.executeOn(windowclone.currentView);
   window[i] = ImageWindow.activeWindow;
   }
   windowclone.forceClose();
    var pm = new PixelMath;
    with ( pm )
    {
      expression = "max("+window[0].mainView.id+","+window[1].mainView.id+","+window[2].mainView.id+","+window[3].mainView.id+","+window[4].mainView.id+")";
      expression1 = "";
      expression2 = "";
      expression3 = "";
      useSingleExpression = true;
      symbols = "";
      generateOutput = true;
      singleThreaded = false;
      use64BitWorkingImage = false;
      rescale = false;
      rescaleLower = 0;
      rescaleUpper = 1;
      truncate = true;
      truncateLower = 0;
      truncateUpper = 1;
      createNewImage = true;
      showNewImage = true;
      newImageId = "full_star_mask";
      newImageWidth = 0;
      newImageHeight = 0;
      newImageAlpha = false;
      newImageColorSpace = SameAsTarget;
      newImageSampleFormat = SameAsTarget;
    }
    pm.executeOn(view);
    var windowMask = ImageWindow.activeWindow
for(let i = 0; i<values.length; i++){
 window[i].forceClose();//supprime les masques intermédiaires
}
var P = new MorphologicalTransformation;
P.operator = MorphologicalTransformation.prototype.Dilation;
P.interlacingDistance = 1;
P.lowThreshold = 0.000000;
P.highThreshold = 0.000000;
P.numberOfIterations = 1;
P.amount = 0.40;
P.selectionPoint = 0.50;
P.structureName = "";
P.structureSize = 7;
P.structureWayTable = [ // mask
   [[
      0x00,0x00,0x01,0x01,0x01,0x00,0x00,
      0x00,0x01,0x01,0x01,0x01,0x01,0x00,
      0x01,0x01,0x01,0x01,0x01,0x01,0x01,
      0x01,0x01,0x01,0x01,0x01,0x01,0x01,
      0x01,0x01,0x01,0x01,0x01,0x01,0x01,
      0x00,0x01,0x01,0x01,0x01,0x01,0x00,
      0x00,0x00,0x01,0x01,0x01,0x00,0x00
   ]]
];
P.executeOn(windowMask.currentView);
var Pc = new Convolution;
Pc.mode = Convolution.prototype.Parametric;
Pc.sigma = 2.70;
Pc.shape = 2.00;
Pc.aspectRatio = 1.00;
Pc.rotationAngle = 0.00;
Pc.filterSource = "";
Pc.rescaleHighPass = false;
Pc.viewId = "";
Pc.executeOn(windowMask.currentView);
}

function main()
{
      console.hide();
      // Get access to the current active image window.
      var window = ImageWindow.activeWindow;
      var currentView = ImageWindow.activeWindow.currentView;
   if ( window.isNull ){
      throw new Error( "No active image" );}
      else{
      CreateMask(currentView);
      }
};

main();

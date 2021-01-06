//script de Baptiste ZLOCH
// Shadows clipping point in (normalized) MAD units from the median.
#define DEFAULT_AUTOSTRETCH_SCLIP  -2.80
// Target mean background in the [0,1] range.
#define DEFAULT_AUTOSTRETCH_TBGND   0.25
// Apply the same STF to all nominal channels (true), or treat each channel
// separately (false).
#define DEFAULT_AUTOSTRETCH_CLINK   true

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


function ApplyAutoSTF( view, shadowsClipping, targetBackground, rgbLinked )
{

   var stf = new ScreenTransferFunction;

   var n = view.image.isColor ? 3 : 1;

   var median = view.computeOrFetchProperty( "Median" );

   var mad = view.computeOrFetchProperty( "MAD" );
   mad.mul( 1.4826 ); // coherent with a normal distribution

   if ( rgbLinked )
   {
      /*
       * Try to find how many channels look as channels of an inverted image.
       * We know a channel has been inverted because the main histogram peak is
       * located over the right-hand half of the histogram. Seems simplistic
       * but this is consistent with astronomical images.
       */
      var invertedChannels = 0;
      for ( var c = 0; c < n; ++c )
         if ( median.at( c ) > 0.5 )
            ++invertedChannels;

      if ( invertedChannels < n )
      {
         /*
          * Noninverted image
          */
         var c0 = 0, m = 0;
         for ( var c = 0; c < n; ++c )
         {
            if ( 1 + mad.at( c ) != 1 )
               c0 += median.at( c ) + shadowsClipping * mad.at( c );
            m  += median.at( c );
         }
         c0 = Math.range( c0/n, 0.0, 1.0 );
         m = Math.mtf( targetBackground, m/n - c0 );

         stf.STF = [ // c0, c1, m, r0, r1
                     [c0, 1, m, 0, 1],
                     [c0, 1, m, 0, 1],
                     [c0, 1, m, 0, 1],
                     [0, 1, 0.5, 0, 1] ];
      }
      else
      {
         /*
          * Inverted image
          */
         var c1 = 0, m = 0;
         for ( var c = 0; c < n; ++c )
         {
            m  += median.at( c );
            if ( 1 + mad.at( c ) != 1 )
               c1 += median.at( c ) - shadowsClipping * mad.at( c );
            else
               c1 += 1;
         }
         c1 = Math.range( c1/n, 0.0, 1.0 );
         m = Math.mtf( c1 - m/n, targetBackground );

         stf.STF = [ // c0, c1, m, r0, r1
                     [0, c1, m, 0, 1],
                     [0, c1, m, 0, 1],
                     [0, c1, m, 0, 1],
                     [0, 1, 0.5, 0, 1] ];
      }
   }
   else
   {
      /*
       * Unlinked RGB channnels: Compute automatic stretch functions for
       * individual RGB channels separately.
       */
      var A = [ // c0, c1, m, r0, r1
               [0, 1, 0.5, 0, 1],
               [0, 1, 0.5, 0, 1],
               [0, 1, 0.5, 0, 1],
               [0, 1, 0.5, 0, 1] ];

      for ( var c = 0; c < n; ++c )
      {
         if ( median.at( c ) < 0.5 )
         {
            /*
             * Noninverted channel
             */
            var c0 = (1 + mad.at( c ) != 1) ? Math.range( median.at( c ) + shadowsClipping * mad.at( c ), 0.0, 1.0 ) : 0.0;
            var m  = Math.mtf( targetBackground, median.at( c ) - c0 );
            A[c] = [c0, 1, m, 0, 1];
         }
         else
         {
            /*
             * Inverted channel
             */
            var c1 = (1 + mad.at( c ) != 1) ? Math.range( median.at( c ) - shadowsClipping * mad.at( c ), 0.0, 1.0 ) : 1.0;
            var m  = Math.mtf( c1 - median.at( c ), targetBackground );
            A[c] = [0, c1, m, 0, 1];
         }
      }

      stf.STF = A;
   }

   console.writeln( "<end><cbr/><br/><b>", view.fullId, "</b>:" );
   for ( var c = 0; c < n; ++c )
   {
      console.writeln( "channel #", c );
      console.writeln( format( "c0 = %.6f", stf.STF[c][0] ) );
      console.writeln( format( "m  = %.6f", stf.STF[c][2] ) );
      console.writeln( format( "c1 = %.6f", stf.STF[c][1] ) );
   }

   stf.executeOn( view );
   console.writeln( "<end><cbr/><br/>" );
}

function Histo(view){
   copyView(view, "masque_fond_ciel");
   var windowMask = ImageWindow.activeWindow;
   ApplyAutoSTF( view,DEFAULT_AUTOSTRETCH_SCLIP, DEFAULT_AUTOSTRETCH_TBGND,DEFAULT_AUTOSTRETCH_CLINK );
   var stf = view.stf;
	var c0 = stf[0][1];
	var m  = stf[0][0];

   var H = [[  0, 0.5, 1.0, 0, 1.0],
            [  0, 0.5, 1.0, 0, 1.0],
            [  0, 0.5, 1.0, 0, 1.0],
            [ c0,   m, 1.0, 0, 1.0],
            [  0, 0.5, 1.0, 0, 1.0]];

   var STF = new ScreenTransferFunction;
	STF.interaction = ScreenTransferFunction.prototype.SeparateChannels;
   view.stf =  [ // c0, c1, m, r0, r1
		[m, 1.00000,  c0, 0.0, 1.0],
		[m, 1.00000,  c0, 0.0, 1.0],
		[m, 1.00000,  c0, 0.0, 1.0],
		[0, 1.00000, 0.5, 0.0, 1.0]
   ];

   STF.executeOn(windowMask.mainView)
	var HT = new HistogramTransformation;
 	HT.H = H;
   HT.executeOn(windowMask.mainView);
   var imstat = new ImageStatistics( windowMask.mainView.image );
   var HT2 = new HistogramTransformation;
HT2.H = [ // c0, m, c1, r0, r1
   [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
   [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
   [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
   [imstat.mean, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
   [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000]
];
HT2.executeOn(windowMask.mainView);
var P = new PixelMath;
P.expression = "~($T*0.9)";
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
P.createNewImage = false;
P.showNewImage = true;
P.newImageId = "";
P.newImageWidth = 0;
P.newImageHeight = 0;
P.newImageAlpha = false;
P.newImageColorSpace = PixelMath.prototype.SameAsTarget;
P.newImageSampleFormat = PixelMath.prototype.SameAsTarget;

P.executeOn(windowMask.mainView);
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
P5.executeOn(windowMask.mainView, false);
}
 //application du masque
    view.window.maskVisible = true;
    view.window.maskInverted = false;
    view.window.mask = windowMask;
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
      var view = window.currentView;
      //CreateMask(view, "clone");
       Histo(view);
   }
};

main();


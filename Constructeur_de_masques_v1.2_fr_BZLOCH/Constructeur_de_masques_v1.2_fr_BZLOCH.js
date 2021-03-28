//script de Baptiste ZLOCH

//bibliothèques
#include <pjsr/Sizer.jsh>
#include <pjsr/NumericControl.jsh>
#include <pjsr/FrameStyle.jsh>
#include <pjsr/SectionBar.jsh>
#include <pjsr/ColorSpace.jsh>
#include <pjsr/UndoFlag.jsh>
#include <pjsr/StdButton.jsh>
#include <pjsr/StdIcon.jsh>
//infos
#feature-id    Utilities > Constructeur de masques
#feature-info  Un script de création de masques en automatique.< br />\
<br />\
Un script qui permet de faire tous les types de masques en automatique.< br />\
<br />\
Copyright & copy; 2020 Baptiste ZLOCH
#feature-icon  ZTA.svg
//define des textes
#define VERSION "1.3"
#define TITLE "Constructeur de masques v" + VERSION
#define textBox  "<p><b>" + TITLE + "</b> &mdash; Un script qui permet de faire tous les types de masques en automatique.</p> <p>Copyright &copy; 2020 Baptiste ZLOCH. All rights reserved. <b><a href=\"www.zlochteamastro.com\">www.zlochteamastro.com</a></b></p>"

#define targetImage_LabelText "Image cible :"
#define targetImage_ViewListTT "Selectionnez l'image sur laquelle vous voulez effectuer le masque"
#define ListsizerTT "Zone de selection de l'image"
#define LinearCheckBoxText "Image est linéaire ?"
#define LinearCheckBoxTT "On va la délineariser."
#define ColorCheckBoxText "Image est en couleur ?"
#define ColorCheckBoxTT "On va la convertir en monochrome avant traitement."
#define CBsizerTT "Option d'images."
#define list_GBText "Selection de l'image"
#define list_GBTT "Zone de selection de l'image"
#define SMClassicText "Masque d'étoiles classique"
#define SMClassicTT "Génère un masque qui isole les étoiles."
#define SMContoursText "Masque d'étoiles contours";
#define SMContoursTT "Génère un masque qui isole les contours des étoiles, ideal pour la réduction d'étoiles."
#define STmask_OptTT "Zone de selection du type de masque d'étoiles."
#define STmask_OptbarText "Options du starmask"
#define ObjectMaskText "Masque objet"
#define ObjectMaskTT "Génère un masque qui isole l'objet."
#define BackgroundMaskText "Masque de fond"
#define BackgroundMaskTT "Génère un masque qui isole le fond de ciel."
#define StarmaskText "Masque d'étoiles"
#define StarmaskTT "Génère un masque qui isole les étoiles."
#define TypeMaskTT "Zone de selection du type de masque."
#define TypeMaskbarText "Type de masque"
#define ok_ButtonText "Executer"
#define cancel_ButtonText "Quitter"
#define BigStars_LabelText "Exclusion des structures : "
#define BigStars_SpinBoxTT "Permet d'élargir ou pas le structure du masque au niveau des grosses étoiles."
#define DarkStructureMaskText "Masque des structures sombres"
#define DarkStructureMaskTT "Génère un masque qui isole les zones sombres de l'image."
#define time "\n\nLe traitement a été effectué en : "

//define des constantes
// Shadows clipping point in (normalized) MAD units from the median.
#define DEFAULT_AUTOSTRETCH_SCLIP - 2.80
// Target mean background in the [0,1] range.
#define DEFAULT_AUTOSTRETCH_TBGND   0.25
// Apply the same STF to all nominal channels (true), or treat each channel
// separately (false).
#define DEFAULT_AUTOSTRETCH_CLINK   true
#define nStarMask 6

//global variables
var data;
var newdata;
var typeM;
var OM = true;
var BM = false;
var SM = false;
var DSM = false;
var SMContours = false;
var SMClassic = true;
var Linear = false;
var couleur = false;
var windowClone1;
var windowClone2;
var windowClone3;
var bigstars = 7;
//chronomètre du script
var start;
var end;
var diff;

function copyView(view, newName) {//creation de clone
   var P = new PixelMath;
   P.expression = view.id;
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

function ObjectMask(view) {
   console.show();
   //retrait des étoiles sur clone 1
   var P = new StarNet;
   P.stride = StarNet.prototype.Stride_128;
   P.mask = false;
   P.executeOn(windowClone1.currentView);
   //creation du clone2 pour creer les etoiles
   console.show();
   //Ceation des étoiles
   var P = new StarNet;
   P.stride = StarNet.prototype.Stride_128;
   P.mask = true;

   P.executeOn(windowClone2.currentView);
   var P3 = new Convolution;
   with (P3) {
      P3.mode = Convolution.prototype.Parametric;
      P3.sigma = 4.60;
      P3.shape = 2.00;
      P3.aspectRatio = 1.00;
      P3.rotationAngle = 0.00;
      P3.filterSource = "";
      P3.rescaleHighPass = false;
      P3.viewId = "";
      P3.executeOn(windowClone2.currentView, false);
   }
   //application du masque
   windowClone1.maskVisible = true;
   windowClone1.maskInverted = false;
   windowClone1.mask = windowClone2;

   //copyView(view, "cloneimage");
   //var window2 = ImageWindow.activeWindow;

   var P1 = new PixelMath;
   with (P1) {
      P1.expression = windowClone1.mainView.id + " - " + view.id + " * 0.5";
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
      P1.executeOn(windowClone1.currentView);
   }
   //windowClone2.forceClose();
   var P5 = new ATrousWaveletTransform;//floutage
   with (P5) {
      P5.layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionIterations
         [false, true, 0.000, false, 3.000, 1.00, 1],
         [false, true, 0.000, false, 3.000, 1.00, 1],
         [false, true, 0.000, false, 3.000, 1.00, 1],
         [true, true, 0.000, false, 3.000, 1.00, 1],
         [true, true, 0.000, false, 3.000, 1.00, 1]
      ];
      P5.scaleDelta = 0;
      P5.scalingFunctionData = [
         0.25, 0.5, 0.25,
         0.5, 1, 0.5,
         0.25, 0.5, 0.25
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
         0.8003, 0.2729, 0.1198,
         0.0578, 0.0287, 0.0143,
         0.0072, 0.0036, 0.0019,
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
      P5.executeOn(windowClone1.currentView);
   }


}

function dialogu() {
   this.__base__ = Dialog;
   this.__base__();

   var dlg = this;
   this.helpLabel = new Label(this);
   this.helpLabel.frameStyle = FrameStyle_Box;
   this.helpLabel.margin = 4;
   this.helpLabel.wordWrapping = true;
   this.helpLabel.useRichText = true;
   this.helpLabel.text = textBox;
   this.helpLabel.setMinWidth(450);
   // Target Image
   this.targetImage_Label = new Label(this);
   this.targetImage_Label.minWidth = 6; // Align with labels inside group boxes below
   this.targetImage_Label.text = targetImage_LabelText; //Image cible :
   this.targetImage_Label.textAlignment = 2 | 128;


   this.targetImage_ViewList = new ViewList(this);
   this.targetImage_ViewList.minWidth = 200;
   this.targetImage_ViewList.getAll(); 					// Include main views as well as previews
   this.targetImage_ViewList.toolTip = targetImage_ViewListTT;     //"Selectionnez l'image sur laquel vous voulez effectuer le starmask";
   this.targetImage_ViewList.onViewSelected = function (view) {
      data = view;
   };

   this.Listsizer = new HorizontalSizer
   this.Listsizer.setAlignment = Align_Center;
   this.Listsizer.spacing = 4;
   this.Listsizer.margin = 6;
   this.Listsizer.add(this.targetImage_Label);
   this.Listsizer.add(this.targetImage_ViewList);
   this.Listsizer.toolTip = ListsizerTT;//"Zone de selection de l'image"

   this.LinearCheckBox = new CheckBox(this);
   this.LinearCheckBox.text = LinearCheckBoxText; //"Image est linéaire ?"
   this.LinearCheckBox.checked = false;
   this.LinearCheckBox.toolTip = LinearCheckBoxTT;// "On va la délineariser.";
   this.LinearCheckBox.onCheck = function (checked) {
      Linear = checked;
   }

   this.ColorCheckBox = new CheckBox(this);
   this.ColorCheckBox.text = ColorCheckBoxText;//"Image est en couleur ?"
   this.ColorCheckBox.checked = false;
   this.ColorCheckBox.toolTip = ColorCheckBoxTT; //"On va la convertir en monochrome avant traitement.";
   this.ColorCheckBox.onCheck = function (checked) {
      couleur = checked;
   }

   this.CBsizer = new HorizontalSizer
   this.CBsizer.setAlignment = Align_Center;
   this.CBsizer.spacing = 4;
   this.CBsizer.margin = 6;
   this.CBsizer.add(this.LinearCheckBox);
   this.CBsizer.add(this.ColorCheckBox);
   this.CBsizer.toolTip = CBsizerTT;//"Option d'images.";


   this.list_GB = new GroupBox(this);
   this.list_GB.title = list_GBText; //"Selection de l'image";
   this.list_GB.sizer = new VerticalSizer
   this.list_GB.sizer.setAlignment = Align_Center;
   this.list_GB.sizer.spacing = 4;
   this.list_GB.sizer.margin = 6;
   this.list_GB.sizer.add(this.Listsizer);
   this.list_GB.sizer.add(this.CBsizer);
   this.list_GB.toolTip = list_GBTT;//"Zone de selection de l'image";


   this.SMClassic = new RadioButton(this);
   this.SMClassic.text = SMClassicText; //"Masque d'étoiles classique";
   this.SMClassic.textAlignment = TextAlign_Right | TextAlign_VertCenter;
   this.SMClassic.setMinWidth(200);
   this.SMClassic.checked = SMClassic;
   this.SMClassic.toolTip = SMClassicTT;// "Génère un masque qui isole le fond de ciel.";
   this.SMClassic.onCheck = function (checked) {
      SMClassic = checked;
   };

   this.SMContours = new RadioButton(this);
   this.SMContours.text = SMContoursText;// "Masque d'étoiles contours";
   this.SMContours.textAlignment = TextAlign_Right | TextAlign_VertCenter;
   this.SMContours.setMinWidth(200);
   this.SMContours.checked = SMContours;
   this.SMContours.toolTip = SMContoursTT; //"Génère un masque qui isole les contours des étoiles, ideal pour la réduction d'étoiles.";
   this.SMContours.onCheck = function (checked) {
      SMContours = checked;
   };

   this.SMC_sizer = new VerticalSizer
   this.SMC_sizer.setAlignment = Align_Center;
   this.SMC_sizer.spacing = 4;
   this.SMC_sizer.margin = 6;
   this.SMC_sizer.add(this.SMClassic);
   this.SMC_sizer.add(this.SMContours);

   this.BigStars_Label = new Label(this);
   this.BigStars_Label.minWidth = 6;
   this.BigStars_Label.text = BigStars_LabelText; //"Exclusion des structures.";
   this.BigStars_Label.textAlignment = 2 | 128;

   this.BigStars_SpinBox = new SpinBox(this);
   this.BigStars_SpinBox.minValue = 2;
   this.BigStars_SpinBox.maxValue = 12;
   this.BigStars_SpinBox.value = bigstars;
   this.BigStars_SpinBox.toolTip = BigStars_SpinBoxTT; //"Permet d'élargir ou pas le structure du masque au niveau des grosses étoiles."
   this.BigStars_SpinBox.setFixedWidth(40);
   this.BigStars_SpinBox.onValueUpdated = function (value) {
      bigstars = value;
   };

   this.SB_sizer = new HorizontalSizer
   this.SB_sizer.setAlignment = Align_Center;
   this.SB_sizer.spacing = 4;
   this.SB_sizer.margin = 6;
   this.SB_sizer.addStretch();
   this.SB_sizer.add(this.BigStars_Label);
   this.SB_sizer.add(this.BigStars_SpinBox, 100);
   this.SB_sizer.addStretch();

   this.STmask_Opt = new Control(this);
   this.STmask_Opt.sizer = new HorizontalSizer;
   this.STmask_Opt.sizer.spacing = 4;
   this.STmask_Opt.sizer.margin = 6;
   this.STmask_Opt.sizer.add(this.SMC_sizer);
   this.STmask_Opt.sizer.add(this.SB_sizer);
   this.STmask_Opt.toolTip = STmask_OptTT; //"Zone de selection du type de masque d'étoiles.";

   dlg.SMContours.enabled = false;
   dlg.SMClassic.enabled = false;
   dlg.BigStars_SpinBox.enabled = false;

   this.STmask_Optbar = new SectionBar(this);
   this.STmask_Optbar.setTitle(STmask_OptbarText);//"Options du starmask"
   this.STmask_Opt.adjustToContents();
   this.STmask_Opt.setFixedHeight(this.STmask_Opt.height);
   this.STmask_Opt.hide();
   this.STmask_Optbar.setSection(this.STmask_Opt);

   this.ObjectMask = new RadioButton(this);
   this.ObjectMask.text = ObjectMaskText; //"Masque objet";
   this.ObjectMask.textAlignment = TextAlign_Right | TextAlign_VertCenter;
   this.ObjectMask.setMinWidth(200);
   this.ObjectMask.checked = OM;
   this.ObjectMask.toolTip = ObjectMaskTT; //"Génère un masque qui isole l'objet.";
   this.ObjectMask.onCheck = function (checked) {
      OM = checked
      dlg.SMContours.enabled = false;
      dlg.SMClassic.enabled = false;
      dlg.BigStars_SpinBox.enabled = false;
      dlg.STmask_Opt.hide();
   };

   this.BackgroundMask = new RadioButton(this);
   this.BackgroundMask.text = BackgroundMaskText; //"Masque de fond";
   this.BackgroundMask.textAlignment = TextAlign_Right | TextAlign_VertCenter;
   this.BackgroundMask.setMinWidth(200);
   this.BackgroundMask.checked = BM;
   this.BackgroundMask.toolTip = BackgroundMaskTT;// "Génère un masque qui isole le fond de ciel.";
   this.BackgroundMask.onCheck = function (checked) {
      BM = checked
      dlg.SMContours.enabled = false;
      dlg.SMClassic.enabled = false;
      dlg.BigStars_SpinBox.enabled = false;
      dlg.STmask_Opt.hide();
   };

   this.DarkStructureMask = new RadioButton(this);
   this.DarkStructureMask.text = DarkStructureMaskText; //"Masque de fond";
   this.DarkStructureMask.textAlignment = TextAlign_Right | TextAlign_VertCenter;
   this.DarkStructureMask.setMinWidth(200);
   this.DarkStructureMask.checked = DSM;
   this.DarkStructureMask.toolTip = DarkStructureMaskTT;// "Génère un masque qui isole le fond de ciel.";
   this.DarkStructureMask.onCheck = function (checked) {
      DSM = checked
      dlg.SMContours.enabled = false;
      dlg.SMClassic.enabled = false;
      dlg.BigStars_SpinBox.enabled = false;
      dlg.STmask_Opt.hide();
   };

   this.Starmask = new RadioButton(this);
   this.Starmask.text = StarmaskText; //"Masque d'étoiles";
   this.Starmask.textAlignment = TextAlign_Right | TextAlign_VertCenter;
   this.Starmask.setMinWidth(200);
   this.Starmask.checked = SM;
   this.Starmask.toolTip = StarmaskTT; //"Génère un masque qui isole les étoiles.";
   this.Starmask.onCheck = function (checked) {
      SM = checked
      dlg.SMContours.enabled = true;
      dlg.SMClassic.enabled = true;
      dlg.BigStars_SpinBox.enabled = true;
      dlg.STmask_Opt.show();
   };

   this.TypeMask = new Control(this);
   this.TypeMask.sizer = new VerticalSizer;
   this.TypeMask.sizer.spacing = 4;
   this.TypeMask.sizer.margin = 6;
   this.TypeMask.sizer.add(this.ObjectMask);
   this.TypeMask.sizer.add(this.BackgroundMask);
   this.TypeMask.sizer.add(this.DarkStructureMask);
   this.TypeMask.sizer.add(this.Starmask);
   this.TypeMask.toolTip = TypeMaskTT; //"Zone de selection du type de masque.";


   this.TypeMaskbar = new SectionBar(this);
   this.TypeMaskbar.setTitle(TypeMaskbarText);//"Type de masque"
   this.TypeMask.adjustToContents();
   this.TypeMask.setFixedHeight(this.TypeMask.height);
   this.TypeMask.show();
   this.TypeMaskbar.setSection(this.TypeMask);

   //boutons quitter et executer
   this.ok_Button = new PushButton(this);
   this.ok_Button.text = ok_ButtonText;// "Executer";
   this.ok_Button.icon = ":/icons/power.png";
   this.ok_Button.onClick = function () {
      this.dialog.ok();
      //dlg.ok();
   };
   this.cancel_Button = new PushButton(this);
   this.cancel_Button.text = cancel_ButtonText; //"Quitter";
   this.cancel_Button.icon = ":/icons/close.png";
   this.cancel_Button.onClick = function () {
      this.dialog.cancel();
      return false;
      //dlg.cancel();
   };
   //sizer bouton exit et run
   this.buttons_Sizer = new HorizontalSizer;
   this.buttons_Sizer.spacing = 10;
   this.buttons_Sizer.add(this.ok_Button);
   this.buttons_Sizer.addSpacing(10);
   this.buttons_Sizer.add(this.cancel_Button);

   //sizer global
   this.sizer = new VerticalSizer;
   this.sizer.frameStyle = FrameStyle_Box;
   this.sizer.margin = 8;
   this.sizer.spacing = 6;
   this.sizer.addSpacing(4);
   this.sizer.add(this.helpLabel);
   this.sizer.addSpacing(4);
   this.sizer.add(this.list_GB);
   this.sizer.addSpacing(4);
   this.sizer.add(this.TypeMaskbar);
   this.sizer.add(this.TypeMask);
   this.sizer.addSpacing(4);
   this.sizer.add(this.STmask_Optbar);
   this.sizer.add(this.STmask_Opt);
   this.sizer.addSpacing(4);
   this.sizer.add(this.buttons_Sizer);
   this.adjustToContents();
}
var dialog;
dialogu.prototype = new Dialog;

function Histo(view) {
   ApplyAutoSTF(view, DEFAULT_AUTOSTRETCH_SCLIP, DEFAULT_AUTOSTRETCH_TBGND, DEFAULT_AUTOSTRETCH_CLINK);

   var stf = view.stf;
   var c0 = stf[0][1];
   var m = stf[0][0];

   var H = [[0, 0.5, 1.0, 0, 1.0],
   [0, 0.5, 1.0, 0, 1.0],
   [0, 0.5, 1.0, 0, 1.0],
   [c0, m, 1.0, 0, 1.0],
   [0, 0.5, 1.0, 0, 1.0]];

   var STF = new ScreenTransferFunction;
   STF.interaction = ScreenTransferFunction.prototype.SeparateChannels;
   view.stf = [ // c0, c1, m, r0, r1
      [m, 1.00000, c0, 0.0, 1.0],
      [m, 1.00000, c0, 0.0, 1.0],
      [m, 1.00000, c0, 0.0, 1.0],
      [0, 1.00000, 0.5, 0.0, 1.0]
   ];

   STF.executeOn(view);
   var HT = new HistogramTransformation;
   HT.H = H;
   HT.executeOn(view);

}

function ApplyAutoSTF(view, shadowsClipping, targetBackground, rgbLinked) {

   var stf = new ScreenTransferFunction;

   var n = view.image.isColor ? 3 : 1;

   var median = view.computeOrFetchProperty("Median");

   var mad = view.computeOrFetchProperty("MAD");
   mad.mul(1.4826); // coherent with a normal distribution

   if (rgbLinked) {
      /*
       * Try to find how many channels look as channels of an inverted image.
       * We know a channel has been inverted because the main histogram peak is
       * located over the right-hand half of the histogram. Seems simplistic
       * but this is consistent with astronomical images.
       */
      var invertedChannels = 0;
      for (var c = 0; c < n; ++c)
         if (median.at(c) > 0.5)
            ++invertedChannels;

      if (invertedChannels < n) {
         /*
          * Noninverted image
          */
         var c0 = 0, m = 0;
         for (var c = 0; c < n; ++c) {
            if (1 + mad.at(c) != 1)
               c0 += median.at(c) + shadowsClipping * mad.at(c);
            m += median.at(c);
         }
         c0 = Math.range(c0 / n, 0.0, 1.0);
         m = Math.mtf(targetBackground, m / n - c0);

         stf.STF = [ // c0, c1, m, r0, r1
            [c0, 1, m, 0, 1],
            [c0, 1, m, 0, 1],
            [c0, 1, m, 0, 1],
            [0, 1, 0.5, 0, 1]];
      }
      else {
         /*
          * Inverted image
          */
         var c1 = 0, m = 0;
         for (var c = 0; c < n; ++c) {
            m += median.at(c);
            if (1 + mad.at(c) != 1)
               c1 += median.at(c) - shadowsClipping * mad.at(c);
            else
               c1 += 1;
         }
         c1 = Math.range(c1 / n, 0.0, 1.0);
         m = Math.mtf(c1 - m / n, targetBackground);

         stf.STF = [ // c0, c1, m, r0, r1
            [0, c1, m, 0, 1],
            [0, c1, m, 0, 1],
            [0, c1, m, 0, 1],
            [0, 1, 0.5, 0, 1]];
      }
   }
   else {
      /*
       * Unlinked RGB channnels: Compute automatic stretch functions for
       * individual RGB channels separately.
       */
      var A = [ // c0, c1, m, r0, r1
         [0, 1, 0.5, 0, 1],
         [0, 1, 0.5, 0, 1],
         [0, 1, 0.5, 0, 1],
         [0, 1, 0.5, 0, 1]];

      for (var c = 0; c < n; ++c) {
         if (median.at(c) < 0.5) {
            /*
             * Noninverted channel
             */
            var c0 = (1 + mad.at(c) != 1) ? Math.range(median.at(c) + shadowsClipping * mad.at(c), 0.0, 1.0) : 0.0;
            var m = Math.mtf(targetBackground, median.at(c) - c0);
            A[c] = [c0, 1, m, 0, 1];
         }
         else {
            /*
             * Inverted channel
             */
            var c1 = (1 + mad.at(c) != 1) ? Math.range(median.at(c) - shadowsClipping * mad.at(c), 0.0, 1.0) : 1.0;
            var m = Math.mtf(c1 - median.at(c), targetBackground);
            A[c] = [0, c1, m, 0, 1];
         }
      }

      stf.STF = A;
   }

   console.writeln("<end><cbr/><br/><b>", view.fullId, "</b>:");
   for (var c = 0; c < n; ++c) {
      console.writeln("channel #", c);
      console.writeln(format("c0 = %.6f", stf.STF[c][0]));
      console.writeln(format("m  = %.6f", stf.STF[c][2]));
      console.writeln(format("c1 = %.6f", stf.STF[c][1]));
   }

   stf.executeOn(view);
   console.writeln("<end><cbr/><br/>");
}

function BackgroundMask(view) {
   var imstat = new ImageStatistics(view.image);
   var HT2 = new HistogramTransformation;
   HT2.H = [ // c0, m, c1, r0, r1
      [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
      [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
      [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
      [imstat.mean, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
      [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000]
   ];
   HT2.executeOn(view);
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

   P.executeOn(view);
   var P5 = new ATrousWaveletTransform;//floutage
   with (P5) {
      P5.layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionIterations
         [false, true, 0.000, false, 3.000, 1.00, 1],
         [false, true, 0.000, false, 3.000, 1.00, 1],
         [false, true, 0.000, false, 3.000, 1.00, 1],
         [true, true, 0.000, false, 3.000, 1.00, 1],
         [true, true, 0.000, false, 3.000, 1.00, 1]
      ];
      P5.scaleDelta = 0;
      P5.scalingFunctionData = [
         0.25, 0.5, 0.25,
         0.5, 1, 0.5,
         0.25, 0.5, 0.25
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
         0.8003, 0.2729, 0.1198,
         0.0578, 0.0287, 0.0143,
         0.0072, 0.0036, 0.0019,
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
      P5.executeOn(view);
   }
}

function DarkStructureMask(view) {
   var mask = new ImageWindow(view.image.width,
      view.image.height,
      view.image.numberOfChannels,
      view.window.bitsPerSample,
      view.window.isFloatSample,
      view.image.colorSpace != ColorSpace_Gray,
      "DarkStructure_mask");
   var maskView = mask.mainView;

   // copy data
   maskView.beginProcess(UndoFlag_NoSwapFile);
   maskView.image.apply(view.image);
   maskView.endProcess();

   // RBGWorking space

   var rgb = new RGBWorkingSpace;
   with (rgb) {
      channels = // Y, x, y
         [
            [0.333333, 0.648431, 0.330856],
            [0.333333, 0.321152, 0.597871],
            [0.333333, 0.155886, 0.066044]];
      gamma = 2.20;
      sRGBGamma = true;
      applyGlobalRGBWS = false;
   }
   rgb.executeOn(maskView, false/*swapFile*/);

   // Anti deringing: Carlos Paranoia :D

   var auxMask = new ImageWindow(view.image.width,
      view.image.height,
      view.image.numberOfChannels,
      view.window.bitsPerSample,
      view.window.isFloatSample,
      view.image.colorSpace != ColorSpace_Gray,
      "Mask");
   var AuxmaskView = auxMask.mainView;

   // copy data
   AuxmaskView.beginProcess(UndoFlag_NoSwapFile);
   AuxmaskView.image.apply(view.image);
   AuxmaskView.endProcess();
   // do awt
   var auxLayers = new Array(nStarMask);
   for (var i = 0; i < nStarMask; ++i) {
      auxLayers[i] = [true, true, 1.00, 3.00, 0.000, false, 0, 0.50, 2, 5, false, true, 1.0, 0.02000];
   }
   auxLayers[nStarMask] = [false, true, 1.00, 3.00, 0.000, false, 0, 0.50, 2, 5, false, false, 0.50, 0.02000];

   var P = new ATrousWaveletTransformV1;
   P.version = 257;
   P.layers = auxLayers;
   P.scaleDelta = 0;
   P.scalingFunctionData = [1 / 256, 1 / 64, 3 / 128, 1 / 64, 1 / 256,
   1 / 64, 1 / 16, 3 / 32, 1 / 16, 1 / 64,
   3 / 128, 3 / 32, 9 / 64, 3 / 32, 3 / 128,
   1 / 64, 1 / 16, 3 / 32, 1 / 16, 1 / 64,
   1 / 256, 1 / 64, 3 / 128, 1 / 64, 1 / 256];
   P.scalingFunctionKernelSize = 5;
   P.scalingFunctionNoiseLayers = 9;
   P.scalingFunctionName = "5x5 B3 Spline";
   P.largeScaleFunction = ATrousWaveletTransformV1.prototype.NoFunction;
   P.curveBreakPoint = 0.75;
   P.noiseThresholdingAmount = 0.00;
   P.noiseThreshold = 3.00;
   P.lowRange = 0.000;
   P.highRange = 0.000;
   P.previewMode = ATrousWaveletTransformV1.prototype.Disabled;
   P.previewLayer = 0;
   P.toLuminance = true;
   P.toChrominance = false;
   P.linear = false;
   P.executeOn(AuxmaskView, false/*swapFile*/);
   var pm = new PixelMath;

   var id = auxMask.mainView.id;

   with (pm) {
      expression = "$T -" + id;
      useSingleExpression = true;
      use64BitWorkingImage = false;
      rescale = false;
      rescaleLower = 0.0000000000;
      rescaleUpper = 1.0000000000;
      truncate = true;
      truncateLower = 0.0000000000;
      truncateUpper = 1.0000000000;
      createNewImage = false;
   }

   pm.executeOn(maskView, false/*swapFile*/);
   auxMask.forceClose();
   // wavlets
   var auxLayers = new Array(7);
   for (var i = 0; i < 7; ++i) {
      auxLayers[i] = [false, true, 1.00, 3.00, 0.000, false, 0, 0.50, 2, 5, false, false, 0.50, 0.02000];
   }
   auxLayers[7] = [true, true, 1.00, 3.00, 0.000, false, 0, 0.50, 2, 5, false, false, 0.50, 0.02000];

   var wavlets = new ATrousWaveletTransformV1;
   with (wavlets) {
      version = 257;
      layers = auxLayers;
      scaleDelta = 0;
      scalingFunctionData = [1 / 256, 1 / 64, 3 / 128, 1 / 64, 1 / 256,
      1 / 64, 1 / 16, 3 / 32, 1 / 16, 1 / 64,
      3 / 128, 3 / 32, 9 / 64, 3 / 32, 3 / 128,
      1 / 64, 1 / 16, 3 / 32, 1 / 16, 1 / 64,
      1 / 256, 1 / 64, 3 / 128, 1 / 64, 1 / 256];
      scalingFunctionKernelSize = 5;
      scalingFunctionName = "5x5 B3 Spline";
      largeScaleFunction = NoFunction;
      curveBreakPoint = 0.75;
      noiseThresholdingAmount = 0.00;
      noiseThreshold = 3.00;
      lowRange = 0.000;
      highRange = 0.000;
      previewMode = Disabled;
      previewLayer = 0;
      toLuminance = true;
      toChrominance = true;
      linear = false;
   }
   wavlets.executeOn(maskView, false/*swapFile*/);
   // Pixel Math
   var pm = new PixelMath;
   with (pm) {
      expression = maskView.id + "-" + view.id;
      expression1 = "";
      expression2 = "";
      useSingleExpression = true;
      variables = "";
      use64BitWorkingImage = false;
      rescale = false;
      rescaleLower = 0.0000000000;
      rescaleUpper = 1.0000000000;
      truncate = true;
      truncateLower = 0.0000000000;
      truncateUpper = 1.0000000000;
      createNewImage = false;
      newImageId = "";
      newImageWidth = 0;
      newImageHeight = 0;
      newImageColorSpace = SameAsTarget;
      newImageSampleFormat = SameAsTarget;
   }
   pm.executeOn(maskView, false/*swapFile*/);

   // Convert to gray

   if (view.image.colorSpace != ColorSpace_Gray) {
      var toGray = new ConvertToGrayscale;
      toGray.executeOn(maskView, false/*swapFile*/);
   }

   // Rescale

   var rescale = new Rescale;
   with (rescale) {
      mode = RGBK;
   }
   rescale.executeOn(maskView, false/*swapFile*/);

   // Noise reduction

   var nr = new ATrousWaveletTransformV1;
   with (nr) {
      version = 257;
      layers = // enabled, biasEnabled, structureDetectionThreshold, structureDetectionRange, bias, noiseReductionEnabled, noiseReductionFilter, noiseReductionAmount, noiseReductionIterations, noiseReductionKernelSize, noiseReductionProtectSignificant, deringingEnabled, deringingAmount, deringingThreshold
         [
            [false, true, 1.00, 3.00, 0.000, false, Recursive, 1.00, 5, 5, false, false, 0.50, 0.02000],
            [true, true, 1.00, 3.00, 0.000, true, Recursive, 1.00, 5, 5, false, false, 0.50, 0.02000],
            [true, true, 1.00, 3.00, 0.000, false, Recursive, 0.50, 2, 5, false, false, 0.50, 0.02000]];
      scaleDelta = 0;
      scalingFunctionData = [
         0.292893, 0.5, 0.292893,
         0.5, 1, 0.5,
         0.292893, 0.5, 0.292893];
      scalingFunctionKernelSize = 3;
      scalingFunctionName = "3x3 Linear Interpolation";
      largeScaleFunction = NoFunction;
      toLuminance = true;
      toChrominance = false;
      linear = false;
   }
   nr.executeOn(maskView, false);

   mask.show();
}

function Starmask(view) {
   var P = new HDRMultiscaleTransform;
   P.numberOfLayers = 5;
   P.numberOfIterations = 1;
   P.invertedIterations = true;
   P.overdrive = 0.4;
   P.medianTransform = false;
   P.scalingFunctionData = [
      0.003906, 0.015625, 0.023438, 0.015625, 0.003906,
      0.015625, 0.0625, 0.09375, 0.0625, 0.015625,
      0.023438, 0.09375, 0.140625, 0.09375, 0.023438,
      0.015625, 0.0625, 0.09375, 0.0625, 0.015625,
      0.003906, 0.015625, 0.023438, 0.015625, 0.003906
   ];
   P.scalingFunctionRowFilter = [
      0.0625, 0.25,
      0.375, 0.25,
      0.0625
   ];
   P.scalingFunctionColFilter = [
      0.0625, 0.25,
      0.375, 0.25,
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
   P.executeOn(view);

   var P = new ATrousWaveletTransform;
   P.layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionIterations
      [false, true, 0.000, false, 3.000, 1.00, 1],
      [false, true, 0.000, false, 3.000, 1.00, 1],
      [true, true, 0.000, false, 3.000, 1.00, 1],
      [true, true, 0.000, false, 3.000, 1.00, 1],
      [true, true, 0.000, false, 3.000, 1.00, 1],
      [false, true, 0.000, false, 3.000, 1.00, 1],
      [false, true, 0.000, false, 3.000, 1.00, 1],
      [false, true, 0.000, false, 3.000, 1.00, 1],
      [true, true, 0.000, false, 3.000, 1.00, 1]
   ];
   P.scaleDelta = 0;
   P.scalingFunctionData = [
      0.25, 0.5, 0.25,
      0.5, 1, 0.5,
      0.25, 0.5, 0.25
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
      0.8003, 0.2729, 0.1198,
      0.0578, 0.0287, 0.0143,
      0.0072, 0.0036, 0.0019,
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
   P.executeOn(view);

   var imgStat = new ImageStatistics(view.image);
   var values = new Array(0.1, 0.25, 0.5, 0.75, 0.98);
   var window = new Array();
   for (let i = 0; i < values.length; i++) {
      //var starmask = new StarMask;
      //with (starmask) {
      var P = new StarMask;
      P.shadowsClipping = 0.1;
      P.midtonesBalance = values[i];
      P.highlightsClipping = 0.8;
      P.waveletLayers = bigstars;
      P.structureContours = false;
      P.noiseThreshold = imgStat.mean;
      P.aggregateStructures = true;
      P.binarizeStructures = true;
      P.largeScaleGrowth = 0;
      P.smallScaleGrowth = 0;
      P.growthCompensation = 0;
      P.smoothness = 1;
      P.invert = false;
      P.truncation = 0.8;
      P.limit = 1.00000;
      P.mode = StarMask.prototype.StarMask;

      /*shadowsClipping = 0.1;
      midtonesBalance = values[i];
      highlightsClipping = 0.9;
      waveletLayers = bigstars;
      noiseThreshold = imgStat.mean + 0.1;
      mode = StructureMap;
   }*/
      //starmask.executeOn(view);
      P.executeOn(view);
      window[i] = ImageWindow.activeWindow;
   }
   windowClone1.forceClose();

   var P = new PixelMath;
   P.expression = "max(" + window[0].mainView.id + "," + window[1].mainView.id + "," + window[2].mainView.id + "," + window[3].mainView.id + "," + window[4].mainView.id + ")";
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
   P.newImageId = "full_star_mask";
   P.newImageWidth = 0;
   P.newImageHeight = 0;
   P.newImageAlpha = false;
   P.newImageColorSpace = PixelMath.prototype.SameAsTarget;
   P.newImageSampleFormat = PixelMath.prototype.SameAsTarget;
   P.executeOn(window[0].currentView);
   var windowMask = ImageWindow.activeWindow;
   for (let i = 0; i < values.length; i++) {
      window[i].forceClose();//supprime les masques intermédiaires
   }

   var P = new Convolution;
   P.mode = Convolution.prototype.Parametric;
   P.sigma = 2.00;
   P.shape = 2.00;
   P.aspectRatio = 1.00;
   P.rotationAngle = 0.00;
   P.filterSource = "";
   P.rescaleHighPass = false;
   P.viewId = "";
   P.executeOn(windowMask.currentView);
   var P = new MorphologicalTransformation;
   P.operator = MorphologicalTransformation.prototype.Dilation;
   P.interlacingDistance = 1;
   P.lowThreshold = 0.000000;
   P.highThreshold = 0.000000;
   P.numberOfIterations = 2;
   P.amount = 0.65;
   P.selectionPoint = 0.50;
   P.structureName = "";
   P.structureSize = 3;
   P.structureWayTable = [ // mask
      [[
         0x00, 0x01, 0x00,
         0x01, 0x01, 0x01,
         0x00, 0x01, 0x00
      ]]
   ];
   P.executeOn(windowMask.currentView);
   return windowMask.currentView;
}

function StarmaskContours(view) {
   copyView(view, "clone");
   var windowClone = ImageWindow.activeWindow;
   var P = new MorphologicalTransformation;
   P.operator = MorphologicalTransformation.prototype.Erosion;
   P.interlacingDistance = 1;
   P.lowThreshold = 0.000000;
   P.highThreshold = 0.000000;
   P.numberOfIterations = 2;
   P.amount = 1.00;
   P.selectionPoint = 0.50;
   P.structureName = "";
   P.structureSize = 3;
   P.structureWayTable = [ // mask
      [[
         0x01, 0x01, 0x01,
         0x01, 0x01, 0x01,
         0x01, 0x01, 0x01
      ]]
   ];
   P.executeOn(windowClone.currentView);
   var P = new PixelMath;
   P.expression = view.id + "-" + windowClone.mainView.id;
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
   P.executeOn(view);
   windowClone.forceClose();
}

function main() {
   // Get access to the current active image window.
   console.hide();
   var window = ImageWindow.activeWindow;
   if (window.isNull) {
      var msg = new MessageBox("No active window", "Image Selection Warning", StdIcon_Warning, StdButton_Ok);
      msg.execute();
   }
   else {
      dialog = new dialogu();
      if (dialog.execute() != false) {
         if (OM) {
            copyView(data, "Object_mask");
            windowClone1 = ImageWindow.activeWindow;
            copyView(data, "starmask");
            windowClone2 = ImageWindow.activeWindow;
            copyView(data, "clone");
            windowClone3 = ImageWindow.activeWindow;
            if (Linear) {
               Histo(windowClone1.currentView);
               Histo(windowClone2.currentView);
               Histo(windowClone3.currentView);
            }
            if (couleur) {
               var P = new ConvertToGrayscale;
               P.executeOn(windowClone1.currentView);
               P.executeOn(windowClone2.currentView);
               P.executeOn(windowClone3.currentView);
            }
            ObjectMask(data, "clone");
            windowClone2.forceClose();
            windowClone3.forceClose();
         } else if (BM) {
            copyView(data, "Background_mask");
            windowClone1 = ImageWindow.activeWindow;
            if (Linear) {
               Histo(windowClone1.currentView);
            }
            if (couleur) {
               var P = new ConvertToGrayscale;
               P.executeOn(windowClone1.currentView);
            }
            BackgroundMask(windowClone1.currentView);
         }
         else if (DSM) {
            copyView(data, "clone");
            windowClone1 = ImageWindow.activeWindow;
            if (Linear) {
               Histo(windowClone1.currentView);
            }
            if (couleur) {
               var P = new ConvertToGrayscale;
               P.executeOn(windowClone1.currentView);
            }
            DarkStructureMask(windowClone1.currentView);
            windowClone1.forceClose();
         } else if (SM) {
            copyView(data, "clone");
            windowClone1 = ImageWindow.activeWindow;
            if (Linear) {
               Histo(windowClone1.currentView);
            }
            if (couleur) {
               var P = new ConvertToGrayscale;
               P.executeOn(windowClone1.currentView);
            }
            if (SMContours) {
               StarmaskContours(Starmask(windowClone1.currentView));
            } else {
               Starmask(windowClone1.currentView);
            }
         }
      }
   }
};
main();

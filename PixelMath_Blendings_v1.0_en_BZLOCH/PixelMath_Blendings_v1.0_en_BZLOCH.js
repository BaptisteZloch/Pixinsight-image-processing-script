//Script de baptiste ZLOCH
//ENGLISH VERSION

//bibliothèques
#include <pjsr/Sizer.jsh>
#include <pjsr/NumericControl.jsh>
#include <pjsr/FrameStyle.jsh>
#include <pjsr/StdButton.jsh>
#include <pjsr/StdIcon.jsh>
//infos
#feature-id    Utilities > PixelMath blendings
#feature-info  Automatic blending script.< br />\
<br />\
A script that automaticly performs the blendings you choose. There is also options about noise, colors, saturation.<br/>\
   This script needs a least 2 b&w images.<br/>\
   <br/>\
   Copyright &copy; 2020 Baptiste ZLOCH
   #feature-icon  ZTA.svg
//definition des textes
#define VERSION "1.0"
#define TITLE "<p><b>PixelMath blendings v" + VERSION +"</b> &mdash; A script that automaticly performs the blendings you choose.</p>"
#define Signature "<p>Copyright &copy; 2020 Baptiste ZLOCH. All rights reserved. <b><a href=\"www.zlochteamastro.com\">www.zlochteamastro.com</a></b></p>"
#define time "\n\nProcess performed in : "
#define targetImage_LabelText "H-alpha target image :"
#define targetImage_Label1Text "OIII target image :"
#define targetImage_Label2Text "SII target image :"
#define targetImage_ViewListTT "Select H-alpha image."
#define targetImage_ViewList1TT "Select OIII image."
#define targetImage_ViewList2TT "Select SII image."
#define PMCheckBoxText "SHO blendings"
#define PMCheckBoxTT "Execute the SHO type blendings."
#define PMCheckBoxHOOText "HOO blendings"
#define PMCheckBoxHOOTT "Execute the HOO type blendings."
#define PMCheckBoxAuText "Others blendings";
#define PMCheckBoxAuTT "Execute the others type blendings."
#define optionsGroupBoxText "Select your blendings"
#define RGreenText "Green removal : "
#define RGreenTT "Remove the green on each blending."
#define RMagentaText "Magenta removal : "
#define RMagentaTT "Remove the magenta on each blending."
#define CheckBoxSatText "Saturation"
#define CheckBoxSatTT "Saturate a bit the blends."
#define CheckBoxDenText "Denoise"
#define CheckBoxDenTT "it denoises the image with ACDNR on L and colors components."
#define ColorGroupBoxText "Options"
#define ok_ButtonText "Run"
#define cancel_ButtonText "Cancel"

//variables globales
var etatSHO;
var etatHOO;
var etatAutres;
var sat;
var bruit;

var dataS;
var dataH;
var dataO;

var GreenTH = 1.0;
var MagentaTH = 0.1;

function setDefault() {//remise a 0 des paramètres
   etatSHO = false;
   etatHOO = false;
   etatAutres = false;
   sat = false;
   bruit = false;
}


function PM(view, exp1, exp2, exp3) {
   var P = new PixelMath;
   P.expression = exp1;
   P.expression1 = exp2;
   P.expression2 = exp3;
   P.expression3 = "";
   P.useSingleExpression = false;
   P.symbols = "";
   P.generateOutput = true;
   P.singleThreaded = false;
   P.use64BitWorkingImage = false;
   P.rescale = true;
   P.rescaleLower = 0;
   P.rescaleUpper = 1;
   P.truncate = true;
   P.truncateLower = 0;
   P.truncateUpper = 1;
   P.createNewImage = true;
   P.showNewImage = true;
   P.newImageId = "SHO";
   P.newImageWidth = 0;
   P.newImageHeight = 0;
   P.newImageAlpha = false;
   P.newImageColorSpace = PixelMath.prototype.RGB;
   P.newImageSampleFormat = PixelMath.prototype.SameAsTarget;
   P.executeOn(view);

   if (GreenTH != 0.0) {
      //retrait du vert
      var P = new SCNR;
      P.amount = GreenTH;
      P.protectionMethod = SCNR.prototype.AverageNeutral;
      P.colorToRemove = SCNR.prototype.Green;
      P.preserveLightness = true;
      P.executeOn(ImageWindow.activeWindow.currentView);
   }
   if (MagentaTH != 0.0) {

      //retrait du magenta
      //inversion
      var P = new PixelMath;
      P.expression = "~$T";
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
      P.executeOn(ImageWindow.activeWindow.currentView);

      //retrait
      var P = new SCNR;
      P.amount = MagentaTH;
      P.protectionMethod = SCNR.prototype.AverageNeutral;
      P.colorToRemove = SCNR.prototype.Green;
      P.preserveLightness = true;
      P.executeOn(ImageWindow.activeWindow.currentView);

      //reinversion
      var P = new PixelMath;
      P.expression = "~$T";
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
      P.executeOn(ImageWindow.activeWindow.currentView);
   }
   if (bruit) {
      var P = new ACDNR;
      P.applyToLightness = true;
      P.applyToChrominance = true;
      P.useMaskL = true;
      P.useMaskC = true;
      P.sigmaL = 6.0;
      P.sigmaC = 6.5;
      P.shapeL = 0.50;
      P.shapeC = 0.50;
      P.amountL = 0.15;
      P.amountC = 0.45;
      P.iterationsL = 4;
      P.iterationsC = 4;
      P.prefilterMethodL = ACDNR.prototype.None;
      P.prefilterMethodC = ACDNR.prototype.None;
      P.protectionMethodL = ACDNR.prototype.Median5x5;
      P.protectionMethodC = ACDNR.prototype.UnweightedAverage3x3;
      P.minStructSizeL = 4;
      P.minStructSizeC = 5;
      P.protectDarkSidesL = true;
      P.protectDarkSidesC = true;
      P.darkSidesThresholdL = 0.015;
      P.darkSidesThresholdC = 0.030;
      P.darkSidesOverdriveL = 0.00;
      P.darkSidesOverdriveC = 0.00;
      P.protectBrightSidesL = true;
      P.protectBrightSidesC = true;
      P.brightSidesThresholdL = 0.015;
      P.brightSidesThresholdC = 0.030;
      P.brightSidesOverdriveL = 0.00;
      P.brightSidesOverdriveC = 0.00;
      P.starProtectionL = true;
      P.starProtectionC = true;
      P.starThresholdL = 0.030;
      P.starThresholdC = 0.030;
      P.previewMask = false;
      P.maskRemovedWaveletLayers = 2;
      P.maskShadowsClipping = 0.04000;
      P.maskHighlightsClipping = 1.00000;
      P.maskMTF = 0.38000;
      P.executeOn(ImageWindow.activeWindow.currentView);
   }
   if (sat) {
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
         [0.48579, 0.51680],
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
         [0.13953, 0.19897],
         [1.00000, 1.00000]
      ];
      P.ct = CurvesTransformation.prototype.AkimaSubsplines;
      P.H = [ // x, y
         [0.00000, 0.00000],
         [0.51163, 0.58656],
         [1.00000, 1.00000]
      ];
      P.Ht = CurvesTransformation.prototype.AkimaSubsplines;
      P.S = [ // x, y
         [0.00000, 0.00000],
         [0.14470, 0.19897],
         [1.00000, 1.00000]
      ];
      P.St = CurvesTransformation.prototype.AkimaSubsplines;
      P.executeOn(ImageWindow.activeWindow.currentView);
   }
}

//interface graphique
function dialogu() {
   this.__base__ = Dialog;
   this.__base__();

   this.helpLabel = new Label(this);
   this.helpLabel.frameStyle = FrameStyle_Box;
   this.helpLabel.margin = 4;
   this.helpLabel.wordWrapping = true;
   this.helpLabel.useRichText = true;
   this.helpLabel.text = TITLE + Signature ;

   // Target Image
   this.targetImage_Label = new Label(this);
   this.targetImage_Label.minWidth = 6; // Align with labels inside group boxes below
   this.targetImage_Label.text = targetImage_LabelText; //"Image cible H-alpha :"
   this.targetImage_Label.textAlignment = 2 | 128;

   this.targetImage_ViewList = new ViewList(this);
   this.targetImage_ViewList.minWidth = 200;
   this.targetImage_ViewList.getAll(); 					// Include main views as well as previews
   // this.targetImage_ViewList.currentView = data.targetView;
   this.targetImage_ViewList.toolTip = targetImage_ViewListTT;
   this.targetImage_ViewList.onViewSelected = function (view) {
      dataH = view;
   };
   this.targetImage_Label1 = new Label(this);
   this.targetImage_Label1.minWidth = 6; // Align with labels inside group boxes below
   this.targetImage_Label1.text = targetImage_Label1Text;
   this.targetImage_Label1.textAlignment = 2 | 128;

   this.targetImage_ViewList1 = new ViewList(this);
   this.targetImage_ViewList1.minWidth = 200;
   this.targetImage_ViewList1.getAll(); 					// Include main views as well as previews
   this.targetImage_ViewList1.toolTip = targetImage_ViewList1TT ;
   this.targetImage_ViewList1.onViewSelected = function (view) {
      dataO = view;
   };
   this.targetImage_Label2 = new Label(this);
   this.targetImage_Label2.minWidth = 6; // Align with labels inside group boxes below
   this.targetImage_Label2.text = targetImage_Label2Text;
   this.targetImage_Label2.textAlignment = 2 | 128;

   this.targetImage_ViewList2 = new ViewList(this);
   this.targetImage_ViewList2.minWidth = 200;
   this.targetImage_ViewList2.getAll(); 					// Include main views as well as previews
   this.targetImage_ViewList2.toolTip = targetImage_ViewList2TT ;
   this.targetImage_ViewList2.onViewSelected = function (view) {
      dataS = view;
   };
   this.targetImage_SizerH = new HorizontalSizer;
   this.targetImage_SizerH.spacing = 4;
   this.targetImage_SizerH.add(this.targetImage_Label);
   this.targetImage_SizerH.add(this.targetImage_ViewList, 100);

   this.targetImage_SizerO = new HorizontalSizer;
   this.targetImage_SizerO.spacing = 4;
   this.targetImage_SizerO.add(this.targetImage_Label1);
   this.targetImage_SizerO.add(this.targetImage_ViewList1, 100);

   this.targetImage_SizerS = new HorizontalSizer;
   this.targetImage_SizerS.spacing = 4;
   this.targetImage_SizerS.add(this.targetImage_Label2);
   this.targetImage_SizerS.add(this.targetImage_ViewList2, 100);

   this.sizerSHO = new VerticalSizer;
   this.sizerSHO.margin = 8;
   this.sizerSHO.spacing = 6;
   this.sizerSHO.addSpacing(4);
   this.sizerSHO.add(this.targetImage_SizerH);
   this.sizerSHO.add(this.targetImage_SizerO);
   this.sizerSHO.add(this.targetImage_SizerS);

   this.PMCheckBox = new CheckBox(this);
   this.PMCheckBox.text = PMCheckBoxText; //"Mixages SHO";
   this.PMCheckBox.checked = false;
   this.PMCheckBox.toolTip = PMCheckBoxTT;//"On execute les mixages qui de type SHO.";
   this.PMCheckBox.onCheck = function (checked) {
      etatSHO = checked;
   }

   this.PMCheckBoxHOO = new CheckBox(this);
   this.PMCheckBoxHOO.text = PMCheckBoxHOOText;//"Mixages HOO";
   this.PMCheckBoxHOO.checked = false;
   this.PMCheckBoxHOO.toolTip = PMCheckBoxHOOTT;//"On execute les mixages qui de type HOO.";
   this.PMCheckBoxHOO.onCheck = function (checked) {
      etatHOO = checked;
   }
   this.PMCheckBoxAu = new CheckBox(this);
   this.PMCheckBoxAu.text = PMCheckBoxAuText;//"Mixages fataisistes";
   this.PMCheckBoxAu.checked = false;
   this.PMCheckBoxAu.toolTip = PMCheckBoxAuTT;//"On execute les mixages fantaisistes.";
   this.PMCheckBoxAu.onCheck = function (checked) {
      etatAutres = checked;
   }

   this.optionsGroupBox = new GroupBox(this);
   with (this.optionsGroupBox) {
      title = optionsGroupBoxText;//"Selectionner vos mixages";
      sizer = new HorizontalSizer;
      sizer.margin = 6;
      sizer.spacing = 4;
      sizer.add(this.PMCheckBox);
      sizer.add(this.PMCheckBoxHOO);
      sizer.add(this.PMCheckBoxAu);
   }

   this.RGreen = new NumericControl(this);
   with (this.RGreen) {
      label.text = RGreenText; //"Retrait du vert : ";
      label.minWidth = 200
      setRange(0.0, 1.0);
      slider.setRange(0, 1000);
      slider.minWidth = 250;
      setPrecision(2);
      setValue(1.0);
      toolTip = RGreenTT; //"Retrait du vert sur les differents mixages";
      onValueUpdated = function (value) { GreenTH = value; };
   }

   this.RMagenta = new NumericControl(this);
   with (this.RMagenta) {
      label.text = RMagentaText;//"Retrait du magenta : ";
      label.minWidth = 200;
      setRange(0., 1.0);
      slider.setRange(0, 1000);
      slider.minWidth = 250;
      setPrecision(2);
      setValue(0.1);
      toolTip = RMagentaTT;//"Retrait du magenta sur les differents mixages";
      onValueUpdated = function (value) { MagentaTH = value; };
   }

   this.CheckBoxSat = new CheckBox(this);
   this.CheckBoxSat.text = CheckBoxSatText;//"Saturation";
   this.CheckBoxSat.checked = false;
   this.CheckBoxSat.toolTip = CheckBoxSatTT; //"On sature légèrement chaque image";
   this.CheckBoxSat.onCheck = function (checked) {
      sat = checked;
   }
   this.CheckBoxDen = new CheckBox(this);
   this.CheckBoxDen.text = CheckBoxDenText;//"Retrait du bruit";
   this.CheckBoxDen.checked = false;
   this.CheckBoxDen.toolTip = CheckBoxDenTT; //"On execute une réduction de bruit de luminance et de couleur grâce a un ACDNR";
   this.CheckBoxDen.onCheck = function (checked) {
      bruit = checked;
   }

   this.ColorGroupBox = new GroupBox(this);
   with (this.ColorGroupBox) {
      title = ColorGroupBoxText;//"Options";
      sizer = new VerticalSizer;
      sizer.margin = 6;
      sizer.spacing = 4;
      sizer.add(this.RGreen);
      sizer.add(this.RMagenta);
      sizer.add(this.CheckBoxSat);
      sizer.add(this.CheckBoxDen);
   }


   this.ok_Button = new PushButton(this);
   this.ok_Button.text = ok_ButtonText;//"Executer";
   this.ok_Button.icon = ":/icons/power.png";
   this.ok_Button.onClick = function () {
      this.dialog.ok();
   };
   this.cancel_Button = new PushButton(this);
   this.cancel_Button.text = cancel_ButtonText;//"Quitter";
   this.cancel_Button.icon = ":/icons/close.png";
   this.cancel_Button.onClick = function () {
      this.dialog.cancel();
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
   this.sizer.add(this.sizerSHO);
   this.sizer.addSpacing(4);
   this.sizer.add(this.optionsGroupBox);
   this.sizer.addSpacing(4);
   this.sizer.add(this.ColorGroupBox);
   this.sizer.addSpacing(4);
   this.sizer.add(this.buttons_Sizer);
   dialog = this;
}

var dialog;
dialogu.prototype = new Dialog;
//main
function main() {
   console.hide();
   var window = ImageWindow.activeWindow;
   if (window.isNull) {
      var msg = new MessageBox("No active window", "Image Selection Warning", StdIcon_Warning, StdButton_Ok);
      msg.execute();
   } else {
      setDefault();
      dialog = new dialogu();
      dialog.execute();
      start = new Date();
      if (etatSHO) {
         PM(ImageWindow.activeWindow.currentView, "0.75*" + dataS.id + "+0.25*" + dataH.id + "", "0.3*" + dataH.id + "+0.6*O+0.1*" + dataS.id, "0.8*O+0.2*" + dataH.id + "");
         PM(ImageWindow.activeWindow.currentView, dataS.id, "0.5*" + dataO.id + "+0.5*" + dataS.id, dataO.id);
         PM(ImageWindow.activeWindow.currentView, dataS.id, dataH.id, dataO.id);
         PM(ImageWindow.activeWindow.currentView, "" + dataS.id + "*0.8+" + dataH.id + "*0.2", "0.25*" + dataO.id + "+0.25*" + dataS.id + "+" + dataH.id + "*0.5", "" + dataO.id + "*0.8+" + dataH.id + "*0.1+" + dataS.id + "*0.1");
         PM(ImageWindow.activeWindow.currentView, "(~(~" + dataS.id + "*~(" + dataH.id + "-" + dataO.id + ")))*0.5+" + dataS.id + "*0.5",dataH.id , "(~(~" + dataO.id + "*~(" + dataH.id + "-" + dataS.id + ")))*0.5+" + dataO.id + "*0.5");
         PM(ImageWindow.activeWindow.currentView, "" + dataH.id + "*0.4+" + dataS.id + "*0.6", "" + dataO.id + "*0.4+" + dataH.id + "*0.3+" + dataS.id + "*0.2", dataO.id);
         PM(ImageWindow.activeWindow.currentView, "(avg(((tan(Max((" + dataH.id + "*0.5),(" + dataS.id + "*1)))+Si(" + dataH.id + "))*0.4+tan(Max((" + dataH.id + "*0.5),(" + dataS.id + "*1)))*0.6), (tan(Max((" + dataH.id + "*0.5),(" + dataS.id + "*1)))+Si(" + dataH.id + "))))*0.5+0.5*((~(~" + dataS.id + "*~(" + dataH.id + "-" + dataO.id + ")))*0.5+" + dataS.id + "*0.5)", "avg(((sin(" + dataH.id + ")*tan(" + dataH.id + ")*0.4)+" + dataH.id + "*0.6), sin(" + dataH.id + "), " + dataH.id + ", Tan(" + dataH.id + "))", "(avg(((tan(~(~(" + dataO.id + "*1)*~(" + dataH.id + "*0.35))))*0.4+tan(~(~(" + dataO.id + "*1)*~(" + dataH.id + "*0.35)))*0.6), tan(~(~(" + dataO.id + "*1)*~(" + dataH.id + "*0.35)))))*0.5+((~(~" + dataO.id + "*~(" + dataH.id + "-" + dataS.id + ")))*0.5+" + dataO.id + "*0.5)*0.5");
         PM(ImageWindow.activeWindow.currentView, "avg(((tan(" + dataS.id + ")+Si(" + dataH.id + "))*0.4+tan(" + dataS.id + ")*0.6), (tan(" + dataS.id + ")+Si(" + dataH.id + ")))", "avg(((sin(" + dataH.id + ")*tan(" + dataH.id + ")*0.4)+" + dataH.id + "*0.6), sin(" + dataH.id + "))", "avg(((tan(" + dataO.id + "))*0.4+tan(" + dataO.id + ")*0.6), tan(" + dataO.id + "))");
         PM(ImageWindow.activeWindow.currentView, "iif((" + dataS.id + "*1)>0.5, ~(~(2*((" + dataS.id + "*1)-0.5))*~(" + dataH.id + "*1)), 2*(" + dataS.id + "*1)*(" + dataH.id + "*1))", dataH.id, "iif((" + dataO.id + "*1)>0.5, ~(~(2*((" + dataO.id + "*1)-0.5))*~(" + dataH.id + "*1)), 2*(" + dataO.id + "*1)*(" + dataH.id + "*1))");
         PM(ImageWindow.activeWindow.currentView, "avg(((tan(" + dataS.id + ")+Si(" + dataH.id + "))*0.4+tan(" + dataS.id + ")*0.6), (tan(" + dataS.id + ")+Si(" + dataH.id + ")))", "avg(((Si(" + dataH.id + ")*tan(" + dataH.id + ")*0.4)+" + dataH.id + "*0.6), " + dataH.id + ")", "avg(((tan(" + dataO.id + "))*0.4+tan(" + dataO.id + ")*0.6), tan(" + dataO.id + "), (iif((" + dataO.id + "*1)>0.5, ~(~(2*((" + dataO.id + "*1)-0.5))*~(" + dataH.id + "*1)), 2*(" + dataO.id + "*1)*(" + dataH.id + "*1))))");
         PM(ImageWindow.activeWindow.currentView, "avg(((tan(" + dataS.id + ")+Si(" + dataH.id + "))*0.4+tan(" + dataS.id + ")*0.6), (tan(" + dataS.id + ")+Si(" + dataH.id + ")), ((tan(" + dataS.id + ")+Si(" + dataH.id + "))*0.5+(" + dataH.id + "-(iif((" + dataO.id + "*1)>0.5, ~(~(2*((" + dataO.id + "*1)-0.5))*~(" + dataH.id + "*1)), 2*(" + dataO.id + "*1)*(" + dataH.id + "*1))))*0.5))", "avg(((Si(" + dataH.id + ")*tan(" + dataH.id + ")*0.4)+" + dataH.id + "*0.6), tan(" + dataH.id + "), sqrt(" + dataH.id + "))", "avg(((tan(" + dataO.id + "))*0.4+tan(" + dataO.id + ")*0.6), tan(" + dataO.id + "))");
         PM(ImageWindow.activeWindow.currentView, "avg(((tan(" + dataS.id + ")+Si(" + dataH.id + "))*0.4+tan(" + dataS.id + ")*0.6), (tan(" + dataS.id + ")+Si(" + dataH.id + ")), (avg(" + dataH.id + ", " + dataS.id + ")) )", "avg(((Si(" + dataH.id + ")*tan(" + dataH.id + ")*0.4)+" + dataH.id + "*0.6), " + dataH.id + ")", "avg(((tan(" + dataO.id + "))*0.4+tan(" + dataO.id + ")*0.6), tan(" + dataO.id + "))");
         PM(ImageWindow.activeWindow.currentView, "" + dataS.id + "*0.20+" + dataH.id + "*0.8", "" + dataO.id + "", "" + dataO.id + "*0.85+" + dataH.id + "*0.15");
         PM(ImageWindow.activeWindow.currentView, "avg(" + dataH.id + " , (" + dataS.id + "*0.20+" + dataH.id + "*0.8))", "avg(" + dataS.id + ", " + dataO.id + ")", "avg(" + dataS.id + ", (" + dataO.id + "*0.85+" + dataH.id + "*0.15))");
         PM(ImageWindow.activeWindow.currentView, "avg(((~(~" + dataS.id + "*~(" + dataH.id + "-" + dataO.id + ")))*0.5+" + dataS.id + "*0.5), (max((avg(($T-" + dataH.id + "*0.2), (avg( (min((sin(sin(sqrt(" + dataH.id + "+" + dataO.id + ")))), ~" + dataO.id + ", (" + dataH.id + "-" + dataO.id + "))) , (max((sin(sin(sqrt(" + dataH.id + "+" + dataO.id + ")))), ~" + dataO.id + ", (" + dataH.id + "-" + dataO.id + "))) )), tan(" + dataH.id + "))), (avg((" + dataH.id + "-" + dataO.id + "), (avg(((" + dataH.id + "-(iif((" + dataO.id + "*1)>0.5, ~(~(2*((" + dataO.id + "*1)-0.5))*~(" + dataH.id + "*1)), 2*(" + dataO.id + "*1)*(" + dataH.id + "*1)))*1.1)*1.1), (min(((" + dataH.id + "-(iif((" + dataO.id + "*1)>0.5, ~(~(2*((" + dataO.id + "*1)-0.5))*~(" + dataH.id + "*1)), 2*(" + dataO.id + "*1)*(" + dataH.id + "*1)))*1.1)*1.1), " + dataO.id + ")) )))))))", "avg(((Si(" + dataH.id + ")*tan(" + dataH.id + ")*0.4)+" + dataH.id + "*0.6), tan(" + dataH.id + "), sqrt(" + dataH.id + "))", "(sin(Pi () / 2 * ((~(~" + dataO.id + "*~(" + dataH.id + "-" + dataS.id + ")))*0.5+" + dataO.id + "*0.5)))^1.5");
         PM(ImageWindow.activeWindow.currentView, "" + dataS.id + "*0.3+" + dataH.id + "", dataO.id, "" + dataH.id + "*0.3+" + dataO.id + "");
      }
      if (etatHOO) {
         PM(ImageWindow.activeWindow.currentView, dataH.id, dataO.id, dataO.id);
         PM(ImageWindow.activeWindow.currentView, "iif(" + dataH.id + " > 0.15, " + dataH.id + ", (" + dataH.id + "*0.8)+(" + dataO.id + "*0.2))", "iif(" + dataH.id + " >0.5, 1-(1-" + dataO.id + ")*(1-(" + dataH.id + "-0.5)), " + dataO.id + "*(" + dataH.id + "+0.5))", " iif(" + dataO.id + " > 0.1, " + dataO.id + ", (" + dataH.id + "*0.3)+(" + dataO.id + "*0.2))");
         PM(ImageWindow.activeWindow.currentView, dataH.id, "(" + dataH.id + "*.01)+(" + dataO.id + "*~.01)", dataO.id);
         PM(ImageWindow.activeWindow.currentView, "iif(" + dataH.id + " > 0.15, " + dataH.id + ", (" + dataH.id + "*0.8)+(" + dataO.id + "*0.2))", "(avg(iif(" + dataH.id + " >0.5, 1-(1-" + dataO.id + ")*(1-(" + dataH.id + "-0.5)), " + dataO.id + "*(" + dataH.id + "+0.5)), (" + dataH.id + "*.01)+(" + dataO.id + "*~.01)))*0.8", "(iif(" + dataO.id + " > 0.1, " + dataO.id + ", (" + dataH.id + "*0.3)+(" + dataO.id + "*0.2)))*0.7+" + dataO.id + "*0.2+" + dataH.id + "*0.17");
         PM(ImageWindow.activeWindow.currentView, dataH.id, "" + dataO.id + "*0.8+" + dataH.id + "*0.2", dataO.id + "*1.1");
         PM(ImageWindow.activeWindow.currentView, "iif(" + dataH.id + ">0.15, " + dataH.id + ", (" + dataH.id + "*0.8+" + dataO.id + "*0.2))", "iif(" + dataH.id + ">0.5,1-(1-" + dataO.id + ")*(1-(" + dataH.id + "-0.5))," + dataO.id + "*(" + dataH.id + "+0.5))", "iif(" + dataO.id + ">0.1, " + dataO.id + ", " + dataH.id + "*0.3+" + dataO.id + "*0.2)");
         PM(ImageWindow.activeWindow.currentView, dataH.id, dataO.id, dataO.id + "+" + dataH.id + "/5");
      }
      if (etatAutres) {
         PM(ImageWindow.activeWindow.currentView, dataH.id, dataS.id, dataO.id);
         PM(ImageWindow.activeWindow.currentView, dataH.id, dataS.id, dataS.id);
         PM(ImageWindow.activeWindow.currentView, dataO.id, dataH.id, dataS.id);
         PM(ImageWindow.activeWindow.currentView, dataH.id, dataO.id, dataS.id);
      }
      end = new Date();
      diff = end - start;
      diff = new Date(diff);
      var msec = diff.getMilliseconds();
      var sec = diff.getSeconds();
      var min = diff.getMinutes();
      var hr = diff.getHours() - 1;
      console.write(time + hr + "h " + min + "mn " + sec + "s " + msec + "ms");
   }
};
main();

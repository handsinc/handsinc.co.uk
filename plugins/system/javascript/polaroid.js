if ((navigator.appName == "Microsoft Internet Explorer")) {
  if (document.namespaces['v'] == null) {
    document.namespaces.add('v','urn:schames-microsoft-com:vml');
   }
}

function makePolaroid(el, rotation, bordercolorvalue, borderwidthvalue, shadowcolorvalue, shadowopacityvalue) {

  var img = el;

  var bordercolor = "#FFFFFF";
  if (bordercolorvalue != "") {
    bordercolor = bordercolorvalue;
  }
  var borderwidth = Math.round((img.height+img.width)*0.03);
  if (borderwidthvalue != "") {
    borderwidth = borderwidthvalue;
  }
  var shadowcolor = "#000000";
  if (shadowcolorvalue != "") {
    shadowcolor = shadowcolorvalue;
  }
  var scRed = parseInt("0X"+shadowcolor.substring(1,2));
  var scGreen = parseInt("0X"+shadowcolor.substring(3,4));
  var scBlue = parseInt("0X"+shadowcolor.substring(5,6));  
  
  var shadowopacity = "0.4";
  if (shadowopacityvalue != "") {
    shadowopacity = shadowopacityvalue;
  }

  shadowoffset = Math.round((img.height+img.width)*0.01);

  var A1 = 0.088 * (img.width+borderwidth*2+shadowoffset*2);
  var A2 = 0.997 * (img.width+borderwidth*2+shadowoffset*2);
  var A3 = 0.088 * (img.height+borderwidth*2+shadowoffset*2);
  var A4 = 0.997 * (img.height+borderwidth*2+shadowoffset*2);
  var imageheight = A1+A4;
  var imagewidth = A2+A3;
  if (!(navigator.appName == "Microsoft Internet Explorer")) {
    parent = img.parentNode;
    canvas = document.createElement('canvas');
    canvas.height = imageheight;
    canvas.width = imagewidth;
    canvas.src = img.src;
    canvas.alt = img.alt;
    canvas.title = img.title;
    context = canvas.getContext("2d");
    // rotate 5 degrees
    var rotvalue = 0;
    var rotoffsetleft;
    var rotoffsettop;
    if (imagewidth > imageheight) {
      scalex = 0.05;
      scaley = scalex*(imagewidth/imageheight);
    } else if (imagewidth < imageheight) {
      scaley = 0.05;
      scalex = scaley*(imageheight/imagewidth);
    } else {
      scalex = 0.05;
      scaley = 0.05;
    }
    scale = 1.333333;
    transl = Math.round(Math.max(canvas.width,canvas.height)*0.05);
    if (rotation == "left") {
      rotvalue = -0.05;
      rotoffsetleft = 0;
      rotoffsettop = A1;
      context.scale(1-(scale*scalex),1-(scale*scaley));
      context.translate(0,transl);
    } else  if (rotation == "no") {
      rotvalue = 0;
      rotoffsetleft = 0;
      rotoffsettop = 0;
      context.scale(1-(scalex/scale), 1-(scaley/scale));
    } else {
      rotvalue = 0.05;
      rotoffsetleft=A3;
      rotoffsettop=0;
      context.scale(1-(scale*scalex),1-(scale*scaley));
      context.translate(transl,0);
    }
 
    context.rotate(rotvalue);

    // start drawing the shadow
    sop = Math.min(parseFloat(shadowopacity+0.1),1.0);
    context.fillStyle=shadowcolor;
    context.globalAlpha = shadowopacity;
    context.beginPath(); 
    context.rect(shadowoffset*2,imageheight-shadowoffset,imagewidth-(shadowoffset*2.25),shadowoffset); 
    context.closePath(); 
    context.fill();	
    context.beginPath(); 
    context.rect(shadowoffset,imageheight-shadowoffset,shadowoffset,shadowoffset); 
    context.closePath();
    gradient = context.createLinearGradient(shadowoffset*2,imageheight-shadowoffset, shadowoffset, imageheight-shadowoffset);
    gradient.addColorStop(0, 'rgba('+scRed+','+scGreen+','+scBlue+','+sop+')');
    gradient.addColorStop(0.25, 'rgba('+scRed+','+scGreen+','+scBlue+','+shadowopacity+')');
    gradient.addColorStop(1, 'rgba('+scRed+','+scGreen+','+scBlue+',0)');
    context.fillStyle=gradient; 
    context.fill();	 	
    context.beginPath(); 
    context.moveTo(imagewidth-shadowoffset,shadowoffset*2); 
    context.lineTo(imagewidth,shadowoffset*2); 
    context.quadraticCurveTo(imagewidth-shadowoffset,shadowoffset+(imageheight/2),imagewidth,imageheight-(shadowoffset*0.25));
    context.lineTo(imagewidth-shadowoffset,imageheight-(shadowoffset*0.25)); 
    context.quadraticCurveTo(imagewidth-(shadowoffset*2),shadowoffset+(imageheight/2),imagewidth-shadowoffset,shadowoffset*2); 
    context.closePath(); 
    context.fill();
    context.beginPath(); 
    context.rect(shadowoffset,imageheight,shadowoffset,shadowoffset); 
    context.closePath();
    gradient = context.createRadialGradient(shadowoffset*2,imageheight,0, 2*shadowoffset, imageheight, shadowoffset);
    gradient.addColorStop(0, 'rgba('+scRed+','+scGreen+','+scBlue+','+sop+')');
    gradient.addColorStop(0.25, 'rgba('+scRed+','+scGreen+','+scBlue+','+shadowopacity+')');
    gradient.addColorStop(1, 'rgba('+scRed+','+scGreen+','+scBlue+',0)');
    context.fillStyle=gradient; 
    context.fill();	 
    context.beginPath(); 
    context.rect(shadowoffset*2,imageheight,imagewidth-(shadowoffset*2.25),shadowoffset); 
    context.closePath();
    gradient = context.createLinearGradient(shadowoffset*2,imageheight,2*shadowoffset, imageheight+shadowoffset);
    gradient.addColorStop(0, 'rgba('+scRed+','+scGreen+','+scBlue+','+sop+')');
    gradient.addColorStop(0.25, 'rgba('+scRed+','+scGreen+','+scBlue+','+shadowopacity+')');
    gradient.addColorStop(1, 'rgba('+scRed+','+scGreen+','+scBlue+',0)');
    context.fillStyle=gradient; 
    context.fill();	 
    context.beginPath(); 
    context.rect(imagewidth-(shadowoffset*0.25),imageheight-(shadowoffset*0.25),shadowoffset*1.25,shadowoffset*1.25); 
    context.closePath();
    gradient = context.createRadialGradient(imagewidth-(shadowoffset*0.25),imageheight-(shadowoffset*0.25),Math.max(0,(shadowoffset*1.25)-1.5-shadowoffset), imagewidth-(shadowoffset*0.25), imageheight-(shadowoffset*0.25),shadowoffset*1.25);
    gradient.addColorStop(0, 'rgba('+scRed+','+scGreen+','+scBlue+','+sop+')');
    gradient.addColorStop(0.25, 'rgba('+scRed+','+scGreen+','+scBlue+','+shadowopacity+')');
    gradient.addColorStop(1, 'rgba('+scRed+','+scGreen+','+scBlue+',0)');
    context.fillStyle=gradient; 
    context.fill();
    context.beginPath(); 
    context.moveTo(imagewidth,shadowoffset*2); 
    context.lineTo(shadowoffset+imagewidth,shadowoffset*2); 
    context.quadraticCurveTo(imagewidth,shadowoffset+(imageheight/2),shadowoffset+imagewidth,imageheight-(shadowoffset*0.25)); 
    context.lineTo(imagewidth,imageheight-(shadowoffset*0.25)); 
    context.quadraticCurveTo(imagewidth-shadowoffset,shadowoffset+(imageheight/2),imagewidth,shadowoffset*2); 
    context.closePath();
    gradient = context.createLinearGradient(imagewidth,2*shadowoffset, imagewidth+shadowoffset, shadowoffset*2);
    gradient.addColorStop(0, 'rgba('+scRed+','+scGreen+','+scBlue+','+sop+')');
    gradient.addColorStop(0.25, 'rgba('+scRed+','+scGreen+','+scBlue+','+shadowopacity+')');
    gradient.addColorStop(1, 'rgba('+scRed+','+scGreen+','+scBlue+',0)');
    context.fillStyle=gradient; 
    context.fill();
    context.beginPath(); 
    context.rect(imagewidth,shadowoffset,shadowoffset,shadowoffset); 
    context.closePath();
    gradient = context.createRadialGradient(imagewidth,shadowoffset*2,0, imagewidth, shadowoffset*2,shadowoffset);
    gradient.addColorStop(0, 'rgba('+scRed+','+scGreen+','+scBlue+','+sop+')');
    gradient.addColorStop(0.25, 'rgba('+scRed+','+scGreen+','+scBlue+','+shadowopacity+')');
    gradient.addColorStop(1, 'rgba('+scRed+','+scGreen+','+scBlue+',0)');
    context.fillStyle=gradient; 
    context.fill();
    context.beginPath(); 
    context.rect(imagewidth-shadowoffset,shadowoffset,shadowoffset,shadowoffset); 
    context.closePath(); 
    gradient = context.createLinearGradient(imagewidth-shadowoffset,shadowoffset*2,imagewidth-shadowoffset,shadowoffset);
    gradient.addColorStop(0, 'rgba('+scRed+','+scGreen+','+scBlue+','+sop+')');
    gradient.addColorStop(0.25, 'rgba('+scRed+','+scGreen+','+scBlue+','+shadowopacity+')');
    gradient.addColorStop(1, 'rgba('+scRed+','+scGreen+','+scBlue+',0)');
    context.fillStyle=gradient; 
    context.fill();
    
    // draw border
    context.globalAlpha = 1;
    context.fillStyle = bordercolor;
    context.fillRect(0,0,imagewidth, imageheight);
    context.fillStyle = 'rgba('+scRed+','+scGreen+','+scBlue+','+shadowopacity+')';
    context.fillRect(borderwidth,borderwidth,imagewidth-(borderwidth*2),imageheight-(borderwidth*2));
    w=imagewidth-(borderwidth*2);
    h=imageheight-(borderwidth*2);
    if(imagewidth>imageheight) {
      x=0; 
      y=(((imagewidth-(borderwidth*2))*(imageheight/imagewidth))-(imageheight-(borderwidth*2)))/2; 
      h=((imagewidth-(borderwidth*2))*(imageheight/imagewidth));
    } else if(imagewidth<imageheight) { 
      y=0; 
      x=(((imageheight-(borderwidth*2))*(canvas.width/canvas.height))-((imagewidth-(borderwidth*2))))/2; 
      w=((imageheight-(borderwidth*2))*(canvas.width/canvas.height));
    } else {
      x=0; 
      y=0;
    }
    context.save();
    context.beginPath();  
    context.rect(borderwidth,borderwidth,w-(2*x),h-(2*y));
    context.closePath();
    context.clip();
    context.drawImage(img,borderwidth-x,borderwidth-y,w,h);
    context.restore();
    parent.replaceChild(canvas, img);
  } else {
    // try VML for IE
    // this should be here and not on top for IE6
    var mycss = document.createStyleSheet();
    mycss.cssText="v\\:group, v\\:rect, v\\:fill,v\\:image {behavior:url(#default#VML);}";
   
    var vml = document.createElement("v:group");
    vml.style.width = imagewidth+"px";
    vml.style.height = imageheight+"px";
    vml.style.position = "relative";
    vml.style.padding = "0px";
    vml.style.margin = "1px";
    vml.style.display = "block";
    vml.setAttribute("coordsize", imagewidth+" "+imageheight);
    if (rotation == "left") {
      vml.style.rotation = "-3";
    } else if (rotation == "no") {
      // do nothing
      ;
    } else {
      vml.style.rotation = "3";
    }
    var shadowrect = document.createElement("v:rect");
    shadowrect.style.width = (img.width+borderwidth*2)+"px";
    shadowrect.style.height = (img.height+borderwidth*2)+"px";
    shadowrect.setAttribute("stroked","f");
    shadowrect.style.position = "absolute";
   
    shadowrect.style.filter = "Alpha(opacity="+(shadowopacity*100)+"), progid:dxImageTransform.Microsoft.Blur(PixelRadius="+shadowoffset+", MakeShadow=false";
    var shadowfill = document.createElement("v:fill");
    shadowfill.setAttribute("color", shadowcolor);
    shadowfill.setAttribute("opacity", shadowopacity);
    shadowrect.appendChild(shadowfill);
    vml.appendChild(shadowrect);

    var borderrect = document.createElement("v:rect");
    var borderrectwidth = img.width+borderwidth*2;
    borderrect.style.width = borderrectwidth+"px";
    borderrect.style.height = (img.height+borderwidth*2)+"px";
    borderrect.setAttribute("fillcolor", bordercolor);
    borderrect.setAttribute("stroked","f");
    vml.appendChild(borderrect);

    var imgrect = document.createElement("v:image");
    imgrect.style.width = img.width+"px";
    imgrect.style.height = img.height+"px";
    imgrect.style.position = "absolute";
    imgrect.style.top = borderwidth+"px";
    imgrect.style.left = borderwidth+"px";
    imgrect.setAttribute("src", img.src);
    imgrect.setAttribute("stroked","f");
    vml.appendChild(imgrect);
 
    var vmldiv = document.createElement("div");
    vmldiv.style.width = imagewidth+"px";
    vmldiv.appendChild(vml);
    var parent = img.parentNode;
    vml.alt = img.alt;
    vml.title = img.title;
    parent.replaceChild(vmldiv, img);

  }
}

// crop two images to be the same size
function crop(image,width,height){
 var n = new SimpleImage(width,height);
 for(var p of image.values()){
 var x = p.getX();
 var y = p.getY();
 if (x < width && y < height){
 var np = n.getPixel(x,y);
 np.setRed(p.getRed());
 np.setBlue(p.getBlue());
 np.setGreen(p.getGreen()); 
 }
 }
 return n;
}

var start = new SimpleImage("food.png");
var hide = new SimpleImage("work.jpg");

var cropWidth = start.getWidth();
if (hide.getWidth() < cropWidth) {
 cropWidth = hide.getWidth();
}
var cropHeight = start.getHeight();
if (hide.getHeight() < cropHeight) {
 cropHeight = hide.getHeight();
}
startc = crop(start,cropWidth, cropHeight);
hidec = crop(hide,cropWidth, cropHeight);
print(startc);
print(hidec);

// STEP2:
// steganography: hide image "hide" in image "start"
function pixchange(pixval){
 var x = Math.floor(pixval/16) * 16;
 return x;
}
function chop2hide(image){
 for(var px of image.values()){
 px.setRed(pixchange(px.getRed()));
 px.setGreen(pixchange(px.getGreen()));
 px.setBlue(pixchange(px.getBlue()));
 }
 return image;
}
function shift(im){
 var nim = new SimpleImage(im.getWidth(), 
 im.getHeight());
 for(var px of im.values()){
 var x = px.getX();
 var y = px.getY();
 var npx = nim.getPixel(x,y);
 npx.setRed(Math.floor(px.getRed()/16));
 npx.setGreen(Math.floor(px.getGreen()/16));
 npx.setBlue(Math.floor(px.getBlue()/16));
 }
 return nim;
}

starts = chop2hide(startc);
hides = shift(hidec);
print(starts);print(hides);

// STEP3:
// steganography: combine the above two images
// Combine image "starts"&"hides" = hide image "hide" in "start"
function newpv(va,vb){
    var answer=va+vb;
    if (va+vb>255) print("Dude, you screwed up something, an RGB component > 255"); 
    return answer;
}
function combine(a,b){
    var n = new SimpleImage (a.getWidth(),a.getHeight());
    for (var pa of a.values()){
        var x = pa.getX();
        var y = pa.getY();
        var pb = b.getPixel (x,y);
        var np = n.getPixel (x,y);
        np.setRed(newpv(pa.getRed(),pb.getRed()));
        np.setGreen(newpv(pa.getGreen(),pb.getGreen()));
        np.setBlue(newpv(pa.getBlue(),pb.getBlue()));
    }
    return n;
}
combinedimage=combine(starts,hides);
print(combinedimage);

// extract the hidden image

function pchange(n){
    var value = (n-Math.floor(n/16)*32)*32;
    return value;
}
function extract(i){
    for(var ip of i.values()){
        ip.setRed(pchange(ip.getRed()));
        ip.setGreen(pchange(ip.getGreen()));
        ip.setBlue(pchange(ip.getBlue()));
    }
    return i;
}
hiddenimage = extract(combinedimage);
print(hiddenimage);

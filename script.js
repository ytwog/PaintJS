const _TOOLS = {
  pencyl: 0,
  bucket: 1
}

let inputRangeX, inputRangeY; // Range elements
let textElements = {};
let canvasData = {
  bucketingColor: 'F000',
  width: 20,
  height: 12,
  tool: _TOOLS.pencyl,
  color: '#000',
  pixels: [],
  colors: ['000', '222', '444', '666', '999', 'BBB', 'FFF', 'F0F', 'F5F', 'FAF',
           '400', '700', 'B00', 'F00', 'F44', 'F88', 'FAA', '303', '606', '6A6',
           '040', '070', '0B0', '0F0', '4F4', '8F8', 'AFA', '19F', '4F7', '937',
           '004', '007', '00B', '00F', '44F', '88F', 'AAF', '74B', '9FA', 'B4B']
}
let images = {
  pencyl: 'https://spng.pngfind.com/pngs/s/317-3173089_png-file-svg-pencil-light-blue-icon-transparent.png',
  bucket: 'https://www.seekpng.com/png/detail/34-343844_fill-color-icon-photoshop-paint-bucket-icon.png'
}

function bucketPaint(element) {
  if(canvasData.bucketingColor == element.css('backgroundColor') &&
    canvasData.bucketingColor != canvasData.color) {
    let indexElement = element.index();
    element.css('backgroundColor', canvasData.color);
    bucketPaint(element.parent().prev().children().eq(indexElement));
    bucketPaint(element.parent().next().children().eq(indexElement));
    bucketPaint(element.prev());
    bucketPaint(element.next());
  }
}

function mouseOverPixel(event) {
  let element = $(event.target);
  if(canvasData.pressed) {
    switch(canvasData.tool) {
      case _TOOLS.pencyl:
        element.css('backgroundColor', canvasData.color);
        break;
      case _TOOLS.bucket:
        canvasData.bucketingColor =  element.css('backgroundColor');
        bucketPaint(element);
        break;
    }
  }
}
$(document).on('mouseup', (event) => {canvasData.pressed = false;event.preventDefault();});

function loadPage() {
  let panelSize = 4;
  let blockPanel = $('#paint-panel').eq(0);
  let blockDivs = new Array($('<div class="_block">', { html: ''}));
  for(let i = 1; i < panelSize; i++) // Cloning N divs into the list
    blockDivs.push(blockDivs[0].clone());
  blockDivs[panelSize-2].css('width', '30em');
  blockDivs[panelSize-1].css('width', '100%');
  blockPanel.append(...blockDivs); // Adding those divs into page

  // Create ranges
  inputRangeX = $('<input>', {type: 'range', min: 1, max: 32, value: canvasData.width});
  inputRangeY = $('<input>', {type: 'range', min: 1, max: 16, value: canvasData.height});
  // Create text elements
  textElements.canvasX = $('<p>', {html: 'width: '});
  textElements.canvasY = $('<p>', {html: 'height: '});

  textElements.canvasXValue = $('<p>', {html: ``});
  textElements.canvasYValue = $('<p>', {html: ``});
  // Updating every panel block
  blockDivs.forEach((element, index) => {
      switch(index) { // 
        case 0: // Size block
          element.append(textElements.canvasX);
          widthDiv = $('<div class="_flexable">');
          widthDiv.append(inputRangeX);
          widthDiv.append(textElements.canvasXValue);
          element.append(widthDiv);
          inputRangeX.on('input', (event)=>{
            textElements.canvasXValue.html(inputRangeX.val());
            printCanvas(inputRangeX.val(), inputRangeY.val());
          });
          textElements.canvasXValue.html(`${inputRangeX.val()}`);
          heightDiv = $('<div class="_flexable">');
          element.append(textElements.canvasY);
          heightDiv.append(inputRangeY);
          heightDiv.append(textElements.canvasYValue);
          element.append(heightDiv);
          inputRangeY.on('input', (event)=>{
            textElements.canvasYValue.html(inputRangeY.val());
            printCanvas(inputRangeX.val(), inputRangeY.val());
          });
          textElements.canvasYValue.html(`${inputRangeY.val()}`);
          break;
        case 1: // Tool block
          textElements.toolLabel = $('<p>', {html: 'tool'});
          toolsDivUpper = $('<div class="_flexable">');
          toolPencyl = $('<button>').append($(`<img src=${images.pencyl} alt="pencyl" width="18px" height="18px" style="float:right">`)).click(event=> {
            canvasData.tool = _TOOLS.pencyl;
          });
          toolBucket = $('<button>').append($(`<img src=${images.bucket} alt="bucket" width="18px" height="18px" style="float:right">`)).click(event=> {
            canvasData.tool = _TOOLS.bucket;
          });
          toolsDivUpper.append(toolPencyl);
          toolsDivUpper.append(toolBucket);
          element.append(textElements.toolLabel);
          element.append(toolsDivUpper);
          break;
        case 2: // Color block
          textElements.colorLabel = $('<p>', {html: 'color'});
          mainColor = $('<button class="color">').css('backgroundColor', `#${canvasData.color}`).css('margin-bottom', '1em');
          colorDivUpper = $('<div class="_flexable">');
          colorDivMiddle = $('<div class="_flexable">');
          colorDivLower = $('<div class="_flexable">');
          colorDivBottom = $('<div class="_flexable">');
          colorsRowLength = Math.ceil(canvasData.colors.length / 4);
          canvasData.colors.forEach((element, index) => {
            let colorButton = $('<button class="color">').css('backgroundColor', `#${element}`);
            
            if(index >= 3*colorsRowLength)
              colorDivBottom.append(colorButton);
            else if(index >= 2*colorsRowLength)
              colorDivMiddle.append(colorButton);
            else if(index >= colorsRowLength)
              colorDivLower.append(colorButton);
            else
              colorDivUpper.append(colorButton);
            colorButton.eq(0).click(event => {
              canvasData.color = $(event.target).css('backgroundColor');
              mainColor.css('backgroundColor', `${canvasData.color}`);
            })
          })
          element.append(textElements.colorLabel);
          element.append(mainColor);
          element.append(colorDivUpper);
          element.append(colorDivMiddle);
          element.append(colorDivLower);
          element.append(colorDivBottom);
      }
  });
  $('#paint-canvas').children().filter('p').remove();
}

function printCanvas(width, height) {
  
  if(parseInt(height) == NaN) return;
  if(parseInt(width) == NaN) return;
  canvasData.width = parseInt(width);
  canvasData.height = parseInt(height);
  let singleRow = new Array(canvasData.width);
  singleRow.fill('#FFF');
  canvasData.pixels = new Array(canvasData.height);
  canvasData.pixels.fill(singleRow);
  let elementCanvas = $('#paint-canvas');
  if(canvasData.pixels != undefined && canvasData.pixels.length > 0) {
    elementCanvas.empty();
  }
  canvasData.pixels.forEach((canvasRow, index) => {
    rowElement = $('<div>').css('justify-content', 'center').css(
      'display', 'flex'
    );
    elementCanvas.append(rowElement);
    canvasRow.forEach((canvasPixel, index) => {
      pixelElement = $('<div class="pixel">').css('color', canvasPixel)
      pixelElement.on('mouseover', mouseOverPixel);
      pixelElement.on('mousedown', (event) => {canvasData.pressed = true;event.preventDefault();mouseOverPixel(event);});
      rowElement.append(pixelElement);
    })
  });

}

loadPage();
printCanvas(canvasData.width, canvasData.height);
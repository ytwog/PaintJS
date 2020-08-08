let inputRangeX, inputRangeY; // Range elements
let textElements = {};
let canvasData = {
  width: 20,
  height: 20,
  color: '#555',
  pixels: []
}
function loadPage() {
  let panelSize = 5;
  let blockPanel = $('#paint-panel').eq(0);
  let blockDivs = new Array($('<div class="_block">', { html: ''}));
  for(let i = 1; i < panelSize; i++) // Cloning N divs into the list
    blockDivs.push(blockDivs[0].clone());
  blockPanel.append(...blockDivs); // Adding those divs into page


  // Create ranges
  inputRangeX = $('<input>', {type: 'range', min: 1, max: 100, value: 20});
  inputRangeY = $('<input>', {type: 'range', min: 1, max: 100, value: 20});
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
      }
  });
  $('#paint-canvas').children().filter('p').remove();
}

function printCanvas(width, height) {
  canvasData.width = width;
  canvasData.height = height;
  if(canvasData.pixels == undefined || canvasData.pixels.length == 0) {
    let singleRow = new Array(width);
    singleRow.fill('#FFF');
    canvasData.pixels = new Array(height);
    canvasData.pixels.fill(singleRow);
    let elementCanvas = $('#paint-canvas');

    canvasData.pixels.forEach((canvasRow, index) => {
      rowElement = $('<div class="_flexable">').css('justify-content', 'center');
      elementCanvas.append(rowElement);
      canvasRow.forEach((canvasPixel, index) => {
        pixelElement = $('<div class="pixel">').css('color', canvasPixel);
        rowElement.append(pixelElement);
      })
    });
  }

}

loadPage();
printCanvas(canvasData.width, canvasData.height);
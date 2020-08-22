(function ($) {
  const result = $('#result');
  let coordinates;
  const canvas = document.getElementById('uploadimage');
  const context = canvas.getContext('2d');

  function processImage(img) {
    $('.image-hide, .text-content-2, .new-download').show();
    $('figure, .attachment-1, .text-content-1').hide();
    $('.images-caman').addClass('images-caman-active');

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const px = imageData.data;
    const len = px.length;
    for (let i = 0; i < len; i += 4) {
      const redPx = px[i];
      const greenPx = px[i + 1];
      const bluePx = px[i + 2];
      const alphaPx = px[i + 3];
    }
    context.putImageData(imageData, 0, 0);

    $('#uploadimage').Jcrop({
      bgOpacity: 0.4,
      allowResize: false,
      allowSelect: false,
      setSelect: [0, 0, 400, 400],
      aspectRatio: 1,
      onSelect(coords) {
        coordinates = coords;
      },
      onRelease() {
        coordinates = null;
      },
    });
    $('#statusedit').hide();
  }

  function displayImage(file, options) {
    currentFile = file;
    if (!loadImage(
      file,
      processImage,
      options,
    )) {
      alert('Your browser does not support the URL or FileReader API');
    }
  }

  function dropChangeHandler(e) {
    e.preventDefault();
    e = e.originalEvent;
    const target = e.dataTransfer || e.target;
    const file = target && target.files && target.files[0];
    const options = {
      maxWidth: 800,
      canvas: true,
      pixelRatio: window.devicePixelRatio,
      downsamplingRatio: 0.5,
    };
    if (!file) {
      return;
    }

    loadImage.parseMetaData(file, (data) => {
      if (data.exif) {
        options.orientation = data.exif.get('Orientation');
      }
      displayImage(file, options);
    });
  }

  $('#attachment').on('change', dropChangeHandler);

  const img2 = loadImage('./assets/images/TECHNI.png');
  const crop_canvas = document.createElement('canvas');
  crop_canvas.width = 1241;
  crop_canvas.height = 1241;
  document.getElementById('download').addEventListener('click', () => {
    const ratioY = canvas.height / result.height();
    const ratioX = canvas.width / result.width();
    const getX = coordinates.x * ratioX;
    const getY = coordinates.y * ratioY;
    const getWidth = coordinates.h * ratioX;
    const getHeight = coordinates.w * ratioY;

    crop_canvas.getContext('2d').drawImage(canvas, getX, getY, getWidth, getHeight, 0, 0, 1241, 1241);
    crop_canvas.getContext('2d').drawImage(img2, 0, 0, 1241, 1241, 0, 0, 1241, 1241);
    crop_canvas.toBlobHD((blob) => {
      saveAs(blob, 'Twibbon-MAXIMA2020.png');
    }, 'image/png');
  }, false);
}(jQuery));

const copyTextareaBtn = document.querySelector('.js-textareacopybtn');
copyTextareaBtn.addEventListener('click', (event) => {
  const copyTextarea = document.querySelector('.js-copytextarea');
  copyTextarea.select();
  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log(`Copying text command was ${msg}`);
  } catch (err) {
    console.log('Oops, unable to copy');
  }
});

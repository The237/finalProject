document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();
    console.log(e.dataTransfer.files);

    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }
    dropZoneElement.classList.remove("drop-zone--over");
  });
});

function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  // first time, remove the prompt
  if (dropZoneElement.querySelectorAll(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  if (!thumbnailElement) {
    // First time : there is no thumbnail element, se lets create it
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }

  thumbnailElement.dataset.label = file.name;

  //  Show thumbnail for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url(${reader.result})`;
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }
}

async function uploadImage() {
  let formData = new FormData();
  formData.append("file", imageUpload.files[0]);
  let predClass = document.getElementById("class");
  let confidence = document.getElementById("confidence");
  let result = document.getElementById("result");

  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    console.log(data);
    // append the predicted class and the confidence to the page
    result.style.display = "block";
    predClass.textContent = data["Predicted class"];
    confidence.textContent = `${data["confidence"].toFixed(2) * 100} %`;
  } catch (error) {
    console.log("Unable to predict");
  }

  console.log("File uploaded successfully");
}
